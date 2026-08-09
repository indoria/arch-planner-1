import React from 'react'
import { Architecture } from '@/store/architecture'
import { getBreadcrumbPath } from '@/store/breadcrumb'

interface BreadcrumbsProps {
  rootArch: Architecture
  activeArch: Architecture
  onNavigate: (arch: Architecture) => void
}

export default function Breadcrumbs({ rootArch, activeArch, onNavigate }: BreadcrumbsProps) {
  const pathLabels = getBreadcrumbPath(rootArch, activeArch)
  
  if (!pathLabels) return null
  
  return (
    <div className="flex gap-2 p-2 text-xs text-[#858585] bg-[#252526] border-b border-[#2b2b2b]">
      {pathLabels.map((label, index) => (
        <span key={index}>{label} &gt; </span>
      ))}
      <span className="text-[#cccccc]">Current View</span>
    </div>
  )
}
