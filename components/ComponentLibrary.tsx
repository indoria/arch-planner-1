'use client'

import React, { useState } from 'react'
import { Search, Box } from 'lucide-react'
import { AVAILABLE_COMPONENTS, ComponentDef } from '@/store/components'

export default function ComponentLibrary() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredComponents = AVAILABLE_COMPONENTS.filter((comp) =>
    comp.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full bg-[#252526] text-[#cccccc]">
      <div className="p-3">
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

              // Create a ghost element that looks like a simplified node
              const ghost = document.createElement('div')
              ghost.style.width = '160px'
              ghost.style.backgroundColor = '#252526'
              ghost.style.border = '2px solid #007acc'
              ghost.style.borderRadius = '4px'
              ghost.style.padding = '12px'
              ghost.style.color = '#cccccc'
              ghost.style.fontSize = '12px'
              ghost.style.fontWeight = '500'
              ghost.style.fontFamily = 'ui-sans-serif, system-ui, sans-serif'
              ghost.style.position = 'fixed'
              ghost.style.top = '0'
              ghost.style.left = '0'
              ghost.style.transform = 'translate(-100%, -100%)' // Move off-screen but keep in layout
              ghost.style.zIndex = '9999'
              ghost.style.pointerEvents = 'none'
              ghost.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.5)'
              
              // Header-like area
              const header = document.createElement('div')
              header.style.fontWeight = 'bold'
              header.style.marginBottom = '6px'
              header.style.borderBottom = '1px solid #454545'
              header.style.paddingBottom = '6px'
              header.textContent = comp.label
              ghost.appendChild(header)

              // Type label
              const typeLabel = document.createElement('div')
              typeLabel.style.fontSize = '10px'
              typeLabel.style.color = '#858585'
              typeLabel.style.textTransform = 'uppercase'
              typeLabel.textContent = comp.type
              ghost.appendChild(typeLabel)

              document.body.appendChild(ghost)
              
              // Set the drag image. The offset (80, 20) centers it.
              e.dataTransfer.setDragImage(ghost, 80, 20)
              
              // Use a slightly longer timeout or requestAnimationFrame to ensure browser capture
              requestAnimationFrame(() => {
                setTimeout(() => {
                  if (document.body.contains(ghost)) {
                    document.body.removeChild(ghost)
                  }
                }, 0)
              })
            }}
          >
            <div className="p-2 bg-[#333333] rounded text-[#007acc] group-hover:text-white transition-colors">
              <Box size={20} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-medium leading-tight">{comp.label}</span>
              <span className="text-[11px] text-[#858585] truncate">{comp.type.toUpperCase()}</span>
              <p className="text-[12px] text-[#cccccc] mt-1 line-clamp-2">{comp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
