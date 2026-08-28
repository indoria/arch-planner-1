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

export interface BreadcrumbStep {
  label: string
  arch: Architecture
}

interface TabState {
  openTabs: Tab[]
  activeTabId: string | null
  activeArchitecture: Architecture | null
  isSplitView: boolean
  secondaryActiveTabId: string | null
  secondaryActiveArchitecture: Architecture | null
  drillDownStack: BreadcrumbStep[]
  selectedNodeId: string | null
  complaints: Complaint[]
  init: () => Promise<void>
  openTab: (tab: Tab) => void
  setActiveTab: (id: string | null) => void
  setSplitView: (enabled: boolean) => void
  setSecondaryActiveTab: (id: string | null) => void
  drillDown: (node: Node) => void
  goUp: () => void
  resetView: () => void
  closeTab: (id: string) => void
  closeAllTabs: () => void
  addNode: (tabId: string, node: Node) => void
  updateNodePosition: (tabId: string, nodeId: string, position: { x: number, y: number }) => void
  setSelectedNodeId: (id: string | null) => void
  replaceComponent: (tabId: string, nodeId: string, newComponentData: Partial<Node>) => void
  addConnection: (tabId: string, connection: TypedConnection) => void
  createSubArchitecture: (tabId: string, nodeId: string) => void
  addComplaint: (message: string, type?: 'error' | 'warning' | 'info') => void
  clearComplaints: () => void
}

