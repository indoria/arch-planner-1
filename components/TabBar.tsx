'use client'

import React from 'react'
import { useTabStore } from '@/store/useTabStore'
import { X, FileJson, Columns } from 'lucide-react'

export default function TabBar() {
  const { openTabs, activeTabId, setActiveTab, closeTab, isSplitView, setSplitView } = useTabStore()

  if (openTabs.length === 0) return null

  return (
    <div className="flex bg-[#252526] overflow-x-auto no-scrollbar border-b border-[#2b2b2b]" data-testid="tab-bar">
      <div className="flex-1 flex overflow-x-auto no-scrollbar">
        {openTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center min-w-[120px] max-w-[200px] h-9 px-3 cursor-pointer border-r border-[#2b2b2b] transition-colors group relative ${
              activeTabId === tab.id ? 'bg-[#1e1e1e] text-white' : 'text-[#858585] hover:bg-[#2a2d2e] hover:text-[#cccccc]'
            }`}
          >
            <FileJson size={14} className="mr-2 text-[#e37933]" />
            <span className="text-xs truncate flex-1">{tab.title}</span>
            <button
              data-testid={`close-tab-${tab.id}`}
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
              className={`p-0.5 rounded hover:bg-[#454545] transition-colors ml-2 opacity-0 group-hover:opacity-100 ${
                activeTabId === tab.id ? 'opacity-100' : ''
              }`}
            >
              <X size={14} />
            </button>
            {activeTabId === tab.id && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#007acc]" />}
          </div>
        ))}
      </div>

      <div className="flex items-center px-2 gap-1 border-l border-[#2b2b2b]">
        <button
          onClick={() => setSplitView(!isSplitView)}
          className={`p-1.5 rounded transition-colors ${isSplitView ? 'text-white bg-[#37373d]' : 'text-[#858585] hover:text-[#cccccc] hover:bg-[#2a2d2e]'}`}
          title={isSplitView ? "Single View" : "Split Editor Right"}
        >
          <Columns size={16} />
        </button>
      </div>
    </div>
  )
}
