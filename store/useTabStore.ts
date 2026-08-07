import { create } from 'zustand'
import { Architecture, Node } from './architecture'

export interface Tab {
  id: string
  title: string
  content: Architecture
}

interface TabState {
  openTabs: Tab[]
  activeTabId: string | null
  selectedNodeId: string | null
  openTab: (tab: Tab) => void
  setActiveTab: (id: string | null) => void
  closeTab: (id: string) => void
  closeAllTabs: () => void
  addNode: (tabId: string, node: Node) => void
  setSelectedNodeId: (id: string | null) => void
}

export const useTabStore = create<TabState>((set) => ({
  openTabs: [],
  activeTabId: null,
  selectedNodeId: null,
  openTab: (tab) => 
    set((state) => {
      const exists = state.openTabs.find((t) => t.id === tab.id)
      if (exists) {
        return { activeTabId: tab.id }
      }
      return {
        openTabs: [...state.openTabs, tab],
        activeTabId: tab.id,
      }
    }),
  setActiveTab: (id) => set({ activeTabId: id, selectedNodeId: null }),
  closeTab: (id) =>
    set((state) => {
      const newTabs = state.openTabs.filter((t) => t.id !== id)
      let nextActiveId = state.activeTabId
      let nextSelectedId = state.selectedNodeId

      if (state.activeTabId === id) {
        nextSelectedId = null
        if (newTabs.length > 0) {
          // Set next active tab to the one at the same index or the last one
          const closedIndex = state.openTabs.findIndex((t) => t.id === id)
          const nextIndex = Math.min(closedIndex, newTabs.length - 1)
          nextActiveId = newTabs[nextIndex].id
        } else {
          nextActiveId = null
        }
      }

      return {
        openTabs: newTabs,
        activeTabId: nextActiveId,
        selectedNodeId: nextSelectedId,
      }
    }),
  closeAllTabs: () => set({ openTabs: [], activeTabId: null, selectedNodeId: null }),
  addNode: (tabId, node) =>
    set((state) => ({
      openTabs: state.openTabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              content: {
                ...tab.content,
                nodes: [...tab.content.nodes, node],
              },
            }
          : tab
      ),
    })),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
}))
