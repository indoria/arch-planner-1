'use client'

import React, { useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Files, Library, Settings, Search, Box } from 'lucide-react'

type View = 'explorer' | 'library'

export default function Shell({ children }: { children?: React.ReactNode }) {
  const [activeView, setActiveView] = useState<View>('explorer')

  return (
    <div className="flex h-screen w-screen bg-[#1e1e1e] text-[#cccccc] overflow-hidden" data-testid="shell">
      {/* Activity Bar */}
      <div className="flex flex-col items-center w-12 bg-[#333333] py-2 border-r border-[#2b2b2b]" data-testid="activity-bar">
        <button
          onClick={() => setActiveView('explorer')}
          className={`p-2 mb-2 hover:text-white transition-colors ${activeView === 'explorer' ? 'text-white border-l-2 border-white' : 'text-[#858585]'}`}
          data-testid="icon-explorer"
          aria-label="Explorer"
        >
          <Files size={24} />
        </button>
        <button
          onClick={() => setActiveView('library')}
          className={`p-2 mb-2 hover:text-white transition-colors ${activeView === 'library' ? 'text-white border-l-2 border-white' : 'text-[#858585]'}`}
          data-testid="icon-library"
          aria-label="Interactive Library"
        >
          <Library size={24} />
        </button>
        <div className="mt-auto">
          <button className="p-2 text-[#858585] hover:text-white">
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Main Panel Group */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Sidebar */}
        <Panel defaultSize={15} minSize={10} maxSize={40} data-testid="sidebar" className="bg-[#252526] border-r border-[#2b2b2b]">
          <div className="p-3 uppercase text-xs font-bold tracking-wider text-[#bbbbbb]">
            {activeView === 'explorer' ? 'Explorer' : 'Interactive Library'}
          </div>
          <div className="p-2">
            {activeView === 'explorer' ? (
              <div className="text-sm">Architectures Explorer Content</div>
            ) : (
              <div className="text-sm">Library Content</div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-[#1e1e1e] hover:bg-[#007acc] transition-colors" />

        {/* Editor Area */}
        <Panel data-testid="editor-area" className="flex flex-col h-full overflow-hidden">
          <PanelGroup direction="vertical">
            <Panel defaultSize={70} minSize={20} className="flex flex-col overflow-hidden">
              {children || (
                <div className="flex flex-col items-center justify-center h-full text-[#858585]">
                  <Box size={64} className="mb-4 opacity-20" />
                  <h1 className="text-2xl font-light tracking-tight mb-2 text-[#cccccc]">Voice AI Playground</h1>
                  <p className="text-sm">Open an architecture to start or explore the library</p>
                </div>
              )}
            </Panel>
            
            <PanelResizeHandle className="h-1 bg-[#1e1e1e] hover:bg-[#007acc] transition-colors" />
            
            <Panel defaultSize={30} minSize={10} className="bg-[#1e1e1e] border-t border-[#2b2b2b]">
              <div className="flex items-center h-9 px-4 border-b border-[#2b2b2b]">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#bbbbbb]">Output / Call Log</div>
              </div>
              <div className="p-4 text-[13px] font-mono text-[#858585] italic">
                Logs will appear here during simulation...
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  )
}
