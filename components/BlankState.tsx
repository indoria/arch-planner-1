'use client'

import React from 'react'
import { Box, Plus, FolderOpen, BookOpen } from 'lucide-react'
import { useTabStore } from '@/store/useTabStore'

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
      </div>

      <div className="mt-12 text-[11px] text-[#555555] font-mono uppercase tracking-[0.2em]">
        Visualizer Foundation v1.0
      </div>
    </div>
  )
}
