import { useComponentStore } from './useComponentStore';
import { ComponentDef } from './components';

describe('useComponentStore', () => {
  const mockComponent: ComponentDef = {
    id: 'c1',
    type: 'asr',
    label: 'ASR',
    description: 'Test',
    cost: '$0',
    numericCost: 0,
    latency: '0ms',
    numericLatency: 0,
    sockets: []
  };

  beforeEach(() => {
    useComponentStore.getState().clearRepository();
  });

  it('forms a repository from provided component models', () => {
    const store = useComponentStore.getState();
    store.registerComponents([mockComponent]);
    
    expect(useComponentStore.getState().repository).toHaveLength(1);
    expect(useComponentStore.getState().repository[0].id).toBe('c1');
  });

  it('searches and retrieves models by type', () => {
    const store = useComponentStore.getState();
    store.registerComponents([mockComponent, { ...mockComponent, id: 'c2', type: 'llm' }]);
    
    const asrComponents = useComponentStore.getState().getComponentsByType('asr');
    expect(asrComponents).toHaveLength(1);
    expect(asrComponents[0].id).toBe('c1');
  });

  it('retrieves a specific model by ID', () => {
    const store = useComponentStore.getState();
    store.registerComponents([mockComponent]);
    
    const component = useComponentStore.getState().getComponentById('c1');
    expect(component).toBeDefined();
    expect(component?.id).toBe('c1');
  });
});
