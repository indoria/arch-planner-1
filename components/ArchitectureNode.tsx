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

  const isCongested = telemetry && telemetry.latency >= 300
  const isRunning = telemetry?.status === 'running'

  return (
    <div className={`min-w-[150px] bg-[#252526] border rounded shadow-xl overflow-hidden transition-colors ${telemetry?.status === 'error' ? 'border-red-900' : isCongested ? 'border-amber-600/70 shadow-[0_0_12px_rgba(245,158,11,0.2)]' : 'border-[#454545]'}`}>
      {/* Header */}
      <div className="bg-[#333333] p-2 text-xs font-medium border-b border-[#454545] text-[#cccccc] flex justify-between items-center relative">
        <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              {isRunning && (
                <span 
                  data-testid="status-ripple" 
                  className="absolute w-3 h-3 rounded-full bg-blue-400 opacity-75 animate-ping" 
                />
              )}
              {isCongested && (
                <span 
                  data-testid="congestion-ripple" 
                  className="absolute w-3.5 h-3.5 rounded-full bg-amber-400 opacity-75 animate-ping" 
                />
              )}
              <div 
                data-testid="status-indicator"
                className={`w-2 h-2 rounded-full ${getStatusColor()}`} 
              />
            </div>
            <span>{data.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isCongested && (
            <span 
              data-testid="congestion-indicator"
              className="text-[8px] uppercase tracking-wider text-amber-400 bg-amber-950/70 px-1 rounded border border-amber-500/50 font-mono animate-pulse"
            >
              Congested
            </span>
          )}
          {telemetry && telemetry.latency > 0 && (
            <span className={`text-[9px] px-1 rounded border ${isCongested ? 'text-amber-300 bg-amber-950/40 border-amber-600/50' : 'text-[#858585] bg-[#1e1e1e] border-[#3c3c3c]'}`}>
              {telemetry.latency}ms
            </span>
          )}
          {data.subArchitecture && (
            <div 
              data-testid="sub-architecture-indicator"
              className="flex items-center gap-1 bg-[#1e1e1e] px-1 rounded border border-[#007acc]/30"
            >
              <Layers size={10} className="text-[#007acc]" />
              <span className="text-[8px] text-[#007acc] uppercase font-bold tracking-tighter">Sub</span>
            </div>
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
