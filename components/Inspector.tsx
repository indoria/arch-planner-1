'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { useTabStore } from '@/store/useTabStore'
import { AVAILABLE_COMPONENTS, ComponentDef } from '@/store/components'
import { ChevronRight, PlusSquare, Edit2, Check, X, Info, Settings, Zap } from 'lucide-react'

export default function Inspector() {
  const activeTabId = useTabStore((state) => state.activeTabId)
  const selectedNodeId = useTabStore((state) => state.selectedNodeId)
  const replaceComponent = useTabStore((state) => state.replaceComponent)
  const createSubArchitecture = useTabStore((state) => state.createSubArchitecture)
  const drillDown = useTabStore((state) => state.drillDown)
  const activeArchitecture = useTabStore((state) => state.activeArchitecture)

  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [editedLabel, setEditedLabel] = useState('')

  const selectedNode = useMemo(() => {
    if (!activeArchitecture || !selectedNodeId) return null
    return activeArchitecture.nodes.find((n) => n.id === selectedNodeId) || null
  }, [activeArchitecture, selectedNodeId])

  useEffect(() => {
    if (selectedNode) {
      setEditedLabel(selectedNode.label)
      setIsEditingLabel(false)
    }
  }, [selectedNode?.id, selectedNode?.label])

  const componentDef = useMemo(() => {
    if (!selectedNode) return null
    return AVAILABLE_COMPONENTS.find((c) => c.type === selectedNode.type) || null
  }, [selectedNode])

  const alternatives = useMemo(() => {
    if (!selectedNode) return []
    return AVAILABLE_COMPONENTS.filter((c) => c.type !== selectedNode.type)
  }, [selectedNode])

  const handleReplace = (newComp: ComponentDef) => {
    if (!activeTabId || !selectedNodeId) return
    replaceComponent(activeTabId, selectedNodeId, {
      type: newComp.type,
      label: newComp.label,
      sockets: newComp.sockets,
      data: { label: newComp.label, sockets: newComp.sockets }
    })
  }

  const handleUpdateLabel = () => {
    if (!activeTabId || !selectedNodeId || !editedLabel.trim()) return
    replaceComponent(activeTabId, selectedNodeId, {
      label: editedLabel.trim()
    })
    setIsEditingLabel(false)
  }

  const handleCreateSubArch = () => {
      if (!activeTabId || !selectedNodeId) return
      createSubArchitecture(activeTabId, selectedNodeId)
  }

  const handleDrillDown = () => {
      if (!selectedNode) return
      drillDown(selectedNode)
  }

  if (!selectedNode) {
    return (
      <div className="w-64 border-l border-[#333] bg-[#1e1e1e] text-[#ccc] p-4 flex flex-col gap-4 overflow-y-auto" data-testid="inspector">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#888] uppercase tracking-wider">
          <Info size={14} />
          Inspector
        </div>
        <div className="text-sm italic text-[#555] mt-4 text-center">Select a node on the canvas to view and edit its properties.</div>
      </div>
    )
  }

  return (
    <div className="w-64 border-l border-[#333] bg-[#1e1e1e] text-[#ccc] p-0 flex flex-col h-full overflow-hidden" data-testid="inspector">
      {/* Header */}
      <div className="p-4 border-b border-[#333] bg-[#252526]">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#888] uppercase tracking-wider mb-3">
          <Settings size={12} />
          Node Inspector
        </div>
        
        {isEditingLabel ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              className="bg-[#3c3c3c] border border-[#007acc] text-white text-sm p-1.5 rounded focus:outline-none"
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateLabel()
                if (e.key === 'Escape') setIsEditingLabel(false)
              }}
            />
            <div className="flex gap-1 justify-end">
              <button onClick={() => setIsEditingLabel(false)} className="p-1 hover:bg-[#444] rounded text-[#888]"><X size={14} /></button>
              <button onClick={handleUpdateLabel} className="p-1 hover:bg-[#007acc] rounded text-white"><Check size={14} /></button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between group">
            <div className="flex flex-col">
              <div className="text-lg font-bold text-white leading-tight">{selectedNode.label}</div>
              <div className="text-[10px] text-[#007acc] font-mono mt-1 uppercase tracking-tight">{selectedNode.type}</div>
            </div>
            <button 
              onClick={() => setIsEditingLabel(true)}
              className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-[#333] rounded transition-all text-[#888] hover:text-white"
            >
              <Edit2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* Actions */}
        <section className="flex flex-col gap-2">
          <div className="text-[10px] uppercase text-[#666] font-bold tracking-widest mb-1">Actions</div>
          {selectedNode.subArchitecture ? (
              <button
                  onClick={handleDrillDown}
                  className="flex items-center justify-center gap-2 w-full p-2.5 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-bold rounded shadow-lg transition-all"
              >
                  <ChevronRight size={14} />
                  Drill Down into Sub-Graph
              </button>
          ) : (
              <button
                  onClick={handleCreateSubArch}
                  className="flex items-center justify-center gap-2 w-full p-2.5 bg-[#333] hover:bg-[#444] text-[#ccc] hover:text-white text-xs font-bold rounded border border-[#444] transition-all"
              >
                  <PlusSquare size={14} />
                  Create Sub-Graph
              </button>
          )}
        </section>

        {/* Component Details */}
        {componentDef && (
          <section className="flex flex-col gap-3">
            <div className="text-[10px] uppercase text-[#666] font-bold tracking-widest">Component Info</div>
            <div className="text-xs text-[#aaa] leading-relaxed bg-[#252526] p-2 rounded border border-[#333]">
              {componentDef.description}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#252526] p-2 rounded border border-[#333] flex flex-col gap-1">
                <div className="text-[9px] uppercase text-[#555] font-bold">Cost</div>
                <div className="text-xs text-green-400 font-semibold">{componentDef.cost}</div>
              </div>
              <div className="bg-[#252526] p-2 rounded border border-[#333] flex flex-col gap-1">
                <div className="text-[9px] uppercase text-[#555] font-bold">Latency</div>
                <div className="text-xs text-blue-400 font-semibold">{componentDef.latency}</div>
              </div>
            </div>
          </section>
        )}

        {/* Sockets */}
        <section className="flex flex-col gap-2">
          <div className="text-[10px] uppercase text-[#666] font-bold tracking-widest">Interface</div>
          <div className="flex flex-wrap gap-1.5">
            {selectedNode.sockets?.map((socket) => (
              <div 
                key={socket.id} 
                className={`text-[9px] px-2 py-0.5 rounded border flex items-center gap-1 ${
                  socket.direction === 'input' 
                    ? 'bg-blue-900/10 border-blue-800/30 text-blue-400' 
                    : 'bg-orange-900/10 border-orange-800/30 text-orange-400'
                }`}
              >
                <div className={`w-1 h-1 rounded-full ${socket.direction === 'input' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                {socket.label || socket.id}
              </div>
            ))}
          </div>
        </section>

        {/* Alternatives */}
        <section className="flex flex-col gap-2">
          <div className="text-[10px] uppercase text-[#666] font-bold tracking-widest flex items-center gap-1">
            <Zap size={10} />
            Quick Swap
          </div>
          <div className="flex flex-col gap-1.5">
            {alternatives.map((alt) => (
              <button
                key={alt.id}
                onClick={() => handleReplace(alt)}
                className="text-left p-2 rounded bg-[#252526] hover:bg-[#333] transition-all group border border-[#333] hover:border-[#444]"
              >
                <div className="text-xs font-bold text-[#999] group-hover:text-white flex justify-between">
                  {alt.label}
                  <span className="text-[9px] text-[#555] font-normal">{alt.latency}</span>
                </div>
                <div className="text-[9px] text-[#555] mt-0.5">{alt.type.toUpperCase()}</div>
              </button>
            ))}
            {alternatives.length === 0 && (
              <div className="text-[10px] italic text-[#555] bg-[#252526] p-2 rounded border border-[#333] border-dashed text-center">No alternatives found</div>
            )}
          </div>
        </section>

        {/* Node Meta */}
        <section className="flex flex-col gap-2 mt-2 pt-4 border-t border-[#333]">
          <div className="text-[10px] uppercase text-[#666] font-bold tracking-widest">Node ID</div>
          <div className="text-[10px] font-mono text-[#555] bg-[#1a1a1a] p-2 rounded truncate select-all" title={selectedNode.id}>
            {selectedNode.id}
          </div>
        </section>
      </div>
    </div>
  )
}
