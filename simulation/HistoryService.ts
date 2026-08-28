import { NodeTelemetry } from './SimulationEngine';

export interface SimulationSnapshot {
  timestamp: number;
  results: Record<string, NodeTelemetry>;
}

export class HistoryService {
  private snapshots: SimulationSnapshot[] = [];

  constructor(private maxSize: number = 100) {}

  push(snapshot: SimulationSnapshot): void {
    this.snapshots.push(snapshot);
    if (this.snapshots.length > this.maxSize) {
      this.snapshots.shift();
    }
  }

  get(index: number): SimulationSnapshot | undefined {
    return this.snapshots[index];
  }

  getAll(): SimulationSnapshot[] {
    return [...this.snapshots];
  }

  latest(): SimulationSnapshot | null {
    if (this.snapshots.length === 0) return null;
    return this.snapshots[this.snapshots.length - 1];
  }

  clear(): void {
    this.snapshots = [];
  }
}
