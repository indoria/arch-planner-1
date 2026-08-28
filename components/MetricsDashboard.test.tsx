import { render, screen } from '@testing-library/react'
import MetricsDashboard from './MetricsDashboard'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTabStore } from '@/store/useTabStore'

describe('MetricsDashboard', () => {
  beforeEach(() => {
    useSimulationStore.getState().resetTelemetry();
    useTabStore.getState().setSplitView(false);
  });

  it('renders "No data" message when no simulation has run', () => {
    render(<MetricsDashboard />)
    expect(screen.getByText(/Waiting for simulation/i)).toBeInTheDocument()
  })

  it('renders aggregated metrics when available', () => {
    useSimulationStore.getState().setAggregatedMetrics({
      totalLatency: 1200,
      totalCost: 0.05,
      nodeCount: 5
    });

    render(<MetricsDashboard />)
    expect(screen.getByText(/1200ms/i)).toBeInTheDocument()
    expect(screen.getByText(/\$0.050/i)).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders comparison deltas in split-view', () => {
    useTabStore.getState().setSplitView(true);
    
    useSimulationStore.getState().setAggregatedMetrics({
      totalLatency: 1000,
      totalCost: 0.10,
      nodeCount: 2
    }, false); // Primary

    useSimulationStore.getState().setAggregatedMetrics({
      totalLatency: 1200,
      totalCost: 0.05,
      nodeCount: 2
    }, true); // Secondary

    render(<MetricsDashboard />)
    
    // Primary values
    expect(screen.getByText(/1000ms/i)).toBeInTheDocument()
    
    // Check for Secondary values - multiple cards have this label
    expect(screen.getAllByText(/Secondary:/i)).toHaveLength(3)
    expect(screen.getByText(/1200ms/i)).toBeInTheDocument()
    expect(screen.getByText(/\$0.050/i)).toBeInTheDocument()
    
    // Check for Deltas
    expect(screen.getAllByText(/Delta:/i)).toHaveLength(2)
    expect(screen.getByText(/\+200ms/i)).toBeInTheDocument()
    expect(screen.getByText(/\$-0.050/i)).toBeInTheDocument()
  })
})
