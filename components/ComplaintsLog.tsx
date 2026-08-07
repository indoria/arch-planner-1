'use client'

import React from 'react'
import { useTabStore, Complaint } from '@/store/useTabStore'
import { AlertCircle, AlertTriangle, Info, Trash2 } from 'lucide-react'

export default function ComplaintsLog() {
  const complaints = useTabStore((state) => state.complaints)
  const clearComplaints = useTabStore((state) => state.clearComplaints)

  if (complaints.length === 0) {
    return (
      <div className="p-4 text-[13px] font-mono text-[#858585] italic">
        No architectural violations detected.
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" data-testid="complaints-log">
      <div className="flex justify-end p-2 border-b border-[#2b2b2b]">
        <button 
          onClick={clearComplaints}
          className="p-1 hover:bg-[#333] rounded text-[#858585] hover:text-white transition-colors"
          title="Clear all complaints"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        {complaints.map((complaint) => (
          <div 
            key={complaint.id} 
            className={`flex gap-3 p-2 border-b border-[#2b2b2b] text-[12px] font-mono ${
              complaint.type === 'error' ? 'text-red-400 bg-red-900/5' : 
              complaint.type === 'warning' ? 'text-orange-400 bg-orange-900/5' : 
              'text-blue-400'
            }`}
          >
            <div className="mt-0.5">
              {complaint.type === 'error' && <AlertCircle size={14} />}
              {complaint.type === 'warning' && <AlertTriangle size={14} />}
              {complaint.type === 'info' && <Info size={14} />}
            </div>
            <div className="flex-1">
              <div>{complaint.message}</div>
              <div className="text-[10px] text-[#555] mt-1">
                {new Date(complaint.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
