import { render, screen, fireEvent } from '@testing-library/react'
import BlankState from './BlankState'
import { useTabStore } from '@/store/useTabStore'

// Mock useTabStore
jest.mock('@/store/useTabStore', () => ({
  useTabStore: jest.fn(),
}))

describe('BlankState Component', () => {
  const mockOpenTab = jest.fn()

  beforeEach(() => {
    ;(useTabStore as any).mockImplementation((selector: any) => selector({
      openTab: mockOpenTab,
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the title and description', () => {
    render(<BlankState />)
    expect(screen.getByText('Architecture Planner')).toBeInTheDocument()
    expect(screen.getByText(/Design, simulate, and analyze/)).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    render(<BlankState />)
    expect(screen.getByText('New Architecture')).toBeInTheDocument()
    expect(screen.getByText('Open Architecture')).toBeInTheDocument()
    expect(screen.getByText('Browse Library')).toBeInTheDocument()
  })

  it('calls openTab when New Architecture is clicked', () => {
    render(<BlankState />)
    const newButton = screen.getByText('New Architecture').closest('button')
    fireEvent.click(newButton!)
    expect(mockOpenTab).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Untitled Architecture',
    }))
  })
})
