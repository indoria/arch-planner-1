import { create } from 'zustand'
import { ComponentDef, AVAILABLE_COMPONENTS } from './components'
import { ComponentRegistryService, ComponentRegistryFilter, PublishComponentInput } from '@/utils/componentRegistryService'

interface ComponentStore {
  repository: ComponentDef[]
  registerComponents: (components: ComponentDef[]) => void
  getComponentsByType: (type: string) => ComponentDef[]
  getComponentById: (id: string) => ComponentDef | undefined
  clearRepository: () => void
  fetchFromRegistry: (options?: ComponentRegistryFilter) => Promise<void>
  publishToRegistry: (input: PublishComponentInput, options?: { token?: string; apiBaseUrl?: string }) => Promise<ComponentDef>
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

  clearRepository: () => set({ repository: [] }),

  fetchFromRegistry: async (options?: ComponentRegistryFilter) => {
    const components = await ComponentRegistryService.getComponents(options);
    const converted: ComponentDef[] = components.map((c) => ({
      id: `registry-${c.id}`,
      type: c.type,
      label: c.name || c.data?.label || 'Custom Component',
      description: c.data?.description || '',
      cost: c.data?.cost ? (typeof c.data.cost === 'string' ? c.data.cost : `$${c.data.cost}`) : '$0.01/min',
      numericCost: typeof c.data?.numericCost === 'number' ? c.data.numericCost : (typeof c.data?.cost === 'number' ? c.data.cost : 0.01),
      latency: c.data?.latency ? (typeof c.data.latency === 'string' ? c.data.latency : `${c.data.latency}ms`) : '200ms',
      numericLatency: typeof c.data?.numericLatency === 'number' ? c.data.numericLatency : (parseInt(c.data?.latency) || 200),
      sockets: c.data?.sockets || []
    }));
    get().registerComponents(converted);
  },

  publishToRegistry: async (input: PublishComponentInput, options?: { token?: string; apiBaseUrl?: string }) => {
    const created = await ComponentRegistryService.publishComponent(input, options);
    const def: ComponentDef = {
      id: `registry-${created.id}`,
      type: created.type,
      label: created.name || created.data?.label || 'Custom Component',
      description: created.data?.description || '',
      cost: created.data?.cost ? (typeof created.data.cost === 'string' ? created.data.cost : `$${created.data.cost}`) : '$0.01/min',
      numericCost: typeof created.data?.numericCost === 'number' ? created.data.numericCost : (typeof created.data?.cost === 'number' ? created.data.cost : 0.01),
      latency: created.data?.latency ? (typeof created.data.latency === 'string' ? created.data.latency : `${created.data.latency}ms`) : '200ms',
      numericLatency: typeof created.data?.numericLatency === 'number' ? created.data.numericLatency : (parseInt(created.data?.latency) || 200),
      sockets: created.data?.sockets || []
    };
    get().registerComponents([def]);
    return def;
  }
}))
