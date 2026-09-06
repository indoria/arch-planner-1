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
    
    // Check for Secondary values - matching partial text to handle spaces/colons
    expect(screen.getAllByText(/Secondary/i)).toHaveLength(5) // 3 labels + 2 descriptive summaries
    expect(screen.getByText(/1200ms/i)).toBeInTheDocument()
    expect(screen.getAllByText(/\$0.050/i)).toHaveLength(2) // One in secondary value, one in descriptive summary
    
    // Check for Deltas
    expect(screen.getAllByText(/Delta:/i)).toHaveLength(2)
    expect(screen.getByText(/\+200/i)).toBeInTheDocument()
    expect(screen.getByText(/-0.05/i)).toBeInTheDocument()
  })

  it('renders descriptive summary when comparing two architectures', () => {
    useTabStore.setState({
      isSplitView: true,
      openTabs: [
        { id: 'tab1', title: 'Arch A', content: { nodes: [], connections: [] } },
        { id: 'tab2', title: 'Arch B', content: { nodes: [], connections: [] } }
      ],
      activeTabId: 'tab1',
      secondaryActiveTabId: 'tab2'
    });

    useSimulationStore.setState({
      aggregatedMetrics: { totalLatency: 1000, totalCost: 0.10, nodeCount: 2 },
      secondaryAggregatedMetrics: { totalLatency: 1200, totalCost: 0.05, nodeCount: 2 }
    });

    render(<MetricsDashboard />)

    // Example expected text: "Arch B is 200ms slower than Arch A"
    expect(screen.getByText(/Arch B is 200ms slower than Arch A/i)).toBeInTheDocument()
    // Example expected text: "Arch B is $0.050 cheaper than Arch A"
    expect(screen.getByText(/Arch B is \$0.050 cheaper than Arch A/i)).toBeInTheDocument()
  })
})
