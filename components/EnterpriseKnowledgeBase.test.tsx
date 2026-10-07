import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EnterpriseKnowledgeBase, { ENTERPRISE_KNOWLEDGE_BASE } from './EnterpriseKnowledgeBase'

describe('Enterprise Knowledge Base Data & Progressive Disclosure', () => {
  it('contains the mandatory 6 enterprise voicebot concepts in repository', () => {
    expect(ENTERPRISE_KNOWLEDGE_BASE).toHaveLength(6)
    
    const titles = ENTERPRISE_KNOWLEDGE_BASE.map(item => item.title)
    expect(titles).toContain('Semantic Endpointing')
    expect(titles).toContain('Sentence-Boundary Streaming')
    expect(titles).toContain('Backchannel Filtering')
    expect(titles).toContain('Latency Masking')
    expect(titles).toContain('Acoustic Echo Cancellation')
    expect(titles).toContain('Speculative Execution')

    ENTERPRISE_KNOWLEDGE_BASE.forEach(item => {
      expect(item.summary).toBeDefined()
      expect(typeof item.summary).toBe('string')
      expect(item.summary.length).toBeGreaterThan(15)
      expect(item.deepDive).toBeDefined()
      expect(item.deepDive.mechanism).toBeDefined()
      expect(item.deepDive.strategy).toBeDefined()
    })
  })

  it('renders all 6 concepts in the UI', () => {
    render(<EnterpriseKnowledgeBase />)

    expect(screen.getByText('Semantic Endpointing')).toBeInTheDocument()
    expect(screen.getByText('Sentence-Boundary Streaming')).toBeInTheDocument()
    expect(screen.getByText('Backchannel Filtering')).toBeInTheDocument()
    expect(screen.getByText('Latency Masking')).toBeInTheDocument()
    expect(screen.getByText('Acoustic Echo Cancellation')).toBeInTheDocument()
    expect(screen.getByText('Speculative Execution')).toBeInTheDocument()
  })

  it('implements progressive disclosure: renders summary and reveals deep dive on demand', () => {
    render(<EnterpriseKnowledgeBase />)

    // Open first concept accordion
    const endpointingBtn = screen.getByRole('button', { name: /Semantic Endpointing/i })
    fireEvent.click(endpointingBtn)

    // Summary should be visible
    const endpointingSummary = screen.getByText(ENTERPRISE_KNOWLEDGE_BASE[0].summary)
    expect(endpointingSummary).toBeInTheDocument()

    // Deep dive content should not be visible before clicking deep dive toggle
    expect(screen.queryByText(ENTERPRISE_KNOWLEDGE_BASE[0].deepDive.mechanism)).not.toBeInTheDocument()

    // Click "Deep Dive" toggle
    const deepDiveToggle = screen.getByTestId(`deep-dive-toggle-${ENTERPRISE_KNOWLEDGE_BASE[0].id}`)
    fireEvent.click(deepDiveToggle)

    // Now deep dive content is displayed
    expect(screen.getByText(ENTERPRISE_KNOWLEDGE_BASE[0].deepDive.mechanism)).toBeInTheDocument()
    expect(screen.getByText(ENTERPRISE_KNOWLEDGE_BASE[0].deepDive.strategy)).toBeInTheDocument()

    // Clicking deep dive toggle again collapses it
    fireEvent.click(deepDiveToggle)
    expect(screen.queryByText(ENTERPRISE_KNOWLEDGE_BASE[0].deepDive.mechanism)).not.toBeInTheDocument()
  })

  it('supports searching/filtering concepts', () => {
    render(<EnterpriseKnowledgeBase />)

    const searchInput = screen.getByPlaceholderText(/search concepts/i)
    fireEvent.change(searchInput, { target: { value: 'Acoustic' } })

    expect(screen.getByText('Acoustic Echo Cancellation')).toBeInTheDocument()
    expect(screen.queryByText('Semantic Endpointing')).not.toBeInTheDocument()

    // Test no matching results
    fireEvent.change(searchInput, { target: { value: 'nonexistent-concept-xyz' } })
    expect(screen.getByText(/no matching concepts found/i)).toBeInTheDocument()
  })
})
