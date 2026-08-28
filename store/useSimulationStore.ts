import { create } from 'zustand'

export interface LogEntry {
  id: string
  timestamp: number
  nodeId: string
  nodeLabel: string
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
  data?: any
}

export interface NodeTelemetry {
  status: 'idle' | 'running' | 'error' | 'success';
  latency: number;
  output?: any;
  error?: string;
}

export interface SimulationSnapshot {
  timestamp: number;
  results: Record<string, NodeTelemetry>;
}

export interface AggregatedMetrics {
  totalLatency: number
  totalCost: number
  nodeCount: number
}

interface SimulationStore {
  logs: LogEntry[]
  nodeTelemetry: Record<string, NodeTelemetry>
  secondaryNodeTelemetry: Record<string, NodeTelemetry>
  aggregatedMetrics: AggregatedMetrics
  secondaryAggregatedMetrics: AggregatedMetrics
  history: SimulationSnapshot[]
  secondaryHistory: SimulationSnapshot[]
  currentSnapshotIndex: number
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void
  setNodeTelemetry: (nodeId: string, telemetry: NodeTelemetry, isSecondary?: boolean) => void
  setAggregatedMetrics: (metrics: AggregatedMetrics, isSecondary?: boolean) => void
  addSnapshot: (snapshot: SimulationSnapshot, isSecondary?: boolean) => void
  jumpToSnapshot: (index: number) => void
  clearLogs: () => void
  resetTelemetry: () => void
  clearHistory: () => void
}

export const useSimulationStore = create<SimulationStore>((set) => ({
  logs: [],
  nodeTelemetry: {},
  secondaryNodeTelemetry: {},
  aggregatedMetrics: { totalLatency: 0, totalCost: 0, nodeCount: 0 },
  secondaryAggregatedMetrics: { totalLatency: 0, totalCost: 0, nodeCount: 0 },
  history: [],
  secondaryHistory: [],
  currentSnapshotIndex: -1,
  addLog: (log) => set((state) => ({
    logs: [{ ...log, id: `log-${Date.now()}-${Math.random()}`, timestamp: Date.now() }, ...state.logs]
  })),
  setNodeTelemetry: (nodeId, telemetry, isSecondary) => set((state) => ({
    nodeTelemetry: isSecondary ? state.nodeTelemetry : { ...state.nodeTelemetry, [nodeId]: telemetry },
    secondaryNodeTelemetry: isSecondary ? { ...state.secondaryNodeTelemetry, [nodeId]: telemetry } : state.secondaryNodeTelemetry
  })),
  setAggregatedMetrics: (metrics, isSecondary) => set((state) => ({
    aggregatedMetrics: isSecondary ? state.aggregatedMetrics : metrics,
    secondaryAggregatedMetrics: isSecondary ? metrics : state.secondaryAggregatedMetrics
  })),
  addSnapshot: (snapshot, isSecondary) => set((state) => {
    if (isSecondary) {
      return {
        secondaryHistory: [...state.secondaryHistory, snapshot],
        secondaryNodeTelemetry: snapshot.results
      }
    }
    return {
      history: [...state.history, snapshot],
      currentSnapshotIndex: state.history.length,
      nodeTelemetry: snapshot.results
    }
  }),
  jumpToSnapshot: (index) => set((state) => ({
    currentSnapshotIndex: index,
    nodeTelemetry: state.history[index]?.results || state.nodeTelemetry,
    secondaryNodeTelemetry: state.secondaryHistory[index]?.results || state.secondaryNodeTelemetry
  })),
  clearLogs: () => set({ logs: [] }),
  resetTelemetry: () => set({ 
    nodeTelemetry: {}, 
    secondaryNodeTelemetry: {},
    aggregatedMetrics: { totalLatency: 0, totalCost: 0, nodeCount: 0 },
    secondaryAggregatedMetrics: { totalLatency: 0, totalCost: 0, nodeCount: 0 }
  }),
  clearHistory: () => set({ 
    history: [], 
    secondaryHistory: [],
    currentSnapshotIndex: -1 
  })
}))
