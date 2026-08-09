import { create } from 'zustand'
import { Architecture, Node, Socket, TypedConnection } from './architecture'
import { saveTabs, loadTabs } from './persistence'

export interface Tab {
  id: string
  title: string
  content: Architecture
}

export interface Complaint {
  id: string
  message: string
  timestamp: number
  type: 'error' | 'warning' | 'info'
}

interface TabState {
  openTabs: Tab[]
  activeTabId: string | null
  activeArchitecture: Architecture | null
  selectedNodeId: string | null
  complaints: Complaint[]
  init: () => Promise<void>
  openTab: (tab: Tab) => void
  setActiveTab: (id: string | null) => void
  drillDown: (node: Node) => void
  resetView: () => void
  closeTab: (id: string) => void
  closeAllTabs: () => void
  addNode: (tabId: string, node: Node) => void
  updateNodePosition: (tabId: string, nodeId: string, position: { x: number, y: number }) => void
  setSelectedNodeId: (id: string | null) => void
  replaceComponent: (tabId: string, nodeId: string, newComponentData: Partial<Node>) => void
  addConnection: (tabId: string, connection: TypedConnection) => void
  addComplaint: (message: string, type?: 'error' | 'warning' | 'info') => void
  clearComplaints: () => void
}

export const useTabStore = create<TabState>((set, get) => ({
  openTabs: [],
  activeTabId: null,
  activeArchitecture: null,
  selectedNodeId: null,
  complaints: [],
  init: async () => {
    const tabs = await loadTabs()
    if (tabs.length > 0) {
      set({ openTabs: tabs, activeTabId: tabs[0].id, activeArchitecture: tabs[0].content })
    }
  },
  openTab: (tab) => 
    set((state) => {
      const exists = state.openTabs.find((t) => t.id === tab.id)
      if (exists) {
        return { activeTabId: tab.id, activeArchitecture: tab.content }
      }
      const newState = {
        openTabs: [...state.openTabs, tab],
        activeTabId: tab.id,
        activeArchitecture: tab.content,
      }
      saveTabs(newState.openTabs)
      return newState
    }),
  setActiveTab: (id) => set((state) => {
    const tab = state.openTabs.find(t => t.id === id)
    return { activeTabId: id, activeArchitecture: tab ? tab.content : null, selectedNodeId: null }
  }),
  drillDown: (node) => set((state) => ({ activeArchitecture: node.subArchitecture || state.activeArchitecture })),
  resetView: () => set((state) => {
    const activeTab = state.openTabs.find(t => t.id === state.activeTabId)
    return { activeArchitecture: activeTab ? activeTab.content : null }
  }),
  closeTab: (id) =>
    set((state) => {
      const newTabs = state.openTabs.filter((t) => t.id !== id)
      let nextActiveId = state.activeTabId
      let nextSelectedId = state.selectedNodeId
      let nextArchitecture = state.activeArchitecture

      if (state.activeTabId === id) {
        nextSelectedId = null
        if (newTabs.length > 0) {
          const closedIndex = state.openTabs.findIndex((t) => t.id === id)
          const nextIndex = Math.min(closedIndex, newTabs.length - 1)
          nextActiveId = newTabs[nextIndex].id
          nextArchitecture = newTabs[nextIndex].content
        } else {
          nextActiveId = null
          nextArchitecture = null
        }
      }

      saveTabs(newTabs)
      return {
        openTabs: newTabs,
        activeTabId: nextActiveId,
        activeArchitecture: nextArchitecture,
        selectedNodeId: nextSelectedId,
      }
    }),
  closeAllTabs: () => {
    set({ openTabs: [], activeTabId: null, activeArchitecture: null, selectedNodeId: null, complaints: [] })
    saveTabs([])
  },
  addNode: (tabId, node) =>
    set((state) => {
      const newTabs = state.openTabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              content: {
                ...tab.content,
                nodes: [...tab.content.nodes, node],
              },
            }
          : tab
      )
      saveTabs(newTabs)
      
      // Update activeArchitecture if we're adding to the currently viewed arch
      let newActiveArch = state.activeArchitecture
      const activeTab = newTabs.find(t => t.id === tabId)
      if (activeTab && activeTab.content === state.activeArchitecture) {
          newActiveArch = activeTab.content
      }

      return { openTabs: newTabs, activeArchitecture: newActiveArch }
    }),
  updateNodePosition: (tabId, nodeId, position) =>
    set((state) => {
      const newTabs = state.openTabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              content: {
                ...tab.content,
                nodes: tab.content.nodes.map((node) =>
                  node.id === nodeId ? { ...node, position } : node
                ),
              },
            }
          : tab
      )
      saveTabs(newTabs)
      return { openTabs: newTabs }
    }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  replaceComponent: (tabId, nodeId, newComponentData) =>
    set((state) => {
      let removedCount = 0
      const newOpenTabs = state.openTabs.map((tab) => {
        if (tab.id !== tabId) return tab

        const nodeToReplace = tab.content.nodes.find((n) => n.id === nodeId)
        if (!nodeToReplace) return tab

        const updatedNodes = tab.content.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, ...newComponentData }
            : node
        )

        const newSockets = newComponentData.sockets || []
        
        const updatedConnections = tab.content.connections.filter((conn) => {
          let keep = true
          if (conn.sourceNodeId === nodeId) {
            const socket = newSockets.find((s) => s.id === conn.sourceSocketId)
            keep = !!(socket && socket.type === tab.content.nodes.find(n => n.id === nodeId)?.sockets.find(s => s.id === conn.sourceSocketId)?.type)
          } else if (conn.targetNodeId === nodeId) {
            const socket = newSockets.find((s) => s.id === conn.targetSocketId)
            keep = !!(socket && socket.type === tab.content.nodes.find(n => n.id === nodeId)?.sockets.find(s => s.id === conn.targetSocketId)?.type)
          }
          
          if (!keep) removedCount++
          return keep
        })

        return {
          ...tab,
          content: {
            ...tab.content,
            nodes: updatedNodes,
            connections: updatedConnections,
          },
        }
      })

      saveTabs(newOpenTabs)
      const newState: Partial<TabState> = { openTabs: newOpenTabs }
      if (removedCount > 0) {
        newState.complaints = [
          {
            id: `complaint-${Date.now()}`,
            message: `Swapping component removed ${removedCount} incompatible connection(s).`,
            timestamp: Date.now(),
            type: 'warning'
          },
          ...state.complaints
        ]
      }

      return newState
    }),
  addConnection: (tabId, connection) =>
    set((state) => {
      const newTabs = state.openTabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              content: {
                ...tab.content,
                connections: [...tab.content.connections, connection],
              },
            }
          : tab
      )
      saveTabs(newTabs)
      return { openTabs: newTabs }
    }),
  addComplaint: (message, type = 'error') => 
    set((state) => {
      // Basic debounce/duplicate prevention: don't add if the last complaint is identical and recent
      const lastComplaint = state.complaints[0]
      if (lastComplaint && lastComplaint.message === message && Date.now() - lastComplaint.timestamp < 1000) {
        return state
      }

      return {
        complaints: [
          {
            id: `complaint-${Date.now()}`,
            message,
            timestamp: Date.now(),
            type
          },
          ...state.complaints
        ]
      }
    }),
  clearComplaints: () => set({ complaints: [] }),
}))
