import { create } from 'zustand'
import { ComponentDef, AVAILABLE_COMPONENTS } from './components'

interface ComponentStore {
  repository: ComponentDef[]
  registerComponents: (components: ComponentDef[]) => void
  getComponentsByType: (type: string) => ComponentDef[]
  getComponentById: (id: string) => ComponentDef | undefined
  clearRepository: () => void
}

export const useComponentStore = create<ComponentStore>((set, get) => ({
  repository: AVAILABLE_COMPONENTS,
  
  registerComponents: (newComponents) => set((state) => {
    // Avoid duplicates by ID
    const existingIds = new Set(state.repository.map(c => c.id));
    const filteredNew = newComponents.filter(c => !existingIds.has(c.id));
    return { repository: [...state.repository, ...filteredNew] };
  }),

  getComponentsByType: (type) => {
    return get().repository.filter(c => c.type === type);
  },

  getComponentById: (id) => {
    return get().repository.find(c => c.id === id);
  },

  clearRepository: () => set({ repository: [] })
}))
