import { SimulationEngine } from './SimulationEngine';
import { ScriptRuntime } from './ScriptRuntime';
import { Architecture } from '../store/architecture';
import { runSimulation } from '../store/simulationActions';
import { useSimulationStore } from '../store/useSimulationStore';
import { useTabStore } from '../store/useTabStore';

jest.mock('../store/simulationActions', () => {
    const actual = jest.requireActual('../store/simulationActions');
    return {
        ...actual,
        // We don't want to mock the whole thing, just the dependencies
    }
});

describe('Parallel Simulation Stress Test', () => {
  let runtime: ScriptRuntime;

  beforeEach(() => {
    runtime = new ScriptRuntime();
    useSimulationStore.getState().resetTelemetry();
    useTabStore.getState().resetView();
  });

  const createComplexArch = (numNodes: number): Architecture => {
    const nodes = Array.from({ length: numNodes }, (_, i) => ({
      id: `node-${i}`,
      type: 'processor',
      label: `Node ${i}`,
      sockets: [
        { id: `in-${i}`, type: 'text', direction: 'input' },
        { id: `out-${i}`, type: 'text', direction: 'output' }
      ],
      position: { x: i * 100, y: 0 },
      data: { script: 'return input.data + " processed";', latency: 5 }
    }));

    // Chain them together
    const connections = Array.from({ length: numNodes - 1 }, (_, i) => ({
      id: `conn-${i}`,
      sourceNodeId: `node-${i}`,
      sourceSocketId: `out-${i}`,
      targetNodeId: `node-${i + 1}`,
      targetSocketId: `in-${i + 1}`,
      type: 'text'
    }));

    // Add a source node
    nodes.unshift({
      id: 'source',
      type: 'source',
      label: 'Source',
      sockets: [{ id: 'out-s', type: 'text', direction: 'output' }],
      position: { x: -100, y: 0 },
      data: { script: 'return "start";', latency: 2 }
    });

    connections.unshift({
      id: 'conn-s',
      sourceNodeId: 'source',
      sourceSocketId: 'out-s',
      targetNodeId: 'node-0',
      targetSocketId: 'in-0',
      type: 'text'
    });

    return { nodes, connections } as any;
  };

  it('should handle two high-density simulations in parallel without interference', async () => {
    const archA = createComplexArch(50);
    const archB = createComplexArch(50);

    const telemetryA: string[] = [];
    const telemetryB: string[] = [];

    const engineA = new SimulationEngine(archA, runtime, {
      onTelemetry: (id) => telemetryA.push(id)
    });

    const engineB = new SimulationEngine(archB, runtime, {
      onTelemetry: (id) => telemetryB.push(id)
    });

    const startTime = Date.now();
    await Promise.all([engineA.run(), engineB.run()]);
    const duration = Date.now() - startTime;

    // Each node has 2 telemetry updates (running, success)
    // 51 nodes * 2 = 102 updates per engine
    expect(telemetryA.length).toBe(102);
    expect(telemetryB.length).toBe(102);
    
    expect(duration).toBeLessThan(600); 
  });

  it('should verify store updates for parallel simulations via runSimulation', async () => {
    const archA = createComplexArch(10);
    const archB = createComplexArch(10);

    useTabStore.setState({
        activeArchitecture: archA,
        secondaryActiveArchitecture: archB,
        isSplitView: true
    });

    await runSimulation();

    const state = useSimulationStore.getState();
    
    // Check primary
    expect(Object.keys(state.nodeTelemetry).length).toBe(11);
    
    const successCount = Object.values(state.nodeTelemetry).filter(t => t.status === 'success').length;
    if (successCount !== 11) {
        console.log('Primary Telemetry:', JSON.stringify(state.nodeTelemetry, null, 2));
    }

    expect(state.nodeTelemetry['source'].status).toBe('success');
    expect(state.aggregatedMetrics.nodeCount).toBe(11);

    // Check secondary
    expect(Object.keys(state.secondaryNodeTelemetry).length).toBe(11);
    expect(state.secondaryNodeTelemetry['source'].status).toBe('success');
    expect(state.secondaryAggregatedMetrics.nodeCount).toBe(11);

    // History should have snapshots (11 nodes * 2 updates = 22 snapshots each roughly)
    expect(state.history.length).toBeGreaterThan(10);
    expect(state.secondaryHistory.length).toBeGreaterThan(10);
  });
});
