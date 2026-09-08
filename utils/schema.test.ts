import { validateSchema } from './schema';

describe('Schema Validation', () => {
  describe('Architecture Definition (Standalone)', () => {
    const validArch = {
      version: '1.0.0',
      type: 'architecture',
      nodes: [
        { id: 'node-1', type: 'asr', label: 'ASR', position: { x: 0, y: 0 } }
      ],
      connections: [
        { id: 'conn-1', sourceNodeId: 'node-1', sourceSocketId: 'out', targetNodeId: 'node-2', targetSocketId: 'in' }
      ]
    };

    it('validates a correct standalone architecture', () => {
      const result = validateSchema(validArch);
      expect(result.valid).toBe(true);
      expect(result.schemaType).toBe('architecture');
    });

    it('rejects architecture with missing nodes', () => {
      const invalidArch = { ...validArch, nodes: undefined };
      const result = validateSchema(invalidArch);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing "nodes" field');
    });

    it('rejects architecture with invalid node structure', () => {
      const invalidNode = { ...validArch, nodes: [{ id: 'node-1' }] }; // Missing type, label, position
      const result = validateSchema(invalidNode);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Node "node-1" is missing required fields'))).toBe(true);
    });

    it('rejects architecture with invalid connection structure', () => {
      const invalidConn = { ...validArch, connections: [{ id: 'conn-1' }] }; // Missing IDs
      const result = validateSchema(invalidConn);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Connection "conn-1" is missing required fields'))).toBe(true);
    });
  });

  describe('Component Definition (Standalone)', () => {
    const validComponents = {
      version: '1.0.0',
      type: 'components',
      components: [
        {
          id: 'comp-1',
          type: 'asr',
          label: 'ASR',
          description: 'Test ASR',
          cost: '$0.01',
          numericCost: 0.01,
          latency: '100ms',
          numericLatency: 100,
          sockets: [{ id: 'in', type: 'audio', direction: 'input' }]
        }
      ]
    };

    it('validates a correct standalone component definition', () => {
      const result = validateSchema(validComponents);
      expect(result.valid).toBe(true);
      expect(result.schemaType).toBe('components');
    });

    it('rejects component definition with missing components array', () => {
      const invalidComponents = { ...validComponents, components: undefined };
      const result = validateSchema(invalidComponents);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing "components" field');
    });

    it('rejects component model with missing required fields', () => {
      const invalidComp = { ...validComponents, components: [{ id: 'comp-1' }] };
      const result = validateSchema(invalidComp);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Component "comp-1" is missing required fields'))).toBe(true);
    });

    it('rejects component model with invalid sockets', () => {
      const invalidSocket = {
        ...validComponents,
        components: [{
          ...validComponents.components[0],
          sockets: [{ id: 's1' }] // Missing type, direction
        }]
      };
      const result = validateSchema(invalidSocket);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Component "comp-1" has invalid socket "s1"'))).toBe(true);
    });
  });

  describe('Embedded Definition', () => {
    const validEmbedded = {
      version: '1.0.0',
      type: 'embedded',
      nodes: [],
      connections: [],
      components: []
    };

    it('validates a correct embedded definition', () => {
      const result = validateSchema(validEmbedded);
      expect(result.valid).toBe(true);
      expect(result.schemaType).toBe('embedded');
    });
  });

  describe('Version Validation', () => {
    it('rejects unsupported versions', () => {
      const invalidVersion = { version: '2.0.0', type: 'architecture', nodes: [], connections: [] };
      const result = validateSchema(invalidVersion);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unsupported schema version: 2.0.0');
    });
  });
});
