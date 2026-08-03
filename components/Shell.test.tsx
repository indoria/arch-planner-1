import { render, screen, fireEvent } from '@testing-library/react'
import Shell from './Shell'

jest.mock('react-resizable-panels', () => ({
  PanelGroup: ({ children }: any) => <div data-testid="panel-group">{children}</div>,
  Panel: ({ children, 'data-testid': testId }: any) => <div data-testid={testId}>{children}</div>,
  PanelResizeHandle: () => <div data-testid="resize-handle" />,
}))

// Mock BlankState to verify it's rendered
jest.mock('./BlankState', () => {
  return function MockBlankState() {
    return <div data-testid="mock-blank-state">Mock Blank State</div>
  }
})

describe('Shell Component', () => {
  it('renders activity bar with explorer and library icons', () => {
    render(<Shell />)
    expect(screen.getByTestId('activity-bar')).toBeInTheDocument()
    expect(screen.getByTestId('icon-explorer')).toBeInTheDocument()
    expect(screen.getByTestId('icon-library')).toBeInTheDocument()
  })

  it('renders sidebar with explorer content by default', () => {
    render(<Shell />)
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByText('Explorer')).toBeInTheDocument()
  })

  it('switches sidebar content when activity bar icons are clicked', () => {
    render(<Shell />)
    const libraryIcon = screen.getByTestId('icon-library')
    fireEvent.click(libraryIcon)
    expect(screen.getByText('Interactive Library')).toBeInTheDocument()
    
    const explorerIcon = screen.getByTestId('icon-explorer')
    fireEvent.click(explorerIcon)
    expect(screen.getByText('Explorer')).toBeInTheDocument()
  })

  it('renders editor area', () => {
    render(<Shell />)
    expect(screen.getByTestId('editor-area')).toBeInTheDocument()
  })

  it('renders BlankState when no children are provided', () => {
    render(<Shell />)
    expect(screen.getByTestId('mock-blank-state')).toBeInTheDocument()
  })
})
