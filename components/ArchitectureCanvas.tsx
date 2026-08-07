'use client'

import React, { useMemo, useCallback, useRef, useState } from 'react'
import ReactFlow, { ReactFlowInstance, OnSelectionChangeParams } from 'reactflow'
import 'reactflow/dist/style.css'
import { useTabStore } from '@/store/useTabStore'
import ArchitectureNode from './ArchitectureNode'
import { ComponentDef } from '@/store/components'

const nodeTypes = {
  architectureNode: ArchitectureNode,
}

export default function ArchitectureCanvas() {
  const activeTabId = useTabStore((state) => state.activeTabId)
  const openTabs = useTabStore((state) => state.openTabs)
  const addNode = useTabStore((state) => state.addNode)
  const setSelectedNodeId = useTabStore((state) => state.setSelectedNodeId)
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

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

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!activeTabId || !reactFlowInstance || !reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const data = event.dataTransfer.getData('application/reactflow')

      if (!data) return

      try {
        const component: ComponentDef = JSON.parse(data)

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })
        
        const newNode = {
          id: `${component.type}-${Date.now()}`,
          type: component.type, // Store the component type correctly
          label: component.label,
          sockets: component.sockets,
          position,
          data: { label: component.label, sockets: component.sockets },
        }

        addNode(activeTabId, newNode)
      } catch (err) {
        console.error('Failed to parse dropped component data', err)
      }
    },
    [reactFlowInstance, activeTabId, addNode]
  )

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    if (params.nodes.length === 1) {
      setSelectedNodeId(params.nodes[0].id)
    } else if (params.nodes.length === 0) {
      setSelectedNodeId(null)
    }
  }, [setSelectedNodeId])

  return (
    <div className="w-full h-full bg-[#1e1e1e]" data-testid="architecture-canvas" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onSelectionChange={onSelectionChange}
      />
    </div>
  )
}
