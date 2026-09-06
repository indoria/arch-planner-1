import { AggregatedMetrics } from './useSimulationStore';
import { compareMetrics } from '../utils/metricsUtils';

describe('Metrics Comparison Utility', () => {
  const primary: AggregatedMetrics = {
    totalLatency: 150,
    totalCost: 0.05,
    nodeCount: 5
  };

  const secondary: AggregatedMetrics = {
    totalLatency: 120,
    totalCost: 0.07,
    nodeCount: 5
  };

  it('calculates deltas correctly', () => {
    const comparison = compareMetrics(primary, secondary);
    expect(comparison.latencyDelta).toBe(-30);
    expect(comparison.costDelta).toBe(0.02);
    expect(comparison.nodeCountDelta).toBe(0);
  });

  it('identifies better metrics (lower is better for latency/cost)', () => {
    const comparison = compareMetrics(primary, secondary);
    expect(comparison.betterLatency).toBe('secondary'); // 120 < 150
    expect(comparison.betterCost).toBe('primary');     // 0.05 < 0.07
  });

  it('handles equal values', () => {
    const comparison = compareMetrics(primary, primary);
    expect(comparison.betterLatency).toBe('equal');
    expect(comparison.betterCost).toBe('equal');
  });
});
