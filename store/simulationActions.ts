import { useSimulationStore } from './useSimulationStore';
import { useTabStore } from './useTabStore';
import { SimulationEngine } from '../simulation/SimulationEngine';
import { ScriptRuntime } from '../simulation/ScriptRuntime';
import { TranscriptMapper } from '../simulation/TranscriptMapper';
import { KPIEngine } from '../simulation/KPIEngine';

const runtime = new ScriptRuntime();
const kpiEngine = new KPIEngine();

export const runSimulation = async () => {
  const { activeArchitecture, isSplitView, secondaryActiveArchitecture } = useTabStore.getState();
  const { addLog, setNodeTelemetry, resetTelemetry, setAggregatedMetrics, addSnapshot, clearHistory } = useSimulationStore.getState();

  if (!activeArchitecture) return;

  resetTelemetry();
  clearHistory();
  const mapper = new TranscriptMapper(addLog);

  // Helper to create an engine and run it
  const createEngine = (arch: Architecture, isSecondary: boolean) => {
    return new SimulationEngine(arch, runtime, {
      onTelemetry: (nodeId, telemetry) => {
        setNodeTelemetry(nodeId, telemetry, isSecondary);
        
        const node = arch.nodes.find(n => n.id === nodeId);
        if (node) {
          mapper.handleTelemetry(nodeId, telemetry, node.label);
        }

        // Capture a snapshot for this specific instance
        const currentTelemetry = isSecondary 
          ? useSimulationStore.getState().secondaryNodeTelemetry 
          : useSimulationStore.getState().nodeTelemetry;
          
        addSnapshot({
          timestamp: Date.now(),
          results: { ...currentTelemetry }
        }, isSecondary);
      }
    });
  };

  const primaryEngine = createEngine(activeArchitecture, false);
  const promises: Promise<any>[] = [primaryEngine.run()];

  if (isSplitView && secondaryActiveArchitecture) {
    const secondaryEngine = createEngine(secondaryActiveArchitecture, true);
    promises.push(secondaryEngine.run());
  }

  const [primaryResults, secondaryResults] = await Promise.all(promises);
  
  // Calculate aggregated metrics
  const primaryMetrics = kpiEngine.calculate(activeArchitecture, primaryResults);
  setAggregatedMetrics(primaryMetrics, false);

  if (secondaryResults) {
    const secondaryMetrics = kpiEngine.calculate(secondaryActiveArchitecture!, secondaryResults);
    setAggregatedMetrics(secondaryMetrics, true);
  }
};
