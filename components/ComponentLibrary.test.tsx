import { render, screen, fireEvent } from '@testing-library/react'
import ComponentLibrary from './ComponentLibrary'

describe('ComponentLibrary Component', () => {
  it('renders a search input', () => {
    render(<ComponentLibrary />)
    expect(screen.getByPlaceholderText(/Search components/i)).toBeInTheDocument()
  })

  it('renders a list of components', () => {
    render(<ComponentLibrary />)
    // Assuming some default components are rendered
    expect(screen.getAllByText(/ASR/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/LLM/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/TTS/i).length).toBeGreaterThan(0)
  })

  it('filters components based on search input', () => {
    render(<ComponentLibrary />)
    const searchInput = screen.getByPlaceholderText(/Search components/i)
    
    fireEvent.change(searchInput, { target: { value: 'LLM' } })
    
    expect(screen.getAllByText(/LLM/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/Standard ASR/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Standard TTS/i)).not.toBeInTheDocument()
  })

  it('sets dataTransfer on drag start', () => {
    render(<ComponentLibrary />)
    const comp = screen.getByText('Standard LLM').closest('[draggable="true"]')
    
    if (!comp) throw new Error('Draggable component not found')

    const dataTransfer = {
      setData: jest.fn(),
      setDragImage: jest.fn(),
      effectAllowed: '',
    }

    fireEvent.dragStart(comp, { dataTransfer })

    expect(dataTransfer.setData).toHaveBeenCalledWith('application/reactflow', expect.stringContaining('LLM'))
    expect(dataTransfer.effectAllowed).toBe('move')
    expect(dataTransfer.setDragImage).toHaveBeenCalled()
  })
})
