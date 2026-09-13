import { SimulationEngine } from './SimulationEngine';
import { Architecture } from '../store/architecture';
import { ScriptRuntime } from './ScriptRuntime';

describe('Telemetry Aggregation', () => {
  let engine: SimulationEngine;
  let runtime: ScriptRuntime;

  const arch: Architecture = {
    nodes: [
      {
        id: 'hierarchical-1',
        type: 'architectureNode',
        label: 'Sub-System',
        position: { x: 0, y: 0 },
        sockets: [{ id: 'out', type: 'text', direction: 'output' }],
        data: { cost: 0.1 }, // Parent node might have its own overhead cost
        subArchitecture: {
          nodes: [
            {
              id: 'n1',
              type: 'architectureNode',
              label: 'Node 1',
              position: { x: 0, y: 0 },
              sockets: [{ id: 'o1', type: 'text', direction: 'output' }],
              data: { latency: 100, cost: 0.5, script: "return 'N1';" }
            },
            {
              id: 'n2',
              type: 'architectureNode',
              label: 'Node 2',
              position: { x: 200, y: 0 },
              sockets: [
                { id: 'i2', type: 'text', direction: 'input' },
                { id: 'o2', type: 'text', direction: 'output' }
              ],
              data: { latency: 200, cost: 0.3, script: "return input['i2'] + ' N2';" }
            },
            {
              id: 'sub-out-1',
              type: 'sub-output',
              label: 'Out Proxy',
              position: { x: 400, y: 0 },
              sockets: [{ id: 'p-in', type: 'text', direction: 'input' }],
              data: { parentSocketId: 'out' }
            }
          ],
          connections: [
            { id: 'c1', sourceNodeId: 'n1', sourceSocketId: 'o1', targetNodeId: 'n2', targetSocketId: 'i2' },
            { id: 'c2', sourceNodeId: 'n2', sourceSocketId: 'o2', targetNodeId: 'sub-out-1', targetSocketId: 'p-in' }
          ]
        }
      }
    ],
    connections: []
  };

  beforeEach(() => {
    runtime = new ScriptRuntime();
    engine = new SimulationEngine(arch, runtime);
  });

  it('should aggregate latency from the longest path in sub-architecture', async () => {
    const results = await engine.run();
    
    // Latency = N1(100) + N2(200) = 300
    expect(results['hierarchical-1'].latency).toBe(300);
  });

  it('should aggregate cost from all nodes in sub-architecture', async () => {
    const results = await engine.run();
    
    // Total Cost = ParentOverhead(0.1) + N1(0.5) + N2(0.3) = 0.9
    expect(results['hierarchical-1'].cost).toBeCloseTo(0.9);
  });

  it('should aggregate latency as the critical path (max) for parallel nodes', async () => {
    const parallelArch: Architecture = {
      nodes: [
        {
          id: 'parent',
          type: 'architectureNode',
          label: 'Parent',
          position: { x: 0, y: 0 },
          sockets: [{ id: 'out', type: 'text', direction: 'output' }],
          subArchitecture: {
            nodes: [
              {
                id: 'in',
                type: 'sub-input',
                label: 'In',
                position: { x: 0, y: 0 },
                sockets: [{ id: 'p-out', type: 'text', direction: 'output' }],
                data: { parentSocketId: 'in' }
              },
              {
                id: 'p1',
                type: 'architectureNode',
                label: 'P1',
                position: { x: 100, y: -50 },
                sockets: [
                  { id: 'i', type: 'text', direction: 'input' },
                  { id: 'o', type: 'text', direction: 'output' }
                ],
                data: { latency: 100 }
              },
              {
                id: 'p2',
                type: 'architectureNode',
                label: 'P2',
                position: { x: 100, y: 50 },
                sockets: [
                  { id: 'i', type: 'text', direction: 'input' },
                  { id: 'o', type: 'text', direction: 'output' }
                ],
                data: { latency: 250 }
              },
              {
                id: 'out-proxy',
                type: 'sub-output',
                label: 'Out',
                position: { x: 300, y: 0 },
                sockets: [
                  { id: 'i1', type: 'text', direction: 'input' },
                  { id: 'i2', type: 'text', direction: 'input' }
                ],
                data: { parentSocketId: 'out' }
              }
            ],
            connections: [
              { id: 'c1', sourceNodeId: 'in', sourceSocketId: 'p-out', targetNodeId: 'p1', targetSocketId: 'i' },
              { id: 'c2', sourceNodeId: 'in', sourceSocketId: 'p-out', targetNodeId: 'p2', targetSocketId: 'i' },
              { id: 'c3', sourceNodeId: 'p1', sourceSocketId: 'o', targetNodeId: 'out-proxy', targetSocketId: 'i1' },
              { id: 'c4', sourceNodeId: 'p2', sourceSocketId: 'o', targetNodeId: 'out-proxy', targetSocketId: 'i2' }
            ]
          }
        }
      ],
      connections: []
    };

    const parallelEngine = new SimulationEngine(parallelArch, runtime);
    const results = await parallelEngine.run();

    // Critical path is p2 (250ms). p1 (100ms) finishes earlier.
    // The aggregate latency of 'parent' should be 250.
    expect(results['parent'].latency).toBe(250);
  });

  it('should report error if any internal node in sub-architecture fails', async () => {
    const errorArch: Architecture = {
      nodes: [
        {
          id: 'parent',
          type: 'architectureNode',
          label: 'Parent',
          position: { x: 0, y: 0 },
          sockets: [{ id: 'out', type: 'text', direction: 'output' }],
          subArchitecture: {
            nodes: [
              {
                id: 'n1',
                type: 'architectureNode',
                label: 'Success Node',
                position: { x: 100, y: 0 },
                sockets: [{ id: 'o', type: 'text', direction: 'output' }],
                data: { script: "return 'OK';" }
              },
              {
                id: 'n2',
                type: 'architectureNode',
                label: 'Failure Node',
                position: { x: 100, y: 100 },
                sockets: [],
                data: { script: "throw new Error('Internal Boom');" }
              },
              {
                id: 'out-proxy',
                type: 'sub-output',
                label: 'Out',
                position: { x: 300, y: 0 },
                sockets: [{ id: 'i', type: 'text', direction: 'input' }],
                data: { parentSocketId: 'out' }
              }
            ],
            connections: [
              { id: 'c1', sourceNodeId: 'n1', sourceSocketId: 'o', targetNodeId: 'out-proxy', targetSocketId: 'i' }
            ]
          }
        }
      ],
      connections: []
    };

    const errorEngine = new SimulationEngine(errorArch, runtime);
    const results = await errorEngine.run();

    expect(results['parent'].status).toBe('error');
    expect(results['parent'].error).toContain('Internal Boom');
  });
});
