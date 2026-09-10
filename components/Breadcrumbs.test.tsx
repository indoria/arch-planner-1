import { render, screen, fireEvent } from '@testing-library/react'
import Breadcrumbs from './Breadcrumbs'
import { useTabStore } from '@/store/useTabStore'
import { ExportService } from '@/utils/exportService'

// Mock ExportService
jest.mock('@/utils/exportService', () => ({
  ExportService: {
    export: jest.fn(() => ({ data: '{}', format: 'json', filename: 'test.json' }))
  }
}))

// Mock ExportUtils
jest.mock('@/utils/exportUtils', () => ({
  exportToJson: jest.fn(),
  exportToYaml: jest.fn(),
  exportToSvg: jest.fn()
}))

describe('Breadcrumbs', () => {
  beforeEach(() => {
    useTabStore.getState().closeAllTabs()
    jest.clearAllMocks()
  })

  it('renders nothing if no active tab', () => {
    render(<Breadcrumbs />)
    expect(screen.queryByText(/Home/)).not.toBeInTheDocument()
  })

  it('renders the active tab title as root', () => {
    useTabStore.getState().openTab({ 
      id: '1', 
      title: 'My Architecture', 
      content: { nodes: [], connections: [] } 
    })
    
    render(<Breadcrumbs />)
    expect(screen.getByText('My Architecture')).toBeInTheDocument()
  })

  it('renders export button when active tab exists', () => {
    useTabStore.getState().openTab({ 
      id: '1', 
      title: 'My Architecture', 
      content: { nodes: [], connections: [] } 
    })
    
    render(<Breadcrumbs />)
    expect(screen.getByText('Export')).toBeInTheDocument()
  })

  it('shows export menu when clicking Export', () => {
    useTabStore.getState().openTab({ 
      id: '1', 
      title: 'My Architecture', 
      content: { nodes: [], connections: [] } 
    })
    
    render(<Breadcrumbs />)
    fireEvent.click(screen.getByText('Export'))
    
    expect(screen.getByText('Export as JSON')).toBeInTheDocument()
    expect(screen.getByText('Export as YAML')).toBeInTheDocument()
    expect(screen.getByText('High-Res SVG Export')).toBeInTheDocument()
  })

  it('calls ExportService when an export option is clicked', () => {
    useTabStore.getState().openTab({ 
      id: '1', 
      title: 'My Architecture', 
      content: { nodes: [], connections: [] } 
    })
    
    render(<Breadcrumbs />)
    fireEvent.click(screen.getByText('Export'))
    fireEvent.click(screen.getByText('Export as JSON'))
    
    expect(ExportService.export).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ format: 'json' })
    )
  })
});
