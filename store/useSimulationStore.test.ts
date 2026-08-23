import { useSimulationStore } from './useSimulationStore';

describe('useSimulationStore - Telemetry', () => {
  beforeEach(() => {
    useSimulationStore.getState().resetTelemetry();
  });

  it('initializes with empty telemetry', () => {
    const state = useSimulationStore.getState();
    expect(state.nodeTelemetry).toEqual({});
  });

  it('sets telemetry for a node', () => {
    const { setNodeTelemetry } = useSimulationStore.getState();
    
    setNodeTelemetry('node-1', {
      status: 'success',
      latency: 100,
      output: 'test'
    });

    const state = useSimulationStore.getState();
    expect(state.nodeTelemetry['node-1']).toEqual({
      status: 'success',
      latency: 100,
      output: 'test'
    });
  });

  it('resets telemetry', () => {
    const { setNodeTelemetry, resetTelemetry } = useSimulationStore.getState();
    
    setNodeTelemetry('node-1', { status: 'running', latency: 0 });
    resetTelemetry();

    const state = useSimulationStore.getState();
    expect(state.nodeTelemetry).toEqual({});
  });
});
