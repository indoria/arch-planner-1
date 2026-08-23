'use client'

import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Socket } from '@/store/architecture'
import { Layers, Activity } from 'lucide-react'
import { useSimulationStore } from '@/store/useSimulationStore'

interface ArchitectureNodeData {
  label: string
  sockets: Socket[]
  subArchitecture?: any
}

const SocketItem = ({ socket }: { socket: Socket }) => {
  const isInput = socket.direction === 'input'
  
  return (
    <div className={`relative flex items-center p-1 px-2 ${isInput ? 'flex-row' : 'flex-row-reverse'} gap-2`}>
      <Handle
        type={isInput ? 'target' : 'source'}
        position={isInput ? Position.Left : Position.Right}
        id={socket.id}
        className="!w-3 !h-3 !bg-[#007acc] border-2 border-[#1e1e1e]"
      />
      <span className="text-[10px] text-[#bbbbbb] select-none">
        {socket.label || socket.type}
      </span>
    </div>
  )
}

function ArchitectureNode({ id, data }: NodeProps<ArchitectureNodeData>) {
  const inputSockets = data.sockets.filter(s => s.direction === 'input')
  const outputSockets = data.sockets.filter(s => s.direction === 'output')
  const telemetry = useSimulationStore(state => state.nodeTelemetry[id])

  const getStatusColor = () => {
    if (!telemetry) return 'bg-transparent'
    switch (telemetry.status) {
      case 'running': return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
      case 'success': return 'bg-green-500'
      case 'error': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
      default: return 'bg-transparent'
    }
  }

  return (
    <div className={`min-w-[150px] bg-[#252526] border rounded shadow-xl overflow-hidden transition-colors ${telemetry?.status === 'error' ? 'border-red-900' : 'border-[#454545]'}`}>
      {/* Header */}
      <div className="bg-[#333333] p-2 text-xs font-medium border-b border-[#454545] text-[#cccccc] flex justify-between items-center relative">
        <div className="flex items-center gap-2">
            <div 
              data-testid="status-indicator"
              className={`w-2 h-2 rounded-full ${getStatusColor()}`} 
            />
            <span>{data.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {telemetry && telemetry.latency > 0 && (
            <span className="text-[9px] text-[#858585] bg-[#1e1e1e] px-1 rounded border border-[#3c3c3c]">
              {telemetry.latency}ms
            </span>
          )}
          {data.subArchitecture && (
              <Layers size={12} className="text-[#007acc]" />
          )}
        </div>
      </div>
      
      {/* Sockets Container */}
      <div className="flex flex-col py-1">
        <div className="grid grid-cols-2">
          {/* Input column */}
          <div className="flex flex-col">
            {inputSockets.map(s => (
              <SocketItem key={s.id} socket={s} />
            ))}
          </div>
          
          {/* Output column */}
          <div className="flex flex-col text-right">
            {outputSockets.map(s => (
              <SocketItem key={s.id} socket={s} />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar (Visible only when running) */}
      {telemetry?.status === 'running' && (
        <div className="h-0.5 w-full bg-[#3c3c3c] overflow-hidden">
          <div className="h-full bg-blue-500 animate-[progress_1s_infinite_linear]" />
        </div>
      )}
    </div>
  )
}

export default memo(ArchitectureNode)
