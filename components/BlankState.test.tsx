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

  it('renders baseline architecture buttons and opens them when clicked', () => {
    render(<BlankState />)
    expect(screen.getByText('Cheapest 650ms')).toBeInTheDocument()
    expect(screen.getByText('Ultra-Low 200ms')).toBeInTheDocument()

    const cheapBtn = screen.getByTestId('load-baseline-cheapest')
    fireEvent.click(cheapBtn)
    expect(mockOpenTab).toHaveBeenCalledWith(expect.objectContaining({
      id: 'baseline-cheapest-650ms',
      title: 'Cheapest 650ms Setup'
    }))

    const ultraLowBtn = screen.getByTestId('load-baseline-ultralow')
    fireEvent.click(ultraLowBtn)
    expect(mockOpenTab).toHaveBeenCalledWith(expect.objectContaining({
      id: 'baseline-ultra-low-latency-200ms',
      title: 'Ultra-Low Latency 200ms Setup'
    }))
  })
})
