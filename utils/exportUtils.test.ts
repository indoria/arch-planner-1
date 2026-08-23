import { exportToJson } from './exportUtils';

describe('exportToJson', () => {
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

  it('creates a download link and clicks it', () => {
    const mockData = { test: 'data' };
    const mockFilename = 'test.json';
    
    // Mock createElement for <a> tag
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
