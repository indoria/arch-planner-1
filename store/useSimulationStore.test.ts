import { useSimulationStore } from './useSimulationStore';

describe('useSimulationStore - History', () => {
  beforeEach(() => {
    useSimulationStore.getState().resetTelemetry();
    useSimulationStore.getState().clearHistory();
  });

  it('initializes with empty history', () => {
    const state = useSimulationStore.getState();
    expect(state.history).toEqual([]);
    expect(state.currentSnapshotIndex).toBe(-1);
  });

  it('adds a snapshot to history', () => {
    const { addSnapshot } = useSimulationStore.getState();
    const mockSnapshot = {
      timestamp: 1000,
      results: { 'node-1': { status: 'success', latency: 50 } }
    };

    addSnapshot(mockSnapshot as any);

    const state = useSimulationStore.getState();
    expect(state.history).toHaveLength(1);
    expect(state.history[0]).toEqual(mockSnapshot);
    expect(state.currentSnapshotIndex).toBe(0);
    // Should also update current telemetry
    expect(state.nodeTelemetry['node-1'].status).toBe('success');
  });

  it('jumps to a specific snapshot in history', () => {
    const { addSnapshot, jumpToSnapshot } = useSimulationStore.getState();
    
    addSnapshot({ timestamp: 1000, results: { 'n': { status: 'idle' } } } as any);
    addSnapshot({ timestamp: 2000, results: { 'n': { status: 'running' } } } as any);
    addSnapshot({ timestamp: 3000, results: { 'n': { status: 'success' } } } as any);

    jumpToSnapshot(1);

    const state = useSimulationStore.getState();
    expect(state.currentSnapshotIndex).toBe(1);
    expect(state.nodeTelemetry['n'].status).toBe('running');
  });
});
