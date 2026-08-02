'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface KnowledgeAccordionProps {
  title: string
  children: React.ReactNode
}

export default function KnowledgeAccordion({ title, children }: KnowledgeAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 text-left p-2 font-medium bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {title}
      </button>
      {isOpen && (
        <div className="p-2 bg-white animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  )
}
