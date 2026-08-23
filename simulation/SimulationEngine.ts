import { Architecture, Node } from '../store/architecture';
import { ScriptRuntime } from './ScriptRuntime';

export interface NodeTelemetry {
  status: 'idle' | 'running' | 'error' | 'success';
  latency: number;
  output?: any;
  error?: string;
}

export interface SimulationOptions {
  onTelemetry?: (nodeId: string, telemetry: NodeTelemetry) => void;
}

export class SimulationEngine {
  private results: Record<string, NodeTelemetry> = {};

  constructor(
    private architecture: Architecture,
    private runtime: ScriptRuntime,
    private options: SimulationOptions = {},
    private parentInputs: Record<string, any> = {}
  ) {}

  private updateTelemetry(nodeId: string, telemetry: NodeTelemetry) {
    this.results[nodeId] = telemetry;
    if (this.options.onTelemetry) {
      this.options.onTelemetry(nodeId, telemetry);
    }
  }

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
          this.updateTelemetry(id, { status: 'error', error: 'Deadlock or Cycle detected', latency: 0 });
        });
        break;
      }

      // Execute all ready nodes in parallel
      const promises = readyToExecute.map(async (node) => {
        pendingNodes.delete(node.id);
        executing.add(node.id);
        this.updateTelemetry(node.id, { status: 'running', latency: 0 });

        try {
          // Special handling for sub-input nodes
          if (node.type === 'sub-input') {
            const parentSocketId = node.data?.parentSocketId;
            const output = this.parentInputs[parentSocketId];
            this.updateTelemetry(node.id, { status: 'success', output, latency: 0 });
            return;
          }

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
            if (input.data === undefined) {
                input.data = sourceResult.output;
            }
          });

          let output: any;
          let nodeOwnLatency = node.data?.latency || 0;

          if (node.subArchitecture) {
            // Recursive simulation
            const subEngine = new SimulationEngine(
              node.subArchitecture,
              this.runtime,
              { onTelemetry: this.options.onTelemetry },
              input
            );
            const subResults = await subEngine.run();
            
            // Collect output from sub-output nodes
            const subOutputNodes = node.subArchitecture.nodes.filter(n => n.type === 'sub-output');
            
            // For simplicity, if there's only one output socket, we take the first sub-output node result
            // In a more complex scenario, we'd map subOutputNodes to parent sockets.
            const primaryOutputNode = subOutputNodes[0];
            if (primaryOutputNode) {
              const res = subResults[primaryOutputNode.id];
              if (res.status === 'error') throw new Error(res.error);
              output = res.output;
            }

            // Latency aggregation: max latency of any sub-output node
            let maxSubLatency = 0;
            subOutputNodes.forEach(n => {
                maxSubLatency = Math.max(maxSubLatency, subResults[n.id].latency);
            });
            nodeOwnLatency = maxSubLatency;
          } else if (node.type === 'sub-output') {
            // Just pass through the input to the output
            output = input.data;
            nodeOwnLatency = 0; // Bridges don't add latency usually
          } else {
            const script = node.data?.script || 'return input.data;';
            output = await this.runtime.execute(script, { data: input.data, ...input }, node.data);
          }
          
          const totalLatency = maxUpstreamLatency + nodeOwnLatency;
          this.updateTelemetry(node.id, { status: 'success', output, latency: totalLatency });
        } catch (error: any) {
          this.updateTelemetry(node.id, { status: 'error', error: error.message, latency: 0 });
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
