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

interface SimulationStore {
  logs: LogEntry[]
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void
  clearLogs: () => void
}

export const useSimulationStore = create<SimulationStore>((set) => ({
  logs: [],
  addLog: (log) => set((state) => ({
    logs: [{ ...log, id: `log-${Date.now()}-${Math.random()}`, timestamp: Date.now() }, ...state.logs]
  })),
  clearLogs: () => set({ logs: [] })
}))
