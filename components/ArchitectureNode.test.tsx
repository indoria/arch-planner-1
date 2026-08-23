import { render, screen } from '@testing-library/react'
import ArchitectureNode from './ArchitectureNode'
import { Socket } from '@/store/architecture'
import { useSimulationStore } from '@/store/useSimulationStore'

// Mock React Flow's Handle component since it requires a specific context
jest.mock('reactflow', () => ({
  Handle: ({ type, position, id }: any) => (
    <div data-testid={`handle-${type}-${id}`} data-position={position} />
  ),
  Position: {
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom',
  }
}))

describe('ArchitectureNode', () => {
  const mockSockets: Socket[] = [
    { id: 'in-1', type: 'audio', direction: 'input', label: 'Audio In' },
    { id: 'out-1', type: 'audio', direction: 'output', label: 'Audio Out' },
    { id: 'out-2', type: 'text', direction: 'output', label: 'Text Out' },
  ]

  const mockData = {
    label: 'Test Node',
    sockets: mockSockets,
  }

  beforeEach(() => {
    useSimulationStore.getState().resetTelemetry();
  });

  it('renders the node label', () => {
    render(<ArchitectureNode id="node-1" data={mockData} selected={false} zIndex={0} isConnectable={true} xPos={0} yPos={0} dragging={false} />)
    expect(screen.getByText('Test Node')).toBeInTheDocument()
  })

  it('renders latency when telemetry is available', () => {
    useSimulationStore.getState().setNodeTelemetry('node-1', {
      status: 'success',
      latency: 123
    });

    render(<ArchitectureNode id="node-1" data={mockData} selected={false} zIndex={0} isConnectable={true} xPos={0} yPos={0} dragging={false} />)
    expect(screen.getByText('123ms')).toBeInTheDocument()
  })

  it('renders running status', () => {
    useSimulationStore.getState().setNodeTelemetry('node-1', {
      status: 'running',
      latency: 0
    });

    render(<ArchitectureNode id="node-1" data={mockData} selected={false} zIndex={0} isConnectable={true} xPos={0} yPos={0} dragging={false} />)
    expect(screen.getByTestId('status-indicator')).toHaveClass('bg-blue-500')
  })

  it('renders error status', () => {
    useSimulationStore.getState().setNodeTelemetry('node-1', {
      status: 'error',
      latency: 0,
      error: 'Failed'
    });

    render(<ArchitectureNode id="node-1" data={mockData} selected={false} zIndex={0} isConnectable={true} xPos={0} yPos={0} dragging={false} />)
    expect(screen.getByTestId('status-indicator')).toHaveClass('bg-red-500')
  })
})
