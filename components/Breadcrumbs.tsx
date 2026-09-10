'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTabStore } from '@/store/useTabStore'
import { useComponentStore } from '@/store/useComponentStore'
import { ChevronRight, Home, Download, FileJson, FileCode, ImageIcon } from 'lucide-react'
import { ExportService, ExportFormat } from '@/utils/exportService'
import { exportToJson, exportToYaml, exportToSvg } from '@/utils/exportUtils'

export default function Breadcrumbs() {
  const drillDownStack = useTabStore((state) => state.drillDownStack)
  const goUp = useTabStore((state) => state.goUp)
  const resetView = useTabStore((state) => state.resetView)
  const activeTabId = useTabStore((state) => state.activeTabId)
  const openTabs = useTabStore((state) => state.openTabs)
  const activeArchitecture = useTabStore((state) => state.activeArchitecture)
  const components = useComponentStore((state) => state.components)
  
  const [showExportMenu, setShowExportMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const activeTab = openTabs.find(t => t.id === activeTabId)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!activeTab || !activeArchitecture) return null

  const handleExport = (format: ExportFormat) => {
    try {
      let options: any = {
        format,
        filename: activeTab.title.toLowerCase().replace(/\s+/g, '-'),
      }

      if (format === 'svg') {
        const container = document.querySelector('[data-testid="architecture-canvas"]') as HTMLElement
        if (!container) throw new Error('Could not find architecture canvas')
        options.svgContainer = container
      } else {
        options.components = components
      }

      const result = ExportService.export(activeArchitecture, options)
      
      if (format === 'json') {
        exportToJson(JSON.parse(result.data), result.filename)
      } else if (format === 'yaml') {
        exportToYaml(result.data, result.filename)
      } else if (format === 'svg') {
        // For SVG, we need a blob-based download too, which exportToSvg does
        // but it takes an element. Our service returns the string.
        const blob = new Blob([result.data], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setShowExportMenu(false)
    }
  }
  
  return (
    <div className="flex items-center gap-1 p-2 text-[11px] text-[#858585] bg-[#252526] border-b border-[#2b2b2b] select-none relative">
      <button 
        onClick={resetView}
        className={`flex items-center gap-1 hover:text-white transition-colors ${drillDownStack.length === 0 ? 'text-white font-bold' : ''}`}
      >
        <Home size={12} />
        {activeTab.title}
      </button>

      {drillDownStack.map((step, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} className="text-[#444]" />
          <button
            onClick={() => {
                // To go to a specific index in the stack, we could call goUp multiple times 
                // but let's just implement a simple logic here or add an action.
                // For now, only the current view is highlighted.
            }}
            className={`hover:text-white transition-colors ${index === drillDownStack.length - 1 ? 'text-[#007acc] font-bold' : ''}`}
          >
            {step.label}
          </button>
        </React.Fragment>
      ))}
      
      <div className="ml-auto flex items-center gap-2">
        {drillDownStack.length > 0 && (
            <button 
              onClick={goUp}
              className="text-[#858585] hover:text-white flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#333]"
            >
                Back to Parent
            </button>
        )}
        
        <div className="h-4 w-px bg-[#444] mx-1" />
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 px-2 py-0.5 bg-[#333] hover:bg-[#444] text-[#ccc] hover:text-white rounded border border-[#444] transition-all"
            title="Export Architecture"
          >
            <Download size={12} />
            Export
          </button>
          
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-[#252526] border border-[#444] rounded shadow-2xl z-[100] overflow-hidden">
              <button 
                onClick={() => handleExport('json')}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#37373d] text-[#ccc] hover:text-white transition-colors"
              >
                <FileJson size={14} className="text-orange-400" />
                <span>Export as JSON</span>
              </button>
              <button 
                onClick={() => handleExport('yaml')}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#37373d] text-[#ccc] hover:text-white transition-colors"
              >
                <FileCode size={14} className="text-blue-400" />
                <span>Export as YAML</span>
              </button>
              <div className="h-px bg-[#444]" />
              <button 
                onClick={() => handleExport('svg')}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#37373d] text-[#ccc] hover:text-white transition-colors"
              >
                <ImageIcon size={14} className="text-purple-400" />
                <span>High-Res SVG Export</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
