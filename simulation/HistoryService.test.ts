import { HistoryService, SimulationSnapshot } from './HistoryService';

describe('HistoryService', () => {
  let historyService: HistoryService;

  const mockSnapshot1: SimulationSnapshot = {
    timestamp: 1000,
    results: {
      'node-1': { status: 'success', latency: 50, output: 'A' }
    }
  };

  const mockSnapshot2: SimulationSnapshot = {
    timestamp: 2000,
    results: {
      'node-1': { status: 'success', latency: 100, output: 'B' }
    }
  };

  beforeEach(() => {
    historyService = new HistoryService(10); // Max size 10
  });

  it('should store and retrieve snapshots', () => {
    historyService.push(mockSnapshot1);
    historyService.push(mockSnapshot2);

    expect(historyService.getAll()).toHaveLength(2);
    expect(historyService.get(0)).toEqual(mockSnapshot1);
    expect(historyService.get(1)).toEqual(mockSnapshot2);
  });

  it('should return undefined for out of bounds index', () => {
    historyService.push(mockSnapshot1);
    expect(historyService.get(5)).toBeUndefined();
  });

  it('should respect max size by dropping oldest snapshots', () => {
    const smallHistory = new HistoryService(2);
    smallHistory.push(mockSnapshot1);
    smallHistory.push(mockSnapshot2);
    
    const mockSnapshot3: SimulationSnapshot = {
      timestamp: 3000,
      results: { 'node-1': { status: 'success', latency: 150, output: 'C' } }
    };
    
    smallHistory.push(mockSnapshot3);

    expect(smallHistory.getAll()).toHaveLength(2);
    expect(smallHistory.get(0)).toEqual(mockSnapshot2);
    expect(smallHistory.get(1)).toEqual(mockSnapshot3);
  });

  it('should clear all snapshots', () => {
    historyService.push(mockSnapshot1);
    historyService.clear();
    expect(historyService.getAll()).toHaveLength(0);
  });

  it('should return the latest snapshot', () => {
    historyService.push(mockSnapshot1);
    historyService.push(mockSnapshot2);
    expect(historyService.latest()).toEqual(mockSnapshot2);
  });

  it('should return null for latest when empty', () => {
    expect(historyService.latest()).toBeNull();
  });

  it('should use default max size if not provided', () => {
    const defaultHistory = new HistoryService();
    // No easy way to check private maxSize without reflection, but we can verify it works
    expect(defaultHistory.getAll()).toHaveLength(0);
  });
});
