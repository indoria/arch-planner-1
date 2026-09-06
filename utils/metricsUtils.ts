import { AggregatedMetrics } from '../store/useSimulationStore';

export interface MetricsComparison {
  latencyDelta: number;
  costDelta: number;
  nodeCountDelta: number;
  betterLatency: 'primary' | 'secondary' | 'equal';
  betterCost: 'primary' | 'secondary' | 'equal';
}

/**
 * Utility to compare two sets of simulation metrics.
 * Note: For latency and cost, lower is generally better.
 */
export function compareMetrics(primary: AggregatedMetrics, secondary: AggregatedMetrics): MetricsComparison {
  const latencyDelta = secondary.totalLatency - primary.totalLatency;
  const costDelta = secondary.totalCost - primary.totalCost;
  const nodeCountDelta = secondary.nodeCount - primary.nodeCount;

  const betterLatency = latencyDelta < 0 ? 'secondary' : (latencyDelta > 0 ? 'primary' : 'equal');
  const betterCost = costDelta < 0 ? 'secondary' : (costDelta > 0 ? 'primary' : 'equal');

  return {
    latencyDelta,
    costDelta,
    nodeCountDelta,
    betterLatency,
    betterCost
  };
}
