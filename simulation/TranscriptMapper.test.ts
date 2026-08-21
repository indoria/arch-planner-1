import { TranscriptMapper } from './TranscriptMapper';
import { useSimulationStore } from '../store/useSimulationStore';

// Mock node labels for testing
const mockNodeLabels: Record<string, string> = {
  'node-1': 'ASR',
  'node-2': 'LLM',
  'node-3': 'TTS'
};

describe('TranscriptMapper', () => {
  beforeEach(() => {
    useSimulationStore.getState().clearLogs();
  });

  it('maps "running" status to an info log entry', () => {
    const mapper = new TranscriptMapper(useSimulationStore.getState().addLog);
    
    mapper.handleTelemetry('node-1', { 
      status: 'running', 
      latency: 0 
    }, mockNodeLabels['node-1']);
    
    const logs = useSimulationStore.getState().logs;
    expect(logs.length).toBe(1);
    expect(logs[0].message).toContain('Started processing');
    expect(logs[0].type).toBe('info');
    expect(logs[0].nodeLabel).toBe('ASR');
  });

  it('maps "success" status to a success log entry with output', () => {
    const mapper = new TranscriptMapper(useSimulationStore.getState().addLog);
    
    mapper.handleTelemetry('node-2', { 
      status: 'success', 
      latency: 150,
      output: 'Recognized: hello'
    }, mockNodeLabels['node-2']);
    
    const logs = useSimulationStore.getState().logs;
    expect(logs.length).toBe(1);
    expect(logs[0].message).toContain('Completed');
    expect(logs[0].message).toContain('Recognized: hello');
    expect(logs[0].type).toBe('success');
    expect(logs[0].nodeLabel).toBe('LLM');
  });

  it('maps "error" status to an error log entry', () => {
    const mapper = new TranscriptMapper(useSimulationStore.getState().addLog);
    
    mapper.handleTelemetry('node-3', { 
      status: 'error', 
      latency: 0,
      error: 'Timeout'
    }, mockNodeLabels['node-3']);
    
    const logs = useSimulationStore.getState().logs;
    expect(logs.length).toBe(1);
    expect(logs[0].message).toContain('Error: Timeout');
    expect(logs[0].type).toBe('error');
    expect(logs[0].nodeLabel).toBe('TTS');
  });

  it('handles complex data objects in output', () => {
    const mapper = new TranscriptMapper(useSimulationStore.getState().addLog);
    
    mapper.handleTelemetry('node-1', { 
      status: 'success', 
      latency: 50,
      output: { confidence: 0.95, text: 'hi' }
    }, mockNodeLabels['node-1']);
    
    const logs = useSimulationStore.getState().logs;
    expect(logs[0].message).toContain('{"confidence":0.95,"text":"hi"}');
  });
});
