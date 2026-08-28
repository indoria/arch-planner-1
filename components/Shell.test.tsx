import { render, screen, fireEvent } from '@testing-library/react'
import Shell from './Shell'

jest.mock('react-resizable-panels', () => ({
  PanelGroup: ({ children }: any) => <div data-testid="panel-group">{children}</div>,
  Panel: ({ children, 'data-testid': testId, className }: any) => {
    // Look for inspector by checking children or specific styling if testId is missing
    const isInspector = className?.includes('border-l') || false
    return <div data-testid={testId || (isInspector ? 'right-panel' : undefined)}>{children}</div>
  },
  PanelResizeHandle: () => <div data-testid="resize-handle" />,
}))

// Mock Inspector to verify it's rendered
jest.mock('./Inspector', () => {
  return function MockInspector() {
    return <div data-testid="mock-inspector">Mock Inspector</div>
  }
})

// Mock BlankState to verify it's rendered
jest.mock('./BlankState', () => {
  return function MockBlankState() {
    return <div data-testid="mock-blank-state">Mock Blank State</div>
  }
})

// Mock ComponentLibrary to verify it's rendered
jest.mock('./ComponentLibrary', () => {
  return function MockComponentLibrary() {
    return <div data-testid="mock-component-library">Mock Component Library</div>
  }
})

// Mock PlaybackControls to verify it's rendered
jest.mock('./PlaybackControls', () => {
  return function MockPlaybackControls() {
    return <div data-testid="mock-playback-controls">Mock Playback Controls</div>
  }
})

describe('Shell Component', () => {
  it('renders activity bar with explorer, components, and library icons', () => {
    render(<Shell />)
    expect(screen.getByTestId('activity-bar')).toBeInTheDocument()
    expect(screen.getByTestId('icon-explorer')).toBeInTheDocument()
    expect(screen.getByTestId('icon-components')).toBeInTheDocument()
    expect(screen.getByTestId('icon-library')).toBeInTheDocument()
  })

  it('renders sidebar with explorer content by default', () => {
    render(<Shell />)
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByText('Explorer')).toBeInTheDocument()
  })

  it('switches sidebar content when activity bar icons are clicked', () => {
    render(<Shell />)
    
    const componentsIcon = screen.getByTestId('icon-components')
    fireEvent.click(componentsIcon)
    expect(screen.getByText('Components')).toBeInTheDocument()
    expect(screen.getByTestId('mock-component-library')).toBeInTheDocument()

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

  it('renders the Inspector in the right panel', () => {
    render(<Shell />)
    expect(screen.getByTestId('mock-inspector')).toBeInTheDocument()
  })

  it('renders PlaybackControls in the editor area', () => {
    render(<Shell />)
    expect(screen.getByTestId('mock-playback-controls')).toBeInTheDocument()
  })
})
