import { AggregatedMetrics } from '../store/useSimulationStore';
import { NodeTelemetry } from './SimulationEngine';
import { Architecture } from '../store/architecture';
import { AVAILABLE_COMPONENTS } from '../store/components';

export class KPIEngine {
  calculate(architecture: Architecture, results: Record<string, NodeTelemetry>): AggregatedMetrics {
    let totalLatency = 0;
    let totalCost = 0;
    let nodeCount = 0;

    Object.entries(results).forEach(([nodeId, telemetry]) => {
      if (telemetry.status === 'success') {
        const node = architecture.nodes.find(n => n.id === nodeId);
        if (!node) return;

        const componentDef = AVAILABLE_COMPONENTS.find(c => c.type === node.type);
        
        // Use total latency from the node result (which includes upstream)
        // But for "aggregation" in a dashboard, we might want max latency of the end nodes
        // Or just the sum of own latencies.
        // Usually, E2E latency is the max latency of any 'sink' node.
        
        if (componentDef) {
          totalCost += componentDef.numericCost;
        }
        
        nodeCount++;
      }
    });

    // Simple E2E latency: max latency reported by any node
    totalLatency = Math.max(0, ...Object.values(results).map(r => r.latency));

    return {
      totalLatency,
      totalCost,
      nodeCount
    };
  }
}
