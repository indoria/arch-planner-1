import React, { useState, useEffect, useRef } from 'react'
import { useSimulationStore, LogEntry } from '@/store/useSimulationStore'
import { Search, Trash2, Info, CheckCircle, AlertTriangle, XCircle, Download } from 'lucide-react'
import { exportToJson } from '@/utils/exportUtils'

const LogIcon: React.FC<{ type: LogEntry['type'] }> = ({ type }) => {
  switch (type) {
    case 'success': return <CheckCircle size={14} className="text-green-500" />
    case 'error': return <XCircle size={14} className="text-red-500" />
    case 'warning': return <AlertTriangle size={14} className="text-yellow-500" />
    default: return <Info size={14} className="text-blue-500" />
  }
}

const CallLogPane: React.FC = () => {
  const { logs, clearLogs } = useSimulationStore()
  const [filter, setFilter] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase()) ||
    log.nodeLabel.toLowerCase().includes(filter.toLowerCase()) ||
    log.nodeId.toLowerCase().includes(filter.toLowerCase())
  )

  // Basic virtualization: only show last 100 items
  // Note: logs are prepended in store, so index 0 is newest.
  const displayLogs = filteredLogs.slice(0, 100).reverse()

  useEffect(() => {
    if (scrollRef.current && typeof scrollRef.current.scrollTo === 'function') {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [logs.length])

  const handleExport = () => {
    exportToJson(logs, `simulation_logs_${new Date().toISOString()}.json`)
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-mono text-xs border-l border-[#333333]">
      <div className="flex items-center justify-between p-2 border-b border-[#333333] bg-[#252526]">
        <div className="flex items-center gap-2 flex-1">
          <Search size={14} className="text-[#858585]" />
          <input 
            type="text" 
            placeholder="Filter logs" 
            className="bg-[#3c3c3c] border-none text-white px-2 py-0.5 rounded outline-none w-full"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1">
            <button 
                onClick={handleExport}
                title="Export logs as JSON"
                className="ml-2 p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-white"
            >
                <Download size={14} />
            </button>
            <button 
                onClick={clearLogs}
                title="Clear logs"
                className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-white"
            >
                <Trash2 size={14} />
            </button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        data-testid="log-container"
        className="flex-1 overflow-y-auto"
      >
        {displayLogs.length === 0 ? (
          <div className="p-4 text-center text-[#858585] italic">
            No simulation events recorded
          </div>
        ) : (
          <div className="flex flex-col">
            {displayLogs.map((log) => (
              <div 
                key={log.id} 
                data-testid="log-item"
                className="flex gap-2 p-1 hover:bg-[#2a2d2e] border-b border-[#252526]"
              >
                <span className="text-[#858585] min-w-[70px]">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <div className="flex items-center gap-1 min-w-[60px]">
                  <LogIcon type={log.type} />
                  <span className="font-bold text-[#4ec9b0] truncate max-w-[80px]">{log.nodeLabel}</span>
                </div>
                <span className="flex-1 break-words">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CallLogPane
