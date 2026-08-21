import { render, screen, fireEvent, act } from '@testing-library/react'
import CallLogPane from './CallLogPane'
import { create } from 'zustand'

// Mock store for simulation logs
interface LogEntry {
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

// Mock the store in the component
jest.mock('@/store/useSimulationStore', () => {
  const { create } = jest.requireActual('zustand')
  const store = create((set: any) => ({
    logs: [],
    addLog: (log: any) => set((state: any) => ({
      logs: [{ ...log, id: Math.random().toString(), timestamp: Date.now() }, ...state.logs]
    })),
    clearLogs: () => set({ logs: [] })
  }))
  return {
    useSimulationStore: store
  }
})

import { useSimulationStore } from '@/store/useSimulationStore'

describe('CallLogPane', () => {
  beforeEach(() => {
    useSimulationStore.getState().clearLogs()
  })

  it('renders a blank state when there are no logs', () => {
    render(<CallLogPane />)
    expect(screen.getByText(/No simulation events recorded/i)).toBeInTheDocument()
  })

  it('renders a list of log entries', () => {
    act(() => {
        useSimulationStore.getState().addLog({
            nodeId: 'node-1',
            nodeLabel: 'ASR',
            type: 'info',
            message: 'Started processing'
        })
    })

    render(<CallLogPane />)
    
    expect(screen.getByText(/ASR/)).toBeInTheDocument()
    expect(screen.getByText(/Started processing/)).toBeInTheDocument()
  })

  it('filters logs based on search input', () => {
    act(() => {
        useSimulationStore.getState().addLog({ nodeId: 'n1', nodeLabel: 'ASR', type: 'info', message: 'ASR Start' })
        useSimulationStore.getState().addLog({ nodeId: 'n2', nodeLabel: 'LLM', type: 'info', message: 'LLM Start' })
    })

    render(<CallLogPane />)
    
    const searchInput = screen.getByPlaceholderText(/Filter logs/i)
    fireEvent.change(searchInput, { target: { value: 'LLM' } })
    
    expect(screen.queryByText(/ASR Start/)).not.toBeInTheDocument()
    expect(screen.getByText(/LLM Start/)).toBeInTheDocument()
  })

  it('clears logs when clear button is clicked', () => {
    act(() => {
        useSimulationStore.getState().addLog({ nodeId: 'n1', nodeLabel: 'ASR', type: 'info', message: 'ASR Start' })
    })
    
    render(<CallLogPane />)
    
    const clearButton = screen.getByTitle(/Clear logs/i)
    fireEvent.click(clearButton)
    
    expect(screen.getByText(/No simulation events recorded/i)).toBeInTheDocument()
  })

  it('automatically scrolls to bottom when new logs are added', () => {
    render(<CallLogPane />)
    const logContainer = screen.getByTestId('log-container')
    
    // Mock scrollTo
    const scrollToMock = jest.fn()
    logContainer.scrollTo = scrollToMock
    
    act(() => {
        useSimulationStore.getState().addLog({ nodeId: 'n1', nodeLabel: 'ASR', type: 'info', message: 'New Log' })
    })
    
    expect(scrollToMock).toHaveBeenCalled()
  })

  it('filters logs by node ID', () => {
    act(() => {
        useSimulationStore.getState().addLog({ nodeId: 'node-asr', nodeLabel: 'ASR', type: 'info', message: 'ASR Start' })
        useSimulationStore.getState().addLog({ nodeId: 'node-llm', nodeLabel: 'LLM', type: 'info', message: 'LLM Start' })
    })

    render(<CallLogPane />)
    
    const searchInput = screen.getByPlaceholderText(/Filter logs/i)
    fireEvent.change(searchInput, { target: { value: 'node-llm' } })
    
    expect(screen.queryByText(/ASR Start/)).not.toBeInTheDocument()
    expect(screen.getByText(/LLM Start/)).toBeInTheDocument()
  })

  it('implements basic virtualization by limiting rendered items', () => {
    act(() => {
        for (let i = 0; i < 200; i++) {
            useSimulationStore.getState().addLog({ 
                nodeId: `n${i}`, 
                nodeLabel: 'TEST', 
                type: 'info', 
                message: `Log ${i}` 
            })
        }
    })

    render(<CallLogPane />)
    
    // Expect only a subset to be rendered (e.g., 100 max)
    const logItems = screen.getAllByTestId('log-item')
    expect(logItems.length).toBeLessThanOrEqual(100)
  })
})
