import { render, screen, fireEvent } from '@testing-library/react'
import ArchitectureCanvas from './ArchitectureCanvas'
import { useTabStore } from '@/store/useTabStore'

// Mock ReactFlow
jest.mock('reactflow', () => {
  const ReactFlow = ({ nodes, edges, onDrop, onDragOver, children }: any) => (
    <div 
      data-testid="rf-mock" 
      onDrop={onDrop} 
      onDragOver={onDragOver}
    >
      <div data-testid="rf-nodes">{nodes?.length || 0}</div>
      <div data-testid="rf-edges">{edges?.length || 0}</div>
      {children}
    </div>
  )
  return ReactFlow
})

describe('ArchitectureCanvas', () => {
  beforeEach(() => {
    useTabStore.getState().closeAllTabs()
  })

  it('renders the canvas container', () => {
    render(<ArchitectureCanvas />)
    expect(screen.getByTestId('architecture-canvas')).toBeInTheDocument()
  })

  it('renders nodes from the active tab state', () => {
    const mockArch = {
      nodes: [
        { id: 'n1', type: 'custom', label: 'Node 1', sockets: [], position: { x: 0, y: 0 }, data: {} }
      ],
      connections: []
    }
    
    useTabStore.getState().openTab({ id: '1', title: 'Arch 1', content: mockArch })
    
    render(<ArchitectureCanvas />)
    
    expect(screen.getByTestId('rf-nodes')).toHaveTextContent('1')
  })

  it('renders edges from the active tab state', () => {
    const mockArch = {
      nodes: [
        { id: 'n1', type: 'custom', label: 'Node 1', sockets: [], position: { x: 0, y: 0 }, data: {} },
        { id: 'n2', type: 'custom', label: 'Node 2', sockets: [], position: { x: 100, y: 100 }, data: {} }
      ],
      connections: [
        { id: 'c1', sourceNodeId: 'n1', sourceSocketId: 's1', targetNodeId: 'n2', targetSocketId: 's2' }
      ]
    }
    
    useTabStore.getState().openTab({ id: '1', title: 'Arch 1', content: mockArch })
    
    render(<ArchitectureCanvas />)
    
    expect(screen.getByTestId('rf-edges')).toHaveTextContent('1')
  })

  it('renders nodes from the secondary tab state when tabId is provided', () => {
    const mockArch1 = {
      nodes: [{ id: 'n1', label: 'Node 1', sockets: [], position: { x: 0, y: 0 } }],
      connections: []
    }
    const mockArch2 = {
      nodes: [{ id: 'n2', label: 'Node 2', sockets: [], position: { x: 0, y: 0 } }],
      connections: []
    }
    
    useTabStore.getState().openTab({ id: '1', title: 'Arch 1', content: mockArch1 as any })
    useTabStore.getState().openTab({ id: '2', title: 'Arch 2', content: mockArch2 as any })
    useTabStore.getState().setActiveTab('1')
    useTabStore.getState().setSplitView(true)
    useTabStore.getState().setSecondaryActiveTab('2')
    
    // Render only the secondary canvas
    render(<ArchitectureCanvas tabId="2" />)
    expect(screen.getByTestId('rf-nodes')).toHaveTextContent('1')
  })
})
