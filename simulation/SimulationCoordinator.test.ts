import { SimulationCoordinator } from './SimulationCoordinator';
import { Architecture } from '../store/architecture';
import { ScriptRuntime } from './ScriptRuntime';

describe('SimulationCoordinator', () => {
  let coordinator: SimulationCoordinator;
  let runtime: ScriptRuntime;

  const mockArch: Architecture = {
    nodes: [
      {
        id: 'node-1',
        type: 'source',
        label: 'Source',
        sockets: [{ id: 'out-1', type: 'text', direction: 'output' }],
        position: { x: 0, y: 0 },
        data: { script: 'return "hello";', latency: 10 }
      }
    ],
    connections: []
  };

  beforeEach(() => {
    runtime = new ScriptRuntime();
    coordinator = new SimulationCoordinator(mockArch, runtime);
  });

  it('should run multiple simulations in parallel', async () => {
    const numRuns = 10;
    const results = await coordinator.runParallel(numRuns);
    
    expect(results.length).toBe(numRuns);
    results.forEach(runResult => {
      expect(runResult['node-1'].status).toBe('success');
      expect(runResult['node-1'].output).toBe('hello');
    });
  });

  it('should handle high-density (100+) parallel runs efficiently', async () => {
    const numRuns = 100;
    const startTime = Date.now();
    const results = await coordinator.runParallel(numRuns);
    const duration = Date.now() - startTime;
    
    expect(results.length).toBe(numRuns);
    // Even with 100 runs, it should be relatively fast if executed in parallel
    // 100 * 10ms sequential would be 1s. Parallel should be much closer to 10ms + overhead.
    expect(duration).toBeLessThan(500); // Safe threshold for parallel execution
  });
});
