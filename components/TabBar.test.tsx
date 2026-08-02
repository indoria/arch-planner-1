import { render, screen, fireEvent } from '@testing-library/react'
import TabBar from './TabBar'
import { useTabStore } from '@/store/useTabStore'

describe('TabBar Component', () => {
  beforeEach(() => {
    useTabStore.getState().closeAllTabs()
  })

  it('renders nothing when no tabs are open', () => {
    render(<TabBar />)
    expect(screen.queryByTestId('tab-bar')).not.toBeInTheDocument()
  })

  it('renders open tabs', () => {
    useTabStore.getState().openTab({ id: '1', title: 'Arch 1', content: { nodes: [], connections: [] } })
    useTabStore.getState().openTab({ id: '2', title: 'Arch 2', content: { nodes: [], connections: [] } })
    
    render(<TabBar />)
    expect(screen.getByText('Arch 1')).toBeInTheDocument()
    expect(screen.getByText('Arch 2')).toBeInTheDocument()
  })

  it('sets active tab when clicked', () => {
    useTabStore.getState().openTab({ id: '1', title: 'Arch 1', content: { nodes: [], connections: [] } })
    useTabStore.getState().openTab({ id: '2', title: 'Arch 2', content: { nodes: [], connections: [] } })
    
    render(<TabBar />)
    fireEvent.click(screen.getByText('Arch 1'))
    
    expect(useTabStore.getState().activeTabId).toBe('1')
  })

  it('closes tab when close button is clicked', () => {
    useTabStore.getState().openTab({ id: '1', title: 'Arch 1', content: { nodes: [], connections: [] } })
    
    render(<TabBar />)
    const closeButton = screen.getByTestId('close-tab-1')
    fireEvent.click(closeButton)
    
    expect(useTabStore.getState().openTabs).toEqual([])
  })
})
