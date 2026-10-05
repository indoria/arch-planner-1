import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Inspector from './Inspector'
import { useTabStore } from '@/store/useTabStore'
import { useComponentStore } from '@/store/useComponentStore'
import { AVAILABLE_COMPONENTS } from '@/store/components'

describe('Inspector', () => {
  beforeEach(() => {
    useTabStore.getState().closeAllTabs()
    useComponentStore.getState().clearRepository()
  })

  it('renders a blank state when no node is selected', () => {
    render(<Inspector />)
    expect(screen.getByText(/Select a node on the canvas to view and edit its properties/i)).toBeInTheDocument()
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

  it('publishes the selected node to the shared registry when clicking Share Node to Registry', async () => {
    const publishSpy = jest.spyOn(useComponentStore.getState(), 'publishToRegistry').mockResolvedValue({
      id: 'registry-55',
      type: 'asr',
      label: 'Standard ASR',
      description: 'Standard ASR description',
      cost: '$0.01/min',
      numericCost: 0.01,
      latency: '200ms',
      numericLatency: 200,
      sockets: []
    })

    const component = AVAILABLE_COMPONENTS[0]
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

    const shareButton = screen.getByRole('button', { name: /share node to registry/i })
    expect(shareButton).toBeInTheDocument()

    fireEvent.click(shareButton)

    await waitFor(() => {
      expect(publishSpy).toHaveBeenCalled()
      expect(screen.getByText(/published to registry!/i)).toBeInTheDocument()
    })

    publishSpy.mockRestore()
  })
})
