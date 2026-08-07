'use client'

import React, { useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Files, Library, Settings, Search, Box, Terminal, MessageSquare, Bug } from 'lucide-react'
import KnowledgeAccordion from './KnowledgeAccordion'
import BlankState from './BlankState'
import ComponentLibrary from './ComponentLibrary'
import Inspector from './Inspector'
import ComplaintsLog from './ComplaintsLog'
import { useTabStore } from '@/store/useTabStore'

type View = 'explorer' | 'library' | 'components'
type BottomTab = 'output' | 'complaints' | 'debug'

export default function Shell({ children }: { children?: React.ReactNode }) {
  const [activeView, setActiveView] = useState<View>('explorer')
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTab>('output')
  const complaintsCount = useTabStore((state) => state.complaints.length)

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
          onClick={() => setActiveView('components')}
          className={`p-2 mb-2 hover:text-white transition-colors ${activeView === 'components' ? 'text-white border-l-2 border-white' : 'text-[#858585]'}`}
          data-testid="icon-components"
          aria-label="Components"
        >
          <Box size={24} />
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
      <div className="flex-1 flex flex-col min-w-0">
        <PanelGroup direction="horizontal">
          {/* Left Sidebar */}
          <Panel defaultSize={15} minSize={10} maxSize={30} data-testid="sidebar" className="bg-[#252526] border-r border-[#2b2b2b]">
            <div className="p-3 uppercase text-[11px] font-bold tracking-wider text-[#bbbbbb] flex items-center justify-between">
              <span>
                {activeView === 'explorer' && 'Explorer'}
                {activeView === 'components' && 'Components'}
                {activeView === 'library' && 'Interactive Library'}
              </span>
            </div>
            <div className="overflow-y-auto h-full">
              {activeView === 'explorer' && (
                <div className="flex flex-col">
                  <div className="p-2 text-sm text-[#858585] border-b border-[#2b2b2b]">Architectures Explorer</div>
                  <KnowledgeAccordion title="Architecture Basics">
                    <p className="text-[12px] text-[#858585]">
                      Learn about sockets, connections, and component types.
                    </p>
                  </KnowledgeAccordion>
                  <KnowledgeAccordion title="Enterprise Knowledge">
                    <p className="text-[12px] text-[#858585]">
                      Best practices for voicebot architecture design.
                    </p>
                  </KnowledgeAccordion>
                </div>
              )}
              {activeView === 'components' && <ComponentLibrary />}
              {activeView === 'library' && (
                <div className="p-2 text-sm text-[#858585]">Library Concepts</div>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-[#1e1e1e] hover:bg-[#007acc] transition-colors" />

          {/* Editor & Bottom Panel Area */}
          <Panel defaultSize={65} minSize={40} className="flex flex-col h-full overflow-hidden" data-testid="editor-area">
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={20} className="flex flex-col overflow-hidden bg-[#1e1e1e]">
                {children || <BlankState />}
              </Panel>
              
              <PanelResizeHandle className="h-1 bg-[#1e1e1e] hover:bg-[#007acc] transition-colors" />
              
              <Panel defaultSize={30} minSize={10} className="bg-[#1e1e1e] border-t border-[#2b2b2b] flex flex-col overflow-hidden">
                <div className="flex items-center h-9 px-4 border-b border-[#2b2b2b] bg-[#252526] flex-shrink-0">
                  <div className="flex gap-4 h-full">
                    <button 
                      onClick={() => setActiveBottomTab('output')}
                      className={`text-[11px] uppercase tracking-wider font-bold h-full border-b-2 transition-colors ${activeBottomTab === 'output' ? 'text-white border-white' : 'text-[#858585] border-transparent hover:text-[#cccccc]'}`}
                    >
                      Output
                    </button>
                    <button 
                      onClick={() => setActiveBottomTab('complaints')}
                      className={`text-[11px] uppercase tracking-wider font-bold h-full border-b-2 transition-colors flex items-center gap-1.5 ${activeBottomTab === 'complaints' ? 'text-white border-white' : 'text-[#858585] border-transparent hover:text-[#cccccc]'}`}
                    >
                      Complaints
                      {complaintsCount > 0 && (
                        <span className="bg-[#444] text-white px-1.5 rounded-full text-[9px]">{complaintsCount}</span>
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveBottomTab('debug')}
                      className={`text-[11px] uppercase tracking-wider font-bold h-full border-b-2 transition-colors ${activeBottomTab === 'debug' ? 'text-white border-white' : 'text-[#858585] border-transparent hover:text-[#cccccc]'}`}
                    >
                      Debug Console
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  {activeBottomTab === 'output' && (
                    <div className="p-4 text-[13px] font-mono text-[#858585] italic">
                      Waiting for simulation...
                    </div>
                  )}
                  {activeBottomTab === 'complaints' && <ComplaintsLog />}
                  {activeBottomTab === 'debug' && (
                    <div className="p-4 text-[13px] font-mono text-[#858585] italic">
                      No debug sessions active.
                    </div>
                  )}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1 bg-[#1e1e1e] hover:bg-[#007acc] transition-colors" />

          {/* Right Sidebar (Inspector) */}
          <Panel defaultSize={20} minSize={15} maxSize={30} className="bg-[#252526] border-l border-[#2b2b2b]">
            <Inspector />
          </Panel>
        </PanelGroup>

        {/* Status Bar */}
        <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-[11px] justify-between z-50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Box size={12} />
              Main
            </span>
            <span>0 Errors</span>
            <span>0 Warnings</span>
          </div>
          <div className="flex items-center gap-3">
            <span>UTF-8</span>
            <span>TypeScript JSX</span>
            <span className="flex items-center gap-1">
              <Settings size={12} />
              Layout: IDE
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
