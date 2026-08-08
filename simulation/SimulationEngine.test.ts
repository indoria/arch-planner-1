import { SimulationEngine } from './SimulationEngine';
import { Architecture, Node, TypedConnection } from '../store/architecture';
import { ScriptRuntime } from './ScriptRuntime';

describe('SimulationEngine', () => {
  let engine: SimulationEngine;
  let runtime: ScriptRuntime;

  const mockArch: Architecture = {
    nodes: [
      {
        id: 'node-1',
        type: 'source',
        label: 'Source',
        sockets: [{ id: 'out-1', type: 'text', direction: 'output' }],
        position: { x: 0, y: 0 },
        data: { script: 'return "hello";' }
      },
      {
        id: 'node-2',
        type: 'processor',
        label: 'Processor',
        sockets: [
          { id: 'in-1', type: 'text', direction: 'input' },
          { id: 'out-2', type: 'text', direction: 'output' }
        ],
        position: { x: 200, y: 0 },
        data: { script: 'return input.data.toUpperCase();' }
      }
    ],
    connections: [
      {
        id: 'conn-1',
        sourceNodeId: 'node-1',
        sourceSocketId: 'out-1',
        targetNodeId: 'node-2',
        targetSocketId: 'in-1'
      }
    ]
  };

  beforeEach(() => {
    runtime = new ScriptRuntime();
    engine = new SimulationEngine(mockArch, runtime);
  });

  it('should propagate data from source to downstream node', async () => {
    const results = await engine.run();
    expect(results['node-2'].output).toBe('HELLO');
  });

  it('should propagate error status to downstream nodes', async () => {
    // Modify mockArch to have an error in node-1
    const errorArch: Architecture = {
      ...mockArch,
      nodes: [
        {
          ...mockArch.nodes[0],
          data: { script: 'throw new Error("Source failed");' }
        },
        mockArch.nodes[1]
      ]
    };
    
    const errorEngine = new SimulationEngine(errorArch, runtime);
    const results = await errorEngine.run();

    expect(results['node-1'].status).toBe('error');
    expect(results['node-1'].error).toBe('Source failed');
    
    // Node-2 should also be in error state because its dependency failed
    expect(results['node-2'].status).toBe('error');
    expect(results['node-2'].error).toContain('Upstream failure');
  });

  it('should propagate latency and accumulate it downstream', async () => {
    // Add latency parameters to nodes
    const latencyArch: Architecture = {
      ...mockArch,
      nodes: [
        {
          ...mockArch.nodes[0],
          data: { script: 'return "hello";', latency: 50 }
        },
        {
          ...mockArch.nodes[1],
          data: { script: 'return input.data.toUpperCase();', latency: 30 }
        }
      ]
    };

    const latencyEngine = new SimulationEngine(latencyArch, runtime);
    const results = await latencyEngine.run();

    expect(results['node-1'].latency).toBe(50);
    // node-2 latency should be its own (30) + parent's (50) = 80
    expect(results['node-2'].latency).toBe(80);
  });
});
