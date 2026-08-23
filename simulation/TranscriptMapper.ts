import { NodeTelemetry } from './SimulationEngine';
import { LogEntry } from '../store/useSimulationStore';

type AddLogFn = (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;

export class TranscriptMapper {
  constructor(private addLog: AddLogFn) {}

  handleTelemetry(nodeId: string, telemetry: NodeTelemetry, nodeLabel: string) {
    let message = '';
    let type: LogEntry['type'] = 'info';

    switch (telemetry.status) {
      case 'running':
        message = `Started processing...`;
        type = 'info';
        break;
      case 'success':
        message = `Completed in ${telemetry.latency}ms.`;
        if (telemetry.output !== undefined) {
          let outputStr = '';
          if (typeof telemetry.output === 'object' && telemetry.output !== null) {
            // Specialized extraction for common voicebot data fields
            const data = telemetry.output;
            const transcript = data.text || data.transcript || data.response;
            
            if (transcript && typeof transcript === 'string') {
              outputStr = ` "${transcript}"`;
            } else {
              outputStr = ` Output: ${JSON.stringify(data)}`;
            }
          } else {
            outputStr = ` Output: ${String(telemetry.output)}`;
          }
          message += outputStr;
        }
        type = 'success';
        break;
      case 'error':
        message = `Error: ${telemetry.error || 'Unknown error'}`;
        type = 'error';
        break;
      case 'idle':
        // We don't usually log idle status changes
        return;
    }

    this.addLog({
      nodeId,
      nodeLabel,
      type,
      message,
      data: telemetry.output || telemetry.error
    });
  }
}
