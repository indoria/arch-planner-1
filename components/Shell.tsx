'use client'

import React, { useState, useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Files, Library, Settings, Search, Box, Terminal, MessageSquare, Bug, Play, BarChart3, Plus, HelpCircle } from 'lucide-react'
import KnowledgeAccordion from './KnowledgeAccordion'
import EnterpriseKnowledgeBase from './EnterpriseKnowledgeBase'
import BlankState from './BlankState'
import { BASELINE_ARCHITECTURES } from '@/data/baselineArchitectures'
import ComponentLibrary from './ComponentLibrary'
import Inspector from './Inspector'
import TourGuide from './TourGuide'
import ComplaintsLog from './ComplaintsLog'
import CallLogPane from './CallLogPane'
import MetricsDashboard from './MetricsDashboard'
import PlaybackControls from './PlaybackControls'
import { useTabStore } from '@/store/useTabStore'
import Breadcrumbs from './Breadcrumbs'
import { runSimulation } from '@/store/simulationActions'

type View = 'explorer' | 'library' | 'components'
type BottomTab = 'output' | 'complaints' | 'debug' | 'metrics'

export default function Shell({ children }: { children?: React.ReactNode }) {
  const [activeView, setActiveView] = useState<View>('explorer')
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTab>('output')
  const complaintsCount = useTabStore((state) => state.complaints.length)
  const activeTab = useTabStore((state) => state.openTabs.find(t => t.id === state.activeTabId))
  const openTab = useTabStore((state) => state.openTab)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)

  useEffect(() => {
    try {
      const completed = localStorage.getItem('voicebot_tour_completed')
      if (!completed) {
        setIsTourOpen(true)
      }
    } catch {
      // Ignore localStorage issues
    }
  }, [])

  const handleRunSimulation = async () => {
    setIsSimulating(true)
    setActiveBottomTab('output')
    await runSimulation()
    setIsSimulating(false)
  }

  const handleNewArchitecture = () => {
    openTab({
      id: `new-${Date.now()}`,
      title: 'Untitled Architecture',
      content: {
        nodes: [],
        connections: []
      }
    })
  }

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
        
        <div className="h-px w-6 bg-[#444] my-2" />
        
        <button
          onClick={handleRunSimulation}
          disabled={!activeTab || isSimulating}
          className={`p-2 mb-2 transition-colors rounded-full ${isSimulating ? 'text-orange-500 animate-pulse' : 'text-green-500 hover:text-green-400 hover:bg-[#444]'} disabled:text-[#444] disabled:cursor-not-allowed`}
          data-testid="icon-play"
          aria-label="Run Simulation"
          title="Run Simulation"
        >
          <Play size={24} fill={isSimulating ? "currentColor" : "none"} />
        </button>

        <div className="mt-auto flex flex-col items-center gap-1">
          <button 
            onClick={() => setIsTourOpen(true)}
            className="p-2 text-[#858585] hover:text-white transition-colors"
            title="Start Guided Tour"
            data-testid="activity-bar-tour-btn"
          >
            <HelpCircle size={22} />
          </button>
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
              {activeView === 'explorer' && (
                <button 
                  onClick={handleNewArchitecture}
                  className="p-1 hover:bg-[#333] rounded transition-colors text-[#858585] hover:text-white"
                  title="New Architecture"
                >
                  <Plus size={14} />
                </button>
              )}
            </div>
            <div className="overflow-y-auto h-full">
              {activeView === 'explorer' && (
                <div className="flex flex-col">
                  <div className="p-2 text-sm text-[#858585] border-b border-[#2b2b2b]">Architectures Explorer</div>
                  
                  <KnowledgeAccordion title="Sample Architectures">
                    <div className="flex flex-col gap-1.5 p-1">
                      {BASELINE_ARCHITECTURES.map((arch) => (
                        <button
                          key={arch.id}
                          onClick={() => openTab({ id: arch.id, title: arch.title, content: arch.content })}
                          className="flex flex-col items-start p-2 rounded bg-[#252526] hover:bg-[#2d2d2d] border border-[#333] transition-colors text-left group w-full"
                          data-testid={`load-baseline-${arch.id}`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium text-[11px] text-[#e1e1e1] group-hover:text-white">{arch.title}</span>
                            <span className="text-[10px] text-[#007acc] font-mono">{arch.targetLatency}ms</span>
                          </div>
                          <p className="text-[10px] text-[#858585] mt-0.5 line-clamp-2">{arch.description}</p>
                          <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono text-[#a0a0a0]">
                            <span className="text-[#89d185]">{arch.estimatedCost}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </KnowledgeAccordion>

                  <KnowledgeAccordion title="Architecture Basics">
                    <p className="text-[12px] text-[#858585]">
                      Learn about sockets, connections, and component types.
                    </p>
                  </KnowledgeAccordion>
                  <KnowledgeAccordion title="Enterprise Knowledge">
                    <div className="pt-1">
                      <EnterpriseKnowledgeBase />
                    </div>
                  </KnowledgeAccordion>
                </div>
              )}
              {activeView === 'components' && <ComponentLibrary />}
              {activeView === 'library' && (
                <div className="flex flex-col h-full">
                  <div className="p-2 text-sm text-[#858585] border-b border-[#2b2b2b]">Enterprise Concepts Library</div>
                  <EnterpriseKnowledgeBase />
                </div>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-[#1e1e1e] hover:bg-[#007acc] transition-colors" />

          {/* Editor & Bottom Panel Area */}
          <Panel defaultSize={65} minSize={40} className="flex flex-col h-full overflow-hidden" data-testid="editor-area">
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={20} className="flex flex-col overflow-hidden bg-[#1e1e1e]">
                {activeTab && <Breadcrumbs />}
                <div className="flex-1 relative min-h-0">
                  {children || <BlankState />}
                </div>
                <PlaybackControls />
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
                      onClick={() => setActiveBottomTab('metrics')}
                      className={`text-[11px] uppercase tracking-wider font-bold h-full border-b-2 transition-colors flex items-center gap-1.5 ${activeBottomTab === 'metrics' ? 'text-white border-white' : 'text-[#858585] border-transparent hover:text-[#cccccc]'}`}
                    >
                      Metrics
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
                  {activeBottomTab === 'output' && <CallLogPane />}
                  {activeBottomTab === 'metrics' && <MetricsDashboard />}
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
          <Panel defaultSize={20} minSize={15} maxSize={30} data-testid="inspector-panel" className="bg-[#252526] border-l border-[#2b2b2b]">
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
            <button
              onClick={() => setIsTourOpen(true)}
              className="flex items-center gap-1 hover:underline text-white font-medium cursor-pointer"
              title="Start IDE Guided Tour"
              data-testid="status-bar-tour-btn"
            >
              <HelpCircle size={12} />
              Take Tour
            </button>
            <span>UTF-8</span>
            <span>TypeScript JSX</span>
            <span className="flex items-center gap-1">
              <Settings size={12} />
              Layout: IDE
            </span>
          </div>
        </div>

        {/* Interactive Guided Tour */}
        <TourGuide isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
      </div>
    </div>
  )
}
