'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, ChevronRight, ChevronLeft, X, Check } from 'lucide-react'

export interface TourStep {
  targetId: string
  title: string
  description: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'activity-bar',
    title: 'Activity Bar',
    description: 'Switch between the Explorer, Component Library, and Enterprise Knowledge Library, or trigger live pipeline simulations with the Play button.',
    placement: 'right'
  },
  {
    targetId: 'sidebar',
    title: 'Explorer & Knowledge Base',
    description: 'Browse architectures, load pre-configured 650ms and 200ms baselines, or expand the Enterprise Knowledge Base for progressive disclosure of voicebot concepts.',
    placement: 'right'
  },
  {
    targetId: 'editor-area',
    title: 'Tabs & Architecture Canvas',
    description: 'Open multiple architectures in VS Code-style tabs. View interactive SVG data-flow nodes, inspect connections, and simulate audio-to-text-to-speech pipelines.',
    placement: 'bottom'
  },
  {
    targetId: 'inspector-panel',
    title: 'Component Inspector & Click-to-Replace',
    description: 'Click any node in the canvas to inspect its latency, cost, and parameters. Click alternatives to instantly hot-swap components in your architecture.',
    placement: 'left'
  }
]

interface TourGuideProps {
  isOpen: boolean
  onClose: () => void
}

export default function TourGuide({ isOpen, onClose }: TourGuideProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0)
    }
  }, [isOpen])

  if (!isOpen) return null

  const step = TOUR_STEPS[currentStepIndex]
  const isFirst = currentStepIndex === 0
  const isLast = currentStepIndex === TOUR_STEPS.length - 1

  const handleNext = () => {
    if (isLast) {
      handleComplete()
    } else {
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    try {
      localStorage.setItem('voicebot_tour_completed', 'true')
    } catch {
      // Ignore localStorage errors
    }
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
      data-testid="tour-guide-overlay"
    >
      <div 
        className="w-[380px] bg-[#252526] border border-[#007acc] rounded-lg shadow-2xl p-4 text-[#cccccc] font-sans animate-in fade-in zoom-in-95 duration-150 select-none"
        data-testid="tour-guide-dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#333333]">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#007acc]" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#007acc]">
              VS Code Shell Tour
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#858585]">
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
            <button
              onClick={handleComplete}
              className="text-[#858585] hover:text-white p-1 rounded hover:bg-[#333] transition-colors"
              aria-label="Close tour"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="py-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">
            {step.title}
          </h3>
          <p className="text-xs text-[#a0a0a0] leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 py-1 mb-2">
          {TOUR_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIndex 
                  ? 'w-5 bg-[#007acc]' 
                  : 'w-1.5 bg-[#444444]'
              }`}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#333333]">
          <button
            onClick={handleComplete}
            className="text-xs text-[#858585] hover:text-[#cccccc] px-2 py-1 rounded hover:bg-[#2d2d2d] transition-colors"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#333333] hover:bg-[#3e3e42] text-[#cccccc] hover:text-white transition-colors"
              >
                <ChevronLeft size={14} />
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-xs px-3 py-1 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-medium transition-colors"
            >
              {isLast ? (
                <>
                  <Check size={14} />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
