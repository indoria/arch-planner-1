import { useSimulationStore } from './useSimulationStore';

describe('useSimulationStore - Multi-History', () => {
  beforeEach(() => {
    useSimulationStore.getState().resetTelemetry();
    useSimulationStore.getState().clearHistory();
  });

  it('manages secondary history and telemetry', () => {
    const { addSnapshot } = useSimulationStore.getState();
    
    const primarySnapshot = { timestamp: 100, results: { 'p': { status: 'success' } } };
    const secondarySnapshot = { timestamp: 200, results: { 's': { status: 'running' } } };

    addSnapshot(primarySnapshot as any); // Default to primary
    addSnapshot(secondarySnapshot as any, true); // Add to secondary

    const state = useSimulationStore.getState();
    expect(state.history).toHaveLength(1);
    expect(state.secondaryHistory).toHaveLength(1);
    expect(state.nodeTelemetry['p'].status).toBe('success');
    expect(state.secondaryNodeTelemetry['s'].status).toBe('running');
  });

  it('jumps to snapshot synchronously for both histories', () => {
    const { addSnapshot, jumpToSnapshot } = useSimulationStore.getState();
    
    addSnapshot({ results: { 'p': { status: 'idle' } } } as any);
    addSnapshot({ results: { 's': { status: 'idle' } } } as any, true);
    addSnapshot({ results: { 'p': { status: 'success' } } } as any);
    addSnapshot({ results: { 's': { status: 'error' } } } as any, true);

    jumpToSnapshot(1);

    const state = useSimulationStore.getState();
    expect(state.nodeTelemetry['p'].status).toBe('success');
    expect(state.secondaryNodeTelemetry['s'].status).toBe('error');
  });
});
