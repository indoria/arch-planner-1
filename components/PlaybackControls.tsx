'use client'

import React from 'react'
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react'
import { useSimulationStore } from '@/store/useSimulationStore'

export default function PlaybackControls() {
  const { 
    history, 
    currentSnapshotIndex, 
    jumpToSnapshot,
    clearHistory,
    resetTelemetry
  } = useSimulationStore()

  const totalSteps = history.length
  const isEnabled = totalSteps > 0

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    jumpToSnapshot(parseInt(e.target.value))
  }

  const handleReset = () => {
    clearHistory()
    resetTelemetry()
  }

  if (!isEnabled) return null

  return (
    <div className="flex items-center gap-4 bg-[#252526] border-t border-[#2b2b2b] px-4 py-2 h-10 select-none shadow-lg">
      <div className="flex items-center gap-1 border-r border-[#444] pr-4">
        <button 
          onClick={() => jumpToSnapshot(Math.max(0, currentSnapshotIndex - 1))}
          className="p-1 hover:text-white text-[#858585] transition-colors disabled:opacity-30"
          disabled={currentSnapshotIndex <= 0}
          title="Step Backward"
        >
          <SkipBack size={16} />
        </button>
        
        {/* We don't have a 'play' state in the store yet, so for now it's just a placeholder or manual control */}
        <button className="p-1 hover:text-white text-[#858585] transition-colors">
          <Play size={16} />
        </button>

        <button 
          onClick={() => jumpToSnapshot(Math.min(totalSteps - 1, currentSnapshotIndex + 1))}
          className="p-1 hover:text-white text-[#858585] transition-colors disabled:opacity-30"
          disabled={currentSnapshotIndex >= totalSteps - 1}
          title="Step Forward"
        >
          <SkipForward size={16} />
        </button>
      </div>

      <div className="flex-1 flex items-center gap-3 min-w-0">
        <span className="text-[11px] text-[#858585] w-12 text-right tabular-nums">
          {currentSnapshotIndex + 1} / {totalSteps}
        </span>
        <input 
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentSnapshotIndex}
          onChange={handleScrub}
          className="flex-1 h-1 bg-[#444] rounded-lg appearance-none cursor-pointer accent-[#007acc] hover:accent-[#0098ff] transition-all"
        />
      </div>

      <button 
        onClick={handleReset}
        className="flex items-center gap-1.5 text-[11px] hover:text-white text-[#858585] transition-colors border-l border-[#444] pl-4"
        title="Clear Simulation History"
      >
        <RotateCcw size={14} />
        Reset
      </button>
    </div>
  )
}
