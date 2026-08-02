import { render, screen, fireEvent } from '@testing-library/react'
import KnowledgeAccordion from './KnowledgeAccordion'

describe('KnowledgeAccordion', () => {
  it('renders the title', () => {
    render(<KnowledgeAccordion title="Test Title">Content</KnowledgeAccordion>)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('shows content when title is clicked', () => {
    render(<KnowledgeAccordion title="Test Title">Content</KnowledgeAccordion>)
    
    // Initially not in document
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
    
    const button = screen.getByRole('button', { name: /test title/i })
    fireEvent.click(button)
    
    expect(screen.getByText('Content')).toBeInTheDocument()
    
    // Click again to hide
    fireEvent.click(button)
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })
})
