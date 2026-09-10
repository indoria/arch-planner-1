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

  it('exports to JSON string', () => {
    const json = ExportService.toJson(mockArch);
    expect(typeof json).toBe('string');
    const parsed = JSON.parse(json);
    expect(parsed.type).toBe('architecture');
  });

  it('exports embedded to JSON string', () => {
    const json = ExportService.toJson(mockArch, mockComponents);
    expect(typeof json).toBe('string');
    const parsed = JSON.parse(json);
    expect(parsed.type).toBe('embedded');
    expect(parsed.components).toHaveLength(1);
  });

  describe('Git-friendly formatting', () => {
    it('sorts nodes by ID for deterministic output', () => {
      const arch: Architecture = {
        nodes: [
          { id: 'z1', type: 'asr', label: 'Z', position: { x: 0, y: 0 }, sockets: [], data: {} },
          { id: 'a1', type: 'asr', label: 'A', position: { x: 0, y: 0 }, sockets: [], data: {} }
        ],
        connections: []
      };
      const exported = ExportService.prepareStandalone(arch);
      expect(exported.nodes[0].id).toBe('a1');
      expect(exported.nodes[1].id).toBe('z1');
    });

    it('sorts connections by source-target for deterministic output', () => {
      const arch: Architecture = {
        nodes: [],
        connections: [
          { source: 'b', target: 'c' },
          { source: 'a', target: 'b' }
        ] as any
      };
      const exported = ExportService.prepareStandalone(arch);
      expect(exported.connections[0].source).toBe('a');
      expect(exported.connections[1].source).toBe('b');
    });

    it('adds a trailing newline to JSON exports', () => {
      const json = ExportService.toJson(mockArch);
      expect(json.endsWith('\n')).toBe(true);
    });

    it('adds a trailing newline to YAML exports', () => {
      const yaml = ExportService.toYaml(mockArch);
      expect(yaml.endsWith('\n')).toBe(true);
    });
  });

  describe('Unified generation', () => {
    it('generates JSON standalone by default', () => {
      const output = ExportService.export(mockArch);
      expect(output.format).toBe('json');
      expect(output.data).toContain('"type": "architecture"');
    });

    it('generates YAML embedded when requested', () => {
      const output = ExportService.export(mockArch, { 
        components: mockComponents, 
        format: 'yaml' 
      });
      expect(output.format).toBe('yaml');
      expect(output.data).toContain('type: embedded');
    });

    it('suggests a valid filename', () => {
      const output = ExportService.export(mockArch, { filename: 'my-bot' });
      expect(output.filename).toBe('my-bot.json');
      
      const outputYaml = ExportService.export(mockArch, { filename: 'my-bot', format: 'yaml' });
      expect(outputYaml.filename).toBe('my-bot.yaml');
    });
  });
});
