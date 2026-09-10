import { SimulationEngine } from './SimulationEngine';
import { Architecture } from '../store/architecture';
import { ScriptRuntime } from './ScriptRuntime';

describe('Multi-Socket Hierarchical Simulation', () => {
  let engine: SimulationEngine;
  let runtime: ScriptRuntime;

  const arch: Architecture = {
    nodes: [
      {
        id: 'parent-1',
        type: 'architectureNode',
        label: 'Hierarchical Node',
        position: { x: 0, y: 0 },
        sockets: [
          { id: 'in-1', type: 'text', direction: 'input', label: 'Input 1' },
          { id: 'in-2', type: 'text', direction: 'input', label: 'Input 2' },
          { id: 'out-1', type: 'text', direction: 'output', label: 'Output 1' },
          { id: 'out-2', type: 'text', direction: 'output', label: 'Output 2' }
        ],
        data: {},
        subArchitecture: {
          nodes: [
            {
              id: 'sub-in-1',
              type: 'sub-input',
              label: 'In 1 Proxy',
              position: { x: 0, y: 0 },
              sockets: [{ id: 'p-out-1', type: 'text', direction: 'output' }],
              data: { parentSocketId: 'in-1' }
            },
            {
              id: 'sub-in-2',
              type: 'sub-input',
              label: 'In 2 Proxy',
              position: { x: 0, y: 0 },
              sockets: [{ id: 'p-out-2', type: 'text', direction: 'output' }],
              data: { parentSocketId: 'in-2' }
            },
            {
              id: 'worker-1',
              type: 'architectureNode',
              label: 'Worker 1',
              position: { x: 100, y: 0 },
              sockets: [
                { id: 'w1-in', type: 'text', direction: 'input' },
                { id: 'w1-out', type: 'text', direction: 'output' }
              ],
              data: { script: "return 'W1: ' + input['w1-in'];" }
            },
            {
              id: 'worker-2',
              type: 'architectureNode',
              label: 'Worker 2',
              position: { x: 100, y: 100 },
              sockets: [
                { id: 'w2-in', type: 'text', direction: 'input' },
                { id: 'w2-out', type: 'text', direction: 'output' }
              ],
              data: { script: "return 'W2: ' + input['w2-in'];" }
            },
            {
              id: 'sub-out-1',
              type: 'sub-output',
              label: 'Out 1 Proxy',
              position: { x: 200, y: 0 },
              sockets: [{ id: 'p-in-1', type: 'text', direction: 'input' }],
              data: { parentSocketId: 'out-1' }
            },
            {
              id: 'sub-out-2',
              type: 'sub-output',
              label: 'Out 2 Proxy',
              position: { x: 200, y: 100 },
              sockets: [{ id: 'p-in-2', type: 'text', direction: 'input' }],
              data: { parentSocketId: 'out-2' }
            }
          ],
          connections: [
            { id: 'c1', sourceNodeId: 'sub-in-1', sourceSocketId: 'p-out-1', targetNodeId: 'worker-1', targetSocketId: 'w1-in' },
            { id: 'c2', sourceNodeId: 'sub-in-2', sourceSocketId: 'p-out-2', targetNodeId: 'worker-2', targetSocketId: 'w2-in' },
            { id: 'c3', sourceNodeId: 'worker-1', sourceSocketId: 'w1-out', targetNodeId: 'sub-out-1', targetSocketId: 'p-in-1' },
            { id: 'c4', sourceNodeId: 'worker-2', sourceSocketId: 'w2-out', targetNodeId: 'sub-out-2', targetSocketId: 'p-in-2' }
          ]
        }
      },
      {
        id: 'source-1',
        type: 'architectureNode',
        label: 'Source 1',
        position: { x: -100, y: 0 },
        sockets: [{ id: 's1-out', type: 'text', direction: 'output' }],
        data: { script: "return 'S1';" }
      },
      {
        id: 'source-2',
        type: 'architectureNode',
        label: 'Source 2',
        position: { x: -100, y: 100 },
        sockets: [{ id: 's2-out', type: 'text', direction: 'output' }],
        data: { script: "return 'S2';" }
      },
      {
        id: 'sink-1',
        type: 'architectureNode',
        label: 'Sink 1',
        position: { x: 300, y: 0 },
        sockets: [{ id: 'k1-in', type: 'text', direction: 'input' }],
        data: { script: "return input['k1-in'];" }
      },
      {
        id: 'sink-2',
        type: 'architectureNode',
        label: 'Sink 2',
        position: { x: 300, y: 100 },
        sockets: [{ id: 'k2-in', type: 'text', direction: 'input' }],
        data: { script: "return input['k2-in'];" }
      }
    ],
    connections: [
      { id: 'cm1', sourceNodeId: 'source-1', sourceSocketId: 's1-out', targetNodeId: 'parent-1', targetSocketId: 'in-1' },
      { id: 'cm2', sourceNodeId: 'source-2', sourceSocketId: 's2-out', targetNodeId: 'parent-1', targetSocketId: 'in-2' },
      { id: 'cm3', sourceNodeId: 'parent-1', sourceSocketId: 'out-1', targetNodeId: 'sink-1', targetSocketId: 'k1-in' },
      { id: 'cm4', sourceNodeId: 'parent-1', sourceSocketId: 'out-2', targetNodeId: 'sink-2', targetSocketId: 'k2-in' }
    ]
  };

  beforeEach(() => {
    runtime = new ScriptRuntime();
    engine = new SimulationEngine(arch, runtime);
  });

  it('should route data through multiple input and output sockets of a sub-architecture', async () => {
    const results = await engine.run();
    
    // Sink 1 should receive W1: S1
    expect(results['sink-1'].output).toBe('W1: S1');
    
    // Sink 2 should receive W2: S2
    expect(results['sink-2'].output).toBe('W2: S2');
  });
});
