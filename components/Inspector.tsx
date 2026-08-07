'use client'

import React, { useMemo } from 'react'
import { useTabStore } from '@/store/useTabStore'
import { AVAILABLE_COMPONENTS, ComponentDef } from '@/store/components'

export default function Inspector() {
  const activeTabId = useTabStore((state) => state.activeTabId)
  const openTabs = useTabStore((state) => state.openTabs)
  const selectedNodeId = useTabStore((state) => state.selectedNodeId)
  const replaceComponent = useTabStore((state) => state.replaceComponent)

  const activeTab = useMemo(() => 
    openTabs.find((t) => t.id === activeTabId),
    [openTabs, activeTabId]
  )

  const selectedNode = useMemo(() => {
    if (!activeTab || !selectedNodeId) return null
    return activeTab.content.nodes.find((n) => n.id === selectedNodeId) || null
  }, [activeTab, selectedNodeId])

  const componentDef = useMemo(() => {
    if (!selectedNode) return null
    return AVAILABLE_COMPONENTS.find((c) => c.type === selectedNode.type) || null
  }, [selectedNode])

  const alternatives = useMemo(() => {
    if (!selectedNode) return []
    // Show components of the same type or all other components as potential swaps
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

  if (!selectedNode) {
    return (
      <div className="w-64 border-l border-[#333] bg-[#1e1e1e] text-[#ccc] p-4 flex flex-col gap-4 overflow-y-auto" data-testid="inspector">
        <div className="text-sm font-semibold text-[#888] uppercase tracking-wider">Inspector</div>
        <div className="text-sm italic text-[#555]">Select a node to view details</div>
      </div>
    )
  }

  return (
    <div className="w-64 border-l border-[#333] bg-[#1e1e1e] text-[#ccc] p-4 flex flex-col gap-4 overflow-y-auto" data-testid="inspector">
      <div className="text-sm font-semibold text-[#888] uppercase tracking-wider">Inspector</div>
      
      <div className="flex flex-col gap-2">
        <div className="text-lg font-bold text-white">{selectedNode.label}</div>
        <div className="text-xs text-[#888] font-mono uppercase">{selectedNode.type}</div>
      </div>

      {componentDef && (
        <div className="flex flex-col gap-4 mt-2">
          <div className="text-sm text-[#bbb] leading-relaxed">
            {componentDef.description}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#333]">
            <div className="flex flex-col gap-1">
              <div className="text-[10px] uppercase text-[#666] font-bold">Cost</div>
              <div className="text-sm text-green-400 font-medium">{componentDef.cost}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] uppercase text-[#666] font-bold">Latency</div>
              <div className="text-sm text-blue-400 font-medium">{componentDef.latency}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#333]">
        <div className="text-[10px] uppercase text-[#666] font-bold">Sockets</div>
        <div className="flex flex-wrap gap-1">
          {selectedNode.sockets.map((socket) => (
            <div 
              key={socket.id} 
              className={`text-[9px] px-1.5 py-0.5 rounded border ${
                socket.direction === 'input' 
                  ? 'bg-blue-900/20 border-blue-700/50 text-blue-300' 
                  : 'bg-orange-900/20 border-orange-700/50 text-orange-300'
              }`}
            >
              {socket.label || socket.id}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#333]">
        <div className="text-[10px] uppercase text-[#666] font-bold">Alternatives (Click to Swap)</div>
        <div className="flex flex-col gap-1">
          {alternatives.map((alt) => (
            <button
              key={alt.id}
              onClick={() => handleReplace(alt)}
              className="text-left p-2 rounded hover:bg-[#333] transition-colors group border border-transparent hover:border-[#444]"
            >
              <div className="text-xs font-bold text-[#aaa] group-hover:text-white">{alt.label}</div>
              <div className="text-[10px] text-[#666]">{alt.type} • {alt.latency}</div>
            </button>
          ))}
          {alternatives.length === 0 && (
            <div className="text-[10px] italic text-[#555]">No alternatives available</div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#333]">
        <div className="text-[10px] uppercase text-[#666] font-bold">Script Editor</div>
        <div className="bg-[#1a1a1a] rounded p-2 font-mono text-[11px] text-[#888] min-h-[100px] border border-[#333]">
          // Custom logic for {selectedNode.label}
          <br />
          function onProcess(data) {'{'}
          <br />
          &nbsp;&nbsp;return data;
          <br />
          {'}'}
        </div>
      </div>
    </div>
  )
}
