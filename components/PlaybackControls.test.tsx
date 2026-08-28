import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PlaybackControls from './PlaybackControls'
import { useSimulationStore } from '@/store/useSimulationStore'

// Mock the store
jest.mock('@/store/useSimulationStore')

describe('PlaybackControls', () => {
  const mockJumpToSnapshot = jest.fn()
  const mockClearHistory = jest.fn()
  const mockResetTelemetry = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSimulationStore as any).mockReturnValue({
      history: [
        { timestamp: 1000, results: {} },
        { timestamp: 2000, results: {} },
        { timestamp: 3000, results: {} }
      ],
      currentSnapshotIndex: 1,
      jumpToSnapshot: mockJumpToSnapshot,
      clearHistory: mockClearHistory,
      resetTelemetry: mockResetTelemetry
    })
  })

  it('renders playback info correctly', () => {
    render(<PlaybackControls />)
    expect(screen.getByText('2 / 3')).toBeDefined()
    expect(screen.getByRole('slider')).toHaveProperty('value', '1')
  })

  it('calls jumpToSnapshot on slider change', () => {
    render(<PlaybackControls />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '2' } })
    expect(mockJumpToSnapshot).toHaveBeenCalledWith(2)
  })

  it('calls jumpToSnapshot on step buttons', () => {
    render(<PlaybackControls />)
    const backButton = screen.getByTitle('Step Backward')
    const forwardButton = screen.getByTitle('Step Forward')

    fireEvent.click(backButton)
    expect(mockJumpToSnapshot).toHaveBeenCalledWith(0)

    fireEvent.click(forwardButton)
    expect(mockJumpToSnapshot).toHaveBeenCalledWith(2)
  })

  it('calls reset on Reset button click', () => {
    render(<PlaybackControls />)
    const resetButton = screen.getByTitle('Clear Simulation History')
    fireEvent.click(resetButton)
    expect(mockClearHistory).toHaveBeenCalled()
    expect(mockResetTelemetry).toHaveBeenCalled()
  })

  it('renders nothing if history is empty', () => {
    ;(useSimulationStore as any).mockReturnValue({
      history: [],
      currentSnapshotIndex: -1
    })
    const { container } = render(<PlaybackControls />)
    expect(container.firstChild).toBeNull()
  })
});
