import { render, screen } from '@testing-library/react'
import Inspector from './Inspector'
import { useTabStore } from '@/store/useTabStore'
import { AVAILABLE_COMPONENTS } from '@/store/components'

describe('Inspector', () => {
  beforeEach(() => {
    useTabStore.getState().closeAllTabs()
  })

  it('renders a blank state when no node is selected', () => {
    render(<Inspector />)
    expect(screen.getByText(/Select a node to view details/i)).toBeInTheDocument()
  })

  it('renders node details when a node is selected', () => {
    const component = AVAILABLE_COMPONENTS[0] // ASR
    const mockArch = {
      nodes: [
        { 
          id: 'n1', 
          type: component.type, 
          label: component.label, 
          sockets: component.sockets, 
          position: { x: 0, y: 0 }, 
          data: { label: component.label, sockets: component.sockets } 
        }
      ],
      connections: []
    }
    
    useTabStore.getState().openTab({ id: '1', title: 'Arch 1', content: mockArch })
    useTabStore.getState().setSelectedNodeId('n1')
    
    render(<Inspector />)
    
    expect(screen.getByText(component.label)).toBeInTheDocument()
    expect(screen.getByText(component.description)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(component.cost.replace('$', '\\$'), 'i'))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(component.latency, 'i'))).toBeInTheDocument()
  })
})
