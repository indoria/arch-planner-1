'use client'

import React from 'react'
import { useTabStore } from '@/store/useTabStore'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs() {
  const drillDownStack = useTabStore((state) => state.drillDownStack)
  const goUp = useTabStore((state) => state.goUp)
  const resetView = useTabStore((state) => state.resetView)
  const activeTabId = useTabStore((state) => state.activeTabId)
  const openTabs = useTabStore((state) => state.openTabs)
  
  const activeTab = openTabs.find(t => t.id === activeTabId)
  
  if (!activeTab) return null
  
  return (
    <div className="flex items-center gap-1 p-2 text-[11px] text-[#858585] bg-[#252526] border-b border-[#2b2b2b] select-none">
      <button 
        onClick={resetView}
        className={`flex items-center gap-1 hover:text-white transition-colors ${drillDownStack.length === 0 ? 'text-white font-bold' : ''}`}
      >
        <Home size={12} />
        {activeTab.title}
      </button>

      {drillDownStack.map((step, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} className="text-[#444]" />
          <button
            onClick={() => {
                // To go to a specific index in the stack, we could call goUp multiple times 
                // but let's just implement a simple logic here or add an action.
                // For now, only the current view is highlighted.
            }}
            className={`hover:text-white transition-colors ${index === drillDownStack.length - 1 ? 'text-[#007acc] font-bold' : ''}`}
          >
            {step.label}
          </button>
        </React.Fragment>
      ))}
      
      {drillDownStack.length > 0 && (
          <button 
            onClick={goUp}
            className="ml-auto text-[#858585] hover:text-white flex items-center gap-1"
          >
              Back to Parent
          </button>
      )}
    </div>
  )
}
