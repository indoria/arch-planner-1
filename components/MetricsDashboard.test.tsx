import { render, screen } from '@testing-library/react'
import MetricsDashboard from './MetricsDashboard'
import { useSimulationStore } from '@/store/useSimulationStore'

describe('MetricsDashboard', () => {
  beforeEach(() => {
    useSimulationStore.getState().resetTelemetry();
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
})
