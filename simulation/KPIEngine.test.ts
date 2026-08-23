import { KPIEngine } from './KPIEngine';
import { Architecture } from '../store/architecture';

describe('KPIEngine', () => {
  const engine = new KPIEngine();

  const mockArch: Architecture = {
    nodes: [
      { id: 'n1', type: 'asr', label: 'ASR', position: { x: 0, y: 0 }, sockets: [] },
      { id: 'n2', type: 'llm', label: 'LLM', position: { x: 0, y: 0 }, sockets: [] },
    ],
    connections: []
  };

  it('calculates total cost correctly', () => {
    const results = {
      'n1': { status: 'success', latency: 100 } as any,
      'n2': { status: 'success', latency: 500 } as any,
    };

    const metrics = engine.calculate(mockArch, results);
    
    // ASR cost: 0.01, LLM cost: 0.02 -> 0.03
    expect(metrics.totalCost).toBeCloseTo(0.03);
    expect(metrics.nodeCount).toBe(2);
  });

  it('calculates max latency (E2E) correctly', () => {
    const results = {
      'n1': { status: 'success', latency: 100 } as any,
      'n2': { status: 'success', latency: 600 } as any,
    };

    const metrics = engine.calculate(mockArch, results);
    expect(metrics.totalLatency).toBe(600);
  });

  it('ignores failed nodes for cost', () => {
    const results = {
      'n1': { status: 'success', latency: 100 } as any,
      'n2': { status: 'error', latency: 0 } as any,
    };

    const metrics = engine.calculate(mockArch, results);
    expect(metrics.totalCost).toBeCloseTo(0.01);
    expect(metrics.nodeCount).toBe(1);
  });
});
