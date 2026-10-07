'use client'

import React from 'react'
import { Box, Plus, FolderOpen, BookOpen, Zap, DollarSign } from 'lucide-react'
import { useTabStore } from '@/store/useTabStore'
import { BASELINE_ARCHITECTURES } from '@/data/baselineArchitectures'

export default function BlankState() {
  const openTab = useTabStore((state) => state.openTab)

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

  const handleOpenBaseline = (archId: string) => {
    const meta = BASELINE_ARCHITECTURES.find(b => b.id === archId)
    if (meta) {
      openTab({
        id: meta.id,
        title: meta.title,
        content: meta.content
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] text-[#cccccc] p-8 select-none" data-testid="blank-state">
      <div className="flex flex-col items-center max-w-md w-full">
        <Box size={80} className="mb-6 text-[#333333]" />
        
        <h1 className="text-3xl font-light tracking-tight mb-2">Architecture Planner</h1>
        <p className="text-[#858585] text-center mb-8">
          Design, simulate, and analyze your voicebot architectures in a modular, interactive playground.
        </p>

        <div className="grid grid-cols-1 gap-3 w-full">
          <button 
            onClick={handleNewArchitecture}
            className="flex items-center gap-3 px-4 py-3 bg-[#2d2d2d] hover:bg-[#37373d] transition-colors rounded-md border border-[#3c3c3c] text-sm group"
          >
            <Plus size={18} className="text-[#007acc]" />
            <div className="flex flex-col items-start">
              <span className="font-medium">New Architecture</span>
              <span className="text-[11px] text-[#858585]">Create a blank canvas to start designing</span>
            </div>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 bg-[#2d2d2d] hover:bg-[#37373d] transition-colors rounded-md border border-[#3c3c3c] text-sm group">
            <FolderOpen size={18} className="text-[#007acc]" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Open Architecture</span>
              <span className="text-[11px] text-[#858585]">Load a design from your local explorer</span>
            </div>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 bg-[#2d2d2d] hover:bg-[#37373d] transition-colors rounded-md border border-[#3c3c3c] text-sm group">
            <BookOpen size={18} className="text-[#007acc]" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Browse Library</span>
              <span className="text-[11px] text-[#858585]">Explore example architectures and best practices</span>
            </div>
          </button>
        </div>

        <div className="w-full mt-6 pt-5 border-t border-[#2b2b2b]">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#858585] mb-2.5">
            Or Load a Baseline Architecture:
          </div>
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              onClick={() => handleOpenBaseline('baseline-cheapest-650ms')}
              data-testid="load-baseline-cheapest"
              className="flex flex-col items-start p-2.5 rounded bg-[#252526] hover:bg-[#2e2e30] border border-[#383838] hover:border-[#007acc] transition-colors text-left"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#e1e1e1]">
                <DollarSign size={13} className="text-[#89d185]" />
                <span>Cheapest 650ms</span>
              </div>
              <div className="text-[10px] text-[#858585] mt-1 line-clamp-1">Budget cost optimization</div>
              <div className="flex items-center justify-between w-full mt-2 text-[9px] font-mono text-[#a0a0a0]">
                <span>650ms E2E</span>
                <span className="text-[#89d185]">$0.007/min</span>
              </div>
            </button>

            <button
              onClick={() => handleOpenBaseline('baseline-ultra-low-latency-200ms')}
              data-testid="load-baseline-ultralow"
              className="flex flex-col items-start p-2.5 rounded bg-[#252526] hover:bg-[#2e2e30] border border-[#383838] hover:border-[#007acc] transition-colors text-left"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#e1e1e1]">
                <Zap size={13} className="text-[#4ec9b0]" />
                <span>Ultra-Low 200ms</span>
              </div>
              <div className="text-[10px] text-[#858585] mt-1 line-clamp-1">Max speed & streaming</div>
              <div className="flex items-center justify-between w-full mt-2 text-[9px] font-mono text-[#a0a0a0]">
                <span>200ms E2E</span>
                <span className="text-[#4ec9b0]">$0.036/min</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 text-[11px] text-[#555555] font-mono uppercase tracking-[0.2em]">
        Visualizer Foundation v1.0
      </div>
    </div>
  )
}
