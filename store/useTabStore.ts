import { create } from 'zustand'

export interface Tab {
  id: string
  title: string
  content: any
}

interface TabState {
  openTabs: Tab[]
  activeTabId: string | null
  openTab: (tab: Tab) => void
  setActiveTab: (id: string | null) => void
  closeTab: (id: string) => void
  closeAllTabs: () => void
}

export const useTabStore = create<TabState>((set) => ({
  openTabs: [],
  activeTabId: null,
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
  setActiveTab: (id) => set({ activeTabId: id }),
  closeTab: (id) =>
    set((state) => {
      const newTabs = state.openTabs.filter((t) => t.id !== id)
      let nextActiveId = state.activeTabId

      if (state.activeTabId === id) {
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
      }
    }),
  closeAllTabs: () => set({ openTabs: [], activeTabId: null }),
}))
