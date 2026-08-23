import { useSimulationStore } from './useSimulationStore';
import { useTabStore } from './useTabStore';
import { SimulationEngine } from '../simulation/SimulationEngine';
import { ScriptRuntime } from '../simulation/ScriptRuntime';
import { TranscriptMapper } from '../simulation/TranscriptMapper';

const runtime = new ScriptRuntime();

export const runSimulation = async () => {
  const { activeArchitecture } = useTabStore.getState();
  const { addLog, setNodeTelemetry, resetTelemetry } = useSimulationStore.getState();

  if (!activeArchitecture) return;

  resetTelemetry();
  const mapper = new TranscriptMapper(addLog);

  const engine = new SimulationEngine(activeArchitecture, runtime, {
    onTelemetry: (nodeId, telemetry) => {
      setNodeTelemetry(nodeId, telemetry);
      
      const node = activeArchitecture.nodes.find(n => n.id === nodeId);
      if (node) {
        mapper.handleTelemetry(nodeId, telemetry, node.label);
      }
    }
  });

  await engine.run();
};
