import { useSimulationStore } from './useSimulationStore';
import { useTabStore } from './useTabStore';
import { SimulationEngine } from '../simulation/SimulationEngine';
import { ScriptRuntime } from '../simulation/ScriptRuntime';
import { TranscriptMapper } from '../simulation/TranscriptMapper';
import { KPIEngine } from '../simulation/KPIEngine';

const runtime = new ScriptRuntime();
const kpiEngine = new KPIEngine();

export const runSimulation = async () => {
  const { activeArchitecture } = useTabStore.getState();
  const { addLog, setNodeTelemetry, resetTelemetry, setAggregatedMetrics, addSnapshot, clearHistory } = useSimulationStore.getState();

  if (!activeArchitecture) return;

  resetTelemetry();
  clearHistory();
  const mapper = new TranscriptMapper(addLog);

  const engine = new SimulationEngine(activeArchitecture, runtime, {
    onTelemetry: (nodeId, telemetry) => {
      setNodeTelemetry(nodeId, telemetry);
      
      const node = activeArchitecture.nodes.find(n => n.id === nodeId);
      if (node) {
        mapper.handleTelemetry(nodeId, telemetry, node.label);
      }

      // Capture a snapshot of the current global state
      const currentState = useSimulationStore.getState().nodeTelemetry;
      addSnapshot({
        timestamp: Date.now(),
        results: { ...currentState }
      });
    }
  });

  const results = await engine.run();
  
  // Calculate aggregated metrics
  const metrics = kpiEngine.calculate(activeArchitecture, results);
  setAggregatedMetrics(metrics);
};
