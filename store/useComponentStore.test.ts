import { useComponentStore } from './useComponentStore';
import { ComponentDef } from './components';

describe('useComponentStore', () => {
  const originalFetch = global.fetch;

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
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
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

  it('fetches components from the central registry and registers them', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 42,
          name: 'Remote Whisper',
          type: 'stt',
          ownerId: 1,
          data: {
            label: 'Remote Whisper',
            description: 'Centralized Whisper Model',
            cost: 0.004,
            latency: 180,
            sockets: [{ id: 'in', type: 'audio', direction: 'input' }]
          }
        }
      ]
    }) as any;

    await useComponentStore.getState().fetchFromRegistry({ token: 'test-token' });

    const registered = useComponentStore.getState().getComponentById('registry-42');
    expect(registered).toBeDefined();
    expect(registered?.label).toBe('Remote Whisper');
    expect(registered?.type).toBe('stt');
    expect(registered?.numericLatency).toBe(180);
  });

  it('publishes a custom component to the registry and adds it to local repository', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 99,
        name: 'My Custom LLM',
        type: 'llm',
        ownerId: 1,
        data: {
          label: 'My Custom LLM',
          description: 'Fine-tuned model',
          cost: 0.02,
          latency: 400,
          sockets: []
        }
      })
    }) as any;

    const result = await useComponentStore.getState().publishToRegistry(
      {
        name: 'My Custom LLM',
        type: 'llm',
        data: {
          label: 'My Custom LLM',
          description: 'Fine-tuned model',
          cost: 0.02,
          latency: 400,
          sockets: []
        }
      },
      { token: 'test-token' }
    );

    expect(result.id).toBe('registry-99');
    expect(useComponentStore.getState().getComponentById('registry-99')).toBeDefined();
  });
});
