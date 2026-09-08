import { ExportService } from './exportService';
import { Architecture } from '../store/architecture';
import { ComponentDef } from '../store/components';

describe('ExportService', () => {
  const mockArch: Architecture = {
    nodes: [{ id: 'n1', type: 'asr', label: 'ASR', position: { x: 0, y: 0 }, sockets: [], data: {} }],
    connections: []
  };

  const mockComponents: ComponentDef[] = [
    {
      id: 'asr-1',
      type: 'asr',
      label: 'ASR',
      description: 'Test',
      cost: '$0',
      numericCost: 0,
      latency: '0ms',
      numericLatency: 0,
      sockets: []
    }
  ];

  it('generates a valid standalone architecture definition', () => {
    const exported = ExportService.prepareStandalone(mockArch);
    expect(exported.type).toBe('architecture');
    expect(exported.nodes).toHaveLength(1);
    expect(exported.components).toBeUndefined();
  });

  it('generates a valid embedded definition', () => {
    const exported = ExportService.prepareEmbedded(mockArch, mockComponents);
    expect(exported.type).toBe('embedded');
    expect(exported.nodes).toHaveLength(1);
    expect(exported.components).toHaveLength(1);
  });

  it('versions the exported data', () => {
    const exported = ExportService.prepareStandalone(mockArch);
    expect(exported.version).toBe('1.0.0');
  });

  it('exports to YAML string', () => {
    const yaml = ExportService.toYaml(mockArch);
    expect(typeof yaml).toBe('string');
    expect(yaml).toContain('type: architecture');
    expect(yaml).toContain('version: 1.0.0');
  });

  it('exports embedded to YAML string', () => {
    const yaml = ExportService.toYaml(mockArch, mockComponents);
    expect(typeof yaml).toBe('string');
    expect(yaml).toContain('type: embedded');
    expect(yaml).toContain('components:');
  });
});
