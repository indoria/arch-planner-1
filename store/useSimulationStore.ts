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

export interface AggregatedMetrics {
  totalLatency: number
  totalCost: number
  nodeCount: number
}

interface SimulationStore {
  logs: LogEntry[]
  nodeTelemetry: Record<string, NodeTelemetry>
  aggregatedMetrics: AggregatedMetrics
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void
  setNodeTelemetry: (nodeId: string, telemetry: NodeTelemetry) => void
  setAggregatedMetrics: (metrics: AggregatedMetrics) => void
  clearLogs: () => void
  resetTelemetry: () => void
}

export const useSimulationStore = create<SimulationStore>((set) => ({
  logs: [],
  nodeTelemetry: {},
  aggregatedMetrics: { totalLatency: 0, totalCost: 0, nodeCount: 0 },
  addLog: (log) => set((state) => ({
    logs: [{ ...log, id: `log-${Date.now()}-${Math.random()}`, timestamp: Date.now() }, ...state.logs]
  })),
  setNodeTelemetry: (nodeId, telemetry) => set((state) => ({
    nodeTelemetry: {
      ...state.nodeTelemetry,
      [nodeId]: telemetry
    }
  })),
  setAggregatedMetrics: (metrics) => set({ aggregatedMetrics: metrics }),
  clearLogs: () => set({ logs: [] }),
  resetTelemetry: () => set({ 
    nodeTelemetry: {}, 
    aggregatedMetrics: { totalLatency: 0, totalCost: 0, nodeCount: 0 } 
  })
}))
