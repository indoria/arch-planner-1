import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TourGuide, { TOUR_STEPS } from './TourGuide'

describe('TourGuide Component', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('defines the 4 key IDE tour steps: Activity Bar -> Explorer -> Tabs/Editor -> Inspector', () => {
    expect(TOUR_STEPS).toHaveLength(4)
    expect(TOUR_STEPS[0].targetId).toBe('activity-bar')
    expect(TOUR_STEPS[1].targetId).toBe('sidebar')
    expect(TOUR_STEPS[2].targetId).toBe('editor-area')
    expect(TOUR_STEPS[3].targetId).toBe('inspector-panel')
  })

  it('renders step 1 (Activity Bar) initially', () => {
    render(<TourGuide isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByTestId('tour-guide-dialog')).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
    expect(screen.getByText(TOUR_STEPS[0].title)).toBeInTheDocument()
    expect(screen.getByText(TOUR_STEPS[0].description)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('navigates through steps: Activity Bar -> Explorer -> Tabs -> Inspector', () => {
    render(<TourGuide isOpen={true} onClose={mockOnClose} />)

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
    expect(screen.getByText(TOUR_STEPS[1].title)).toBeInTheDocument()

    // Step 2 -> Step 3
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText('Step 3 of 4')).toBeInTheDocument()
    expect(screen.getByText(TOUR_STEPS[2].title)).toBeInTheDocument()

    // Step 3 -> Step 4
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText('Step 4 of 4')).toBeInTheDocument()
    expect(screen.getByText(TOUR_STEPS[3].title)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /finish|done|complete/i })).toBeInTheDocument()

    // Step 4 -> Previous (back to Step 3)
    fireEvent.click(screen.getByRole('button', { name: /back|previous/i }))
    expect(screen.getByText('Step 3 of 4')).toBeInTheDocument()
    expect(screen.getByText(TOUR_STEPS[2].title)).toBeInTheDocument()
  })

  it('closes tour on Skip Tour button and calls onClose', () => {
    render(<TourGuide isOpen={true} onClose={mockOnClose} />)

    const skipBtn = screen.getByRole('button', { name: /skip/i })
    fireEvent.click(skipBtn)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('closes tour when clicking the X close button', () => {
    render(<TourGuide isOpen={true} onClose={mockOnClose} />)

    const closeBtn = screen.getByRole('button', { name: /close tour/i })
    fireEvent.click(closeBtn)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('completes tour on final step Finish button', () => {
    render(<TourGuide isOpen={true} onClose={mockOnClose} />)

    // Advance to step 4
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    const finishBtn = screen.getByRole('button', { name: /finish|done|complete/i })
    fireEvent.click(finishBtn)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not render when isOpen is false', () => {
    render(<TourGuide isOpen={false} onClose={mockOnClose} />)
    expect(screen.queryByTestId('tour-guide-dialog')).not.toBeInTheDocument()
  })
})
