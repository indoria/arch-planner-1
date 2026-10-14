'use client'

import React, { memo } from 'react'
import { EdgeProps, getBezierPath } from 'reactflow'
import { useSimulationStore } from '@/store/useSimulationStore'

export interface DataFlowEdgeData {
  isSecondary?: boolean
  isCongested?: boolean
}

function DataFlowEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}: EdgeProps<DataFlowEdgeData>) {
  const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const isSecondary = data?.isSecondary
  const telemetry = useSimulationStore((state) => 
    isSecondary ? state.secondaryNodeTelemetry[source] : state.nodeTelemetry[source]
  )

  const isRunning = telemetry?.status === 'running'
  const isCongested = (telemetry && telemetry.latency >= 300) || Boolean(data?.isCongested)
  const isError = telemetry?.status === 'error'

  const edgeStroke = isError 
    ? '#ef4444' 
    : isCongested 
      ? '#f59e0b' 
      : isRunning 
        ? '#3b82f6' 
        : '#444'

  const packetDuration = isCongested ? '2.5s' : '1.2s'
  const packetFill = isError ? '#ef4444' : isCongested ? '#f59e0b' : '#38bdf8'

  return (
    <>
      <path
        id={id}
        data-testid="edge-path"
        style={{
          ...style,
          stroke: edgeStroke,
          strokeWidth: isRunning || isCongested ? 2.5 : 2,
          transition: 'stroke 0.3s ease, stroke-width 0.3s ease'
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />

      {isRunning && (
        <g 
          data-testid="data-packet" 
          data-congested={isCongested ? 'true' : undefined}
        >
          <circle 
            r="4.5" 
            fill={packetFill}
            filter="drop-shadow(0 0 4px rgba(56, 189, 248, 0.8))"
          >
            <animateMotion 
              dur={packetDuration} 
              repeatCount="indefinite" 
              path={edgePath} 
            />
          </circle>
        </g>
      )}

      {isCongested && (
        <g 
          data-testid="congestion-ripple" 
          transform={`translate(${edgeCenterX}, ${edgeCenterY})`}
        >
          <circle 
            r="6" 
            fill="none" 
            stroke="#f59e0b" 
            strokeWidth="2" 
            opacity="0.8"
          >
            <animate 
              attributeName="r" 
              from="4" 
              to="16" 
              dur="1.2s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="opacity" 
              from="0.8" 
              to="0" 
              dur="1.2s" 
              repeatCount="indefinite" 
            />
          </circle>
          <circle 
            r="3" 
            fill="#f59e0b" 
            opacity="0.9"
          />
        </g>
      )}
    </>
  )
}

export default memo(DataFlowEdge)
