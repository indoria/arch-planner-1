'use client'

import React, { useMemo } from 'react'
import ReactFlow from 'reactflow'
import 'reactflow/dist/style.css'
import { useTabStore } from '@/store/useTabStore'
import ArchitectureNode from './ArchitectureNode'

const nodeTypes = {
  architectureNode: ArchitectureNode,
}

export default function ArchitectureCanvas() {
  const activeTabId = useTabStore((state) => state.activeTabId)
  const openTabs = useTabStore((state) => state.openTabs)

  const activeTab = useMemo(() => 
    openTabs.find((t) => t.id === activeTabId),
    [openTabs, activeTabId]
  )

  const nodes = useMemo(() => {
    if (!activeTab) return []
    return activeTab.content.nodes.map((node) => ({
      id: node.id,
      type: 'architectureNode',
      position: node.position,
      data: { label: node.label, sockets: node.sockets }
    }))
  }, [activeTab])

  const edges = useMemo(() => {
    if (!activeTab) return []
    return activeTab.content.connections.map((conn) => ({
      id: conn.id,
      source: conn.sourceNodeId,
      sourceHandle: conn.sourceSocketId,
      target: conn.targetNodeId,
      targetHandle: conn.targetSocketId
    }))
  }, [activeTab])

  return (
    <div className="w-full h-full bg-[#1e1e1e]" data-testid="architecture-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
      />
    </div>
  )
}
