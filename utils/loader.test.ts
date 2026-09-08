import { UnifiedLoader, LoadResult } from './loader';
import { validateSchema } from './schema';

jest.mock('./schema', () => ({
  validateSchema: jest.fn()
}));

describe('UnifiedLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadIndependent', () => {
    it('merges architecture and components into a unified state', async () => {
      const mockArch = { type: 'architecture', version: '1.0.0', nodes: [], connections: [] };
      const mockComponents = { type: 'components', version: '1.0.0', components: [{ id: 'c1', type: 'asr' }] };

      (validateSchema as jest.Mock)
        .mockReturnValueOnce({ valid: true, schemaType: 'architecture', errors: [] })
        .mockReturnValueOnce({ valid: true, schemaType: 'components', errors: [] });

      const result = await UnifiedLoader.loadIndependent(mockArch, mockComponents);
      
      expect(result.success).toBe(true);
      expect(result.architecture).toBeDefined();
      expect(result.components).toHaveLength(1);
    });

    it('returns error if architecture validation fails', async () => {
      const mockArch = { type: 'architecture' };
      (validateSchema as jest.Mock).mockReturnValue({ valid: false, errors: ['Invalid Arch'] });

      const result = await UnifiedLoader.loadIndependent(mockArch, {});
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Invalid Arch');
    });
  });

  describe('loadEmbedded', () => {
    it('extracts architecture and components from an embedded file', async () => {
      const mockEmbedded = {
        type: 'embedded',
        version: '1.0.0',
        nodes: [{ id: 'n1', type: 'asr' }],
        connections: [],
        components: [{ id: 'c1', type: 'asr' }]
      };

      (validateSchema as jest.Mock).mockReturnValue({ valid: true, schemaType: 'embedded', errors: [] });

      const result = await UnifiedLoader.loadEmbedded(mockEmbedded);
      
      expect(result.success).toBe(true);
      expect(result.architecture?.nodes).toHaveLength(1);
      expect(result.components).toHaveLength(1);
    });
  });

  describe('Unified Entry Point (load)', () => {
    it('automatically detects type and calls appropriate loader', async () => {
       const mockEmbedded = { type: 'embedded', version: '1.0.0' };
       (validateSchema as jest.Mock).mockReturnValue({ valid: true, schemaType: 'embedded', errors: [] });
       
       const spy = jest.spyOn(UnifiedLoader, 'loadEmbedded').mockResolvedValue({ success: true, components: [], diagnostics: [] });
       
       await UnifiedLoader.load(mockEmbedded);
       expect(spy).toHaveBeenCalledWith(mockEmbedded);
    });
  });
});
