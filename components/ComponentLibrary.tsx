'use client'

import React, { useState } from 'react'
import { Search, Box, RefreshCw } from 'lucide-react'
import { AVAILABLE_COMPONENTS, ComponentDef } from '@/store/components'
import { useComponentStore } from '@/store/useComponentStore'

export default function ComponentLibrary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const repository = useComponentStore((state) => state.repository)
  const fetchFromRegistry = useComponentStore((state) => state.fetchFromRegistry)

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await fetchFromRegistry({ token: 'valid-token' })
    } catch (err) {
      console.error('Failed to sync with registry', err)
    } finally {
      setIsSyncing(false)
    }
  }

  const componentsToDisplay = repository && repository.length > 0 ? repository : AVAILABLE_COMPONENTS

  const filteredComponents = componentsToDisplay.filter((comp) =>
    comp.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full bg-[#252526] text-[#cccccc]">
      <div className="p-3 border-b border-[#2b2b2b]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#858585]">Component Library</span>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1 text-[11px] text-[#007acc] hover:text-[#3794ff] disabled:opacity-50 transition-colors"
            title="Sync with central registry"
            aria-label="Sync with registry"
          >
            <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Registry'}</span>
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 text-[#858585]" size={14} />
          <input
            type="text"
            placeholder="Search components"
            className="w-full bg-[#3c3c3c] border border-[#3c3c3c] text-[13px] pl-8 pr-2 py-1.5 rounded focus:outline-none focus:border-[#007acc]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredComponents.map((comp) => (
          <div
            key={comp.id}
            className="flex items-start gap-3 p-3 border-b border-[#2b2b2b] hover:bg-[#2a2d2e] cursor-grab active:cursor-grabbing group"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify(comp))
              e.dataTransfer.effectAllowed = 'move'

              // Create a very simple ghost element to ensure visibility
              const ghost = document.createElement('div')
              ghost.id = 'drag-ghost'
              ghost.style.width = '140px'
              ghost.style.height = '40px'
              ghost.style.backgroundColor = '#007acc'
              ghost.style.color = 'white'
              ghost.style.borderRadius = '4px'
              ghost.style.display = 'flex'
              ghost.style.alignItems = 'center'
              ghost.style.justifyContent = 'center'
              ghost.style.fontSize = '12px'
              ghost.style.fontWeight = 'bold'
              ghost.style.position = 'fixed'
              ghost.style.top = '-100px' // Keep it accessible but out of view
              ghost.style.left = '-100px'
              ghost.style.zIndex = '9999'
              ghost.textContent = comp.label
              
              document.body.appendChild(ghost)
              
              // Use a standard offset
              e.dataTransfer.setDragImage(ghost, 70, 20)
              
              // Clean up immediately after the drag starts (standard practice)
              setTimeout(() => {
                if (document.body.contains(ghost)) {
                  document.body.removeChild(ghost)
                }
              }, 0)
            }}
          >
            <div className="p-2 bg-[#333333] rounded text-[#007acc] group-hover:text-white transition-colors">
              <Box size={20} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-medium leading-tight">{comp.label}</span>
                {comp.id.startsWith('registry-') && (
                  <span className="text-[9px] bg-[#007acc]/20 text-[#007acc] border border-[#007acc]/40 px-1 rounded">Registry</span>
                )}
              </div>
              <span className="text-[11px] text-[#858585] truncate">{comp.type.toUpperCase()}</span>
              <p className="text-[12px] text-[#cccccc] mt-1 line-clamp-2">{comp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
