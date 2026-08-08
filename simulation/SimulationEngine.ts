import { Architecture, Node } from '../store/architecture';
import { ScriptRuntime } from './ScriptRuntime';

export interface NodeTelemetry {
  status: 'idle' | 'running' | 'error' | 'success';
  latency: number;
  output?: any;
  error?: string;
}

export class SimulationEngine {
  private results: Record<string, NodeTelemetry> = {};

  constructor(
    private architecture: Architecture,
    private runtime: ScriptRuntime
  ) {}

  async run(): Promise<Record<string, NodeTelemetry>> {
    this.results = {};
    const pendingNodes = new Set(this.architecture.nodes.map(n => n.id));
    const executing = new Set<string>();

    while (pendingNodes.size > 0 || executing.size > 0) {
      const readyToExecute = this.architecture.nodes.filter(node => {
        if (!pendingNodes.has(node.id)) return false;
        
        // Check if all upstream nodes are finished
        const upstreamConnections = this.architecture.connections.filter(c => c.targetNodeId === node.id);
        return upstreamConnections.every(c => {
          const sourceResult = this.results[c.sourceNodeId];
          return sourceResult && (sourceResult.status === 'success' || sourceResult.status === 'error');
        });
      });

      if (readyToExecute.length === 0 && executing.size === 0 && pendingNodes.size > 0) {
        // We have a deadlock or cycle
        pendingNodes.forEach(id => {
          this.results[id] = { status: 'error', error: 'Deadlock or Cycle detected', latency: 0 };
        });
        break;
      }

      // Execute all ready nodes in parallel
      const promises = readyToExecute.map(async (node) => {
        pendingNodes.delete(node.id);
        executing.add(node.id);
        this.results[node.id] = { status: 'running', latency: 0 };

        try {
          // Check for upstream failures and calculate max upstream latency
          const upstreamConnections = this.architecture.connections.filter(c => c.targetNodeId === node.id);
          let maxUpstreamLatency = 0;
          const upstreamErrors = [];

          for (const c of upstreamConnections) {
            const res = this.results[c.sourceNodeId];
            if (res.status === 'error') {
              upstreamErrors.push(res);
            }
            maxUpstreamLatency = Math.max(maxUpstreamLatency, res.latency);
          }

          if (upstreamErrors.length > 0) {
            throw new Error(`Upstream failure: ${upstreamErrors[0].error}`);
          }

          // Prepare input from upstream connections
          const input: Record<string, any> = {};
          upstreamConnections.forEach(c => {
            const sourceResult = this.results[c.sourceNodeId];
            input[c.targetSocketId] = sourceResult.output;
            // Also provide a flat 'data' for simple scripts
            if (input.data === undefined) {
                input.data = sourceResult.output;
            }
          });

          const nodeOwnLatency = node.data?.latency || 0;
          const totalLatency = maxUpstreamLatency + nodeOwnLatency;

          const script = node.data?.script || 'return input.data;';
          const output = await this.runtime.execute(script, { data: input.data, ...input }, node.data);
          
          this.results[node.id] = { status: 'success', output, latency: totalLatency };
        } catch (error: any) {
          this.results[node.id] = { status: 'error', error: error.message, latency: 0 };
        } finally {
          executing.delete(node.id);
        }
      });

      // Wait for the current batch of ready nodes to finish
      await Promise.all(promises);
    }

    return this.results;
  }
}
