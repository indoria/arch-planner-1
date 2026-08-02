'use client'

import React, { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Socket } from '@/store/architecture'

interface ArchitectureNodeProps {
  data: {
    label: string
    sockets: Socket[]
  }
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

function ArchitectureNode({ data }: ArchitectureNodeProps) {
  const inputSockets = data.sockets.filter(s => s.direction === 'input')
  const outputSockets = data.sockets.filter(s => s.direction === 'output')

  return (
    <div className="min-w-[150px] bg-[#252526] border border-[#454545] rounded shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#333333] p-2 text-xs font-medium border-b border-[#454545] text-[#cccccc]">
        {data.label}
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
    </div>
  )
}

export default memo(ArchitectureNode)
