import { render, screen, fireEvent } from '@testing-library/react'
import ComplaintsLog from './ComplaintsLog'
import { useTabStore } from '@/store/useTabStore'

describe('ComplaintsLog', () => {
  beforeEach(() => {
    useTabStore.getState().closeAllTabs()
    useTabStore.getState().clearComplaints()
  })

  it('renders a blank state when there are no complaints', () => {
    render(<ComplaintsLog />)
    expect(screen.getByText(/No architectural violations detected/i)).toBeInTheDocument()
  })

  it('renders a list of complaints', () => {
    useTabStore.getState().addComplaint('Test Error', 'error')
    useTabStore.getState().addComplaint('Test Warning', 'warning')
    
    render(<ComplaintsLog />)
    
    expect(screen.getByText('Test Error')).toBeInTheDocument()
    expect(screen.getByText('Test Warning')).toBeInTheDocument()
  })

  it('clears complaints when trash icon is clicked', () => {
    useTabStore.getState().addComplaint('Test Error', 'error')
    render(<ComplaintsLog />)
    
    const clearButton = screen.getByTitle(/Clear all complaints/i)
    fireEvent.click(clearButton)
    
    expect(screen.getByText(/No architectural violations detected/i)).toBeInTheDocument()
  })
})
