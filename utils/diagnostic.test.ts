import { getDiagnostics } from './diagnostic';
import { Architecture } from '../store/architecture';
import { ComponentDef } from '../store/components';

describe('Diagnostic & Reporting Engine', () => {
  const mockComponents: ComponentDef[] = [
    {
      id: 'asr-1',
      type: 'asr',
      label: 'ASR',
      description: 'Test ASR',
      cost: '$0.01',
      numericCost: 0.01,
      latency: '100ms',
      numericLatency: 100,
      sockets: [
        { id: 'in', type: 'audio', direction: 'input' },
        { id: 'out', type: 'text', direction: 'output' }
      ]
    }
  ];

  it('reports missing behavioral models for node types', () => {
    const arch: Architecture = {
      nodes: [
        { id: 'node-1', type: 'unknown-type', label: 'Unknown', position: { x: 0, y: 0 }, sockets: [], data: {} }
      ],
      connections: []
    };
    
    const diagnostics = getDiagnostics(arch, mockComponents);
    expect(diagnostics.some(d => d.message.includes('Missing behavioral model for type "unknown-type"'))).toBe(true);
  });

  it('reports missing connectivity for isolated nodes', () => {
    const arch: Architecture = {
      nodes: [
        { id: 'node-1', type: 'asr', label: 'ASR', position: { x: 0, y: 0 }, sockets: [], data: {} }
      ],
      connections: []
    };
    
    const diagnostics = getDiagnostics(arch, mockComponents);
    expect(diagnostics.some(d => d.message.includes('Node "node-1" has no connections'))).toBe(true);
  });

  it('reports no diagnostics for a valid, fully connected architecture', () => {
    const arch: Architecture = {
      nodes: [
        { id: 'n1', type: 'asr', label: 'ASR', position: { x: 0, y: 0 }, sockets: [], data: {} },
        { id: 'n2', type: 'asr', label: 'ASR', position: { x: 100, y: 0 }, sockets: [], data: {} }
      ],
      connections: [
        { id: 'c1', sourceNodeId: 'n1', sourceSocketId: 'out', targetNodeId: 'n2', targetSocketId: 'in' }
      ]
    };
    
    const diagnostics = getDiagnostics(arch, mockComponents);
    // Should not have "missing model" for 'asr' or "no connections" for n1/n2
    expect(diagnostics.length).toBe(0);
  });
});
