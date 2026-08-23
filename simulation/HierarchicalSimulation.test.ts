import { SimulationEngine } from './SimulationEngine';
import { Architecture } from '../store/architecture';
import { ScriptRuntime } from './ScriptRuntime';
import mockHierarchicalArch from '../store/mockHierarchicalArch.json';

describe('Hierarchical Simulation', () => {
  let engine: SimulationEngine;
  let runtime: ScriptRuntime;
  const arch = mockHierarchicalArch as unknown as Architecture;

  beforeEach(() => {
    runtime = new ScriptRuntime();
    engine = new SimulationEngine(arch, runtime);
  });

  it('should propagate data through sub-architectures', async () => {
    const results = await engine.run();
    
    // Gateway-1 should have run successfully
    expect(results['gateway-1'].status).toBe('success');
    
    // Gateway-1 output should be from ASR inside it
    expect(results['gateway-1'].output).toBe('Hello from ASR');
    
    // LLM-1 should have received the output from Gateway-1
    expect(results['llm-1'].output).toBe('LLM: Hello from ASR');
  });

  it('should accumulate latency from sub-architectures', async () => {
    const results = await engine.run();
    
    // Gateway latency should be VAD (10) + ASR (150) = 160
    // Note: in our mock, they are sequential.
    expect(results['gateway-1'].latency).toBe(160);
    
    // LLM latency should be Gateway (160) + LLM (500) = 660
    expect(results['llm-1'].latency).toBe(660);
  });
});
