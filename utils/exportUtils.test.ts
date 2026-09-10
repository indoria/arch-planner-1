import { exportToJson, exportToYaml } from './exportUtils';

describe('exportUtils', () => {
  let originalCreateObjectURL: any;
  let originalRevokeObjectURL: any;

  beforeEach(() => {
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = jest.fn(() => 'mock-url');
    URL.revokeObjectURL = jest.fn();
    
    // Mock document.body.appendChild/removeChild
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
    jest.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    jest.restoreAllMocks();
  });

  describe('exportToJson', () => {
    it('creates a download link and clicks it', () => {
      const mockData = { test: 'data' };
      const mockFilename = 'test.json';
      
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      } as any;
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink);

      exportToJson(mockData, mockFilename);

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(mockLink.href).toBe('mock-url');
      expect(mockLink.download).toBe(mockFilename);
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('exportToYaml', () => {
    it('creates a download link and clicks it for YAML', () => {
      const mockYaml = 'test: data';
      const mockFilename = 'test.yaml';
      
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      } as any;
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink);

      exportToYaml(mockYaml, mockFilename);

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(mockLink.href).toBe('mock-url');
      expect(mockLink.download).toBe(mockFilename);
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('exportToSvg', () => {
    it('serializes SVG element and triggers download', () => {
      const mockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      mockSvg.setAttribute('width', '100');
      mockSvg.setAttribute('height', '100');
      const mockFilename = 'architecture.svg';
      
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      } as any;
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink);

      // @ts-ignore - function not yet implemented
      const { exportToSvg } = require('./exportUtils');
      exportToSvg(mockSvg, mockFilename);

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(mockLink.href).toBe('mock-url');
      expect(mockLink.download).toBe(mockFilename);
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});
