import { render, screen } from '@testing-library/react'
import ArchitectureNode from './ArchitectureNode'
import { Socket } from '@/store/architecture'

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

  it('renders the node label', () => {
    render(<ArchitectureNode data={mockData} />)
    expect(screen.getByText('Test Node')).toBeInTheDocument()
  })

  it('renders the correct number of input handles', () => {
    render(<ArchitectureNode data={mockData} />)
    const inputHandles = screen.getAllByTestId(/^handle-target-/)
    expect(inputHandles).toHaveLength(1)
    expect(screen.getByTestId('handle-target-in-1')).toBeInTheDocument()
  })

  it('renders the correct number of output handles', () => {
    render(<ArchitectureNode data={mockData} />)
    const outputHandles = screen.getAllByTestId(/^handle-source-/)
    expect(outputHandles).toHaveLength(2)
    expect(screen.getByTestId('handle-source-out-1')).toBeInTheDocument()
    expect(screen.getByTestId('handle-source-out-2')).toBeInTheDocument()
  })

  it('renders socket labels', () => {
    render(<ArchitectureNode data={mockData} />)
    expect(screen.getByText('Audio In')).toBeInTheDocument()
    expect(screen.getByText('Audio Out')).toBeInTheDocument()
    expect(screen.getByText('Text Out')).toBeInTheDocument()
  })
})