export const useTabStore = create<TabState>((set, get) => {
  const syncToRoot = (state: TabState, newActiveArch: Architecture): Partial<TabState> => {
    if (!state.activeTabId) return {}
    
    let newStack = [...state.drillDownStack]
    let updatedArch = newActiveArch
    
    // Update the stack from top to bottom
    for (let i = newStack.length - 1; i >= 0; i--) {
        const step = newStack[i]
        const parentArch = i === 0 
            ? state.openTabs.find(t => t.id === state.activeTabId)!.content 
            : newStack[i-1].arch
            
        const childArchToReplace = step.arch
        
        // Find the node in parent that contains childArchToReplace
        const newParentArch = {
            ...parentArch,
            nodes: parentArch.nodes.map(node => 
                node.subArchitecture === childArchToReplace 
                    ? { ...node, subArchitecture: updatedArch } 
                    : node
            )
        }
        
        newStack[i] = { ...step, arch: updatedArch }
        updatedArch = newParentArch
    }
    
    const newTabs = state.openTabs.map(tab => 
        tab.id === state.activeTabId ? { ...tab, content: updatedArch } : tab
    )
    
    saveTabs(newTabs)
    return { openTabs: newTabs, drillDownStack: newStack, activeArchitecture: newActiveArch }
  }

  return {
    openTabs: [],
    activeTabId: null,
    activeArchitecture: null,
    isSplitView: false,
    secondaryActiveTabId: null,
    secondaryActiveArchitecture: null,
    drillDownStack: [],
    selectedNodeId: null,
    complaints: [],
    init: async () => {
      const tabs = await loadTabs()
      if (tabs.length > 0) {
        set({ openTabs: tabs, activeTabId: tabs[0].id, activeArchitecture: tabs[0].content, drillDownStack: [] })
      }
    },
    openTab: (tab) => 
      set((state) => {
        const exists = state.openTabs.find((t) => t.id === tab.id)
        if (exists) {
          return { activeTabId: tab.id, activeArchitecture: tab.content, drillDownStack: [] }
        }
        const newState = {
          openTabs: [...state.openTabs, tab],
          activeTabId: tab.id,
          activeArchitecture: tab.content,
          drillDownStack: []
        }
        saveTabs(newState.openTabs)
        return newState
      }),
    setActiveTab: (id) => set((state) => {
      const tab = state.openTabs.find(t => t.id === id)
      return { activeTabId: id, activeArchitecture: tab ? tab.content : null, drillDownStack: [], selectedNodeId: null }
    }),
    setSplitView: (enabled) => set((state) => {
      let secondaryId = state.secondaryActiveTabId
      if (enabled && !secondaryId && state.openTabs.length > 1) {
        // Auto-pick the next tab as secondary if not set
        const currentIndex = state.openTabs.findIndex(t => t.id === state.activeTabId)
        const nextIndex = (currentIndex + 1) % state.openTabs.length
        secondaryId = state.openTabs[nextIndex].id
      }
      const secondaryTab = state.openTabs.find(t => t.id === secondaryId)
      return { 
        isSplitView: enabled, 
        secondaryActiveTabId: secondaryId,
        secondaryActiveArchitecture: secondaryTab ? secondaryTab.content : null
      }
    }),
    setSecondaryActiveTab: (id) => set((state) => {
      const tab = state.openTabs.find(t => t.id === id)
      return { secondaryActiveTabId: id, secondaryActiveArchitecture: tab ? tab.content : null }
    }),
    drillDown: (node) => set((state) => {
        if (!node.subArchitecture) return state
        const newStep = { label: node.label, arch: node.subArchitecture }
        return { 
            drillDownStack: [...state.drillDownStack, newStep],
            activeArchitecture: node.subArchitecture
        }
    }),
    goUp: () => set((state) => {
        if (state.drillDownStack.length === 0) return state
        const newStack = state.drillDownStack.slice(0, -1)
        const activeTab = state.openTabs.find(t => t.id === state.activeTabId)
        const newActiveArch = newStack.length === 0 
            ? activeTab!.content 
            : newStack[newStack.length - 1].arch
        return { drillDownStack: newStack, activeArchitecture: newActiveArch }
    }),
    resetView: () => set((state) => {
      const activeTab = state.openTabs.find(t => t.id === state.activeTabId)
      return { 
        activeArchitecture: activeTab ? activeTab.content : null, 
        drillDownStack: [],
        isSplitView: false,
        secondaryActiveTabId: null,
        secondaryActiveArchitecture: null
      }
    }),
    closeTab: (id) =>
      set((state) => {
        const newTabs = state.openTabs.filter((t) => t.id !== id)
        let nextActiveId = state.activeTabId
        let nextSelectedId = state.selectedNodeId
        let nextArchitecture = state.activeArchitecture
        let nextStack = state.drillDownStack

        if (state.activeTabId === id) {
          nextSelectedId = null
          nextStack = []
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
          drillDownStack: nextStack,
          selectedNodeId: nextSelectedId,
        }
      }),
    closeAllTabs: () => {
      set({ 
        openTabs: [], 
        activeTabId: null, 
        activeArchitecture: null, 
        drillDownStack: [], 
        selectedNodeId: null, 
        complaints: [],
        isSplitView: false,
        secondaryActiveTabId: null,
        secondaryActiveArchitecture: null
      })
      saveTabs([])
    },
    addNode: (tabId, node) =>
      set((state) => {
        if (!state.activeArchitecture) return state
        const newActiveArch = {
          ...state.activeArchitecture,
          nodes: [...state.activeArchitecture.nodes, node],
        }
        return syncToRoot(state, newActiveArch)
      }),
    updateNodePosition: (tabId, nodeId, position) =>
      set((state) => {
        if (!state.activeArchitecture) return state
        const newActiveArch = {
          ...state.activeArchitecture,
          nodes: state.activeArchitecture.nodes.map((node) =>
            node.id === nodeId ? { ...node, position } : node
          ),
        }
        return syncToRoot(state, newActiveArch)
      }),
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),
    replaceComponent: (tabId, nodeId, newComponentData) =>
      set((state) => {
        if (!state.activeArchitecture) return state
        let removedCount = 0
        
        const nodeToReplace = state.activeArchitecture.nodes.find((n) => n.id === nodeId)
        if (!nodeToReplace) return state

        const updatedNodes = state.activeArchitecture.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, ...newComponentData }
            : node
        )

        const newSockets = newComponentData.sockets || []
        
        const updatedConnections = state.activeArchitecture.connections.filter((conn) => {
          let keep = true
          if (conn.sourceNodeId === nodeId) {
            const socket = newSockets.find((s) => s.id === conn.sourceSocketId)
            const oldSocket = nodeToReplace.sockets.find(s => s.id === conn.sourceSocketId)
            keep = !!(socket && oldSocket && socket.type === oldSocket.type)
          } else if (conn.targetNodeId === nodeId) {
            const socket = newSockets.find((s) => s.id === conn.targetSocketId)
            const oldSocket = nodeToReplace.sockets.find(s => s.id === conn.targetSocketId)
            keep = !!(socket && oldSocket && socket.type === oldSocket.type)
          }
          
          if (!keep) removedCount++
          return keep
        })

        const newActiveArch = {
          ...state.activeArchitecture,
          nodes: updatedNodes,
          connections: updatedConnections,
        }

        const syncResult = syncToRoot(state, newActiveArch)
        const newState: Partial<TabState> = { ...syncResult }
        
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
        if (!state.activeArchitecture) return state
        const newActiveArch = {
          ...state.activeArchitecture,
          connections: [...state.activeArchitecture.connections, connection],
        }
        return syncToRoot(state, newActiveArch)
      }),
    createSubArchitecture: (tabId, nodeId) =>
      set((state) => {
        if (!state.activeArchitecture) return state
        const nodeIndex = state.activeArchitecture.nodes.findIndex(n => n.id === nodeId)
        if (nodeIndex === -1) return state
        if (state.activeArchitecture.nodes[nodeIndex].subArchitecture) return state

        const newSubArch: Architecture = { nodes: [], connections: [] }
        const newNodes = [...state.activeArchitecture.nodes]
        newNodes[nodeIndex] = { ...newNodes[nodeIndex], subArchitecture: newSubArch }
        
        const newActiveArch = {
          ...state.activeArchitecture,
          nodes: newNodes,
        }
        return syncToRoot(state, newActiveArch)
      }),
    addComplaint: (message, type = 'error') => 
      set((state) => {
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
  }
})
