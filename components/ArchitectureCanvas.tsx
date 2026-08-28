'use client'

import React, { useMemo, useCallback, useRef, useState } from 'react'
import ReactFlow, { 
  ReactFlowInstance, 
  OnSelectionChangeParams, 
  Connection, 
  addEdge, 
  Edge, 
  NodeDragHandler,
  NodeChange,
  EdgeChange
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useTabStore } from '@/store/useTabStore'
import { useSimulationStore } from '@/store/useSimulationStore'
import ArchitectureNode from './ArchitectureNode'
import { ComponentDef } from '@/store/components'
import { canConnect } from '@/store/architecture'

const nodeTypes = {
  architectureNode: ArchitectureNode,
}

export default function ArchitectureCanvas({ tabId }: { tabId?: string }) {
  const storeActiveTabId = useTabStore((state) => state.activeTabId)
  const storeActiveArchitecture = useTabStore((state) => state.activeArchitecture)
  const secondaryActiveTabId = useTabStore((state) => state.secondaryActiveTabId)
  const secondaryActiveArchitecture = useTabStore((state) => state.secondaryActiveArchitecture)
  
  const isSecondary = tabId !== undefined && tabId === secondaryActiveTabId
  const activeTabId = tabId || storeActiveTabId
  const activeArchitecture = isSecondary ? secondaryActiveArchitecture : storeActiveArchitecture
  
  const primaryTelemetry = useSimulationStore((state) => state.nodeTelemetry)
  const secondaryTelemetry = useSimulationStore((state) => state.secondaryNodeTelemetry)
  const nodeTelemetry = isSecondary ? secondaryTelemetry : primaryTelemetry

  const addNode = useTabStore((state) => state.addNode)
  const updateNodePosition = useTabStore((state) => state.updateNodePosition)
  const selectedNodeId = useTabStore((state) => state.selectedNodeId)
  const setSelectedNodeId = useTabStore((state) => state.setSelectedNodeId)
  const addConnection = useTabStore((state) => state.addConnection)
  const addComplaint = useTabStore((state) => state.addComplaint)
  const drillDown = useTabStore((state) => state.drillDown)
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  const nodes = useMemo(() => {
    if (!activeArchitecture) return []
    return activeArchitecture.nodes.map((node) => ({
      id: node.id,
      type: 'architectureNode',
      position: node.position,
      data: { 
        label: node.label, 
        sockets: node.sockets, 
        subArchitecture: node.subArchitecture,
        telemetry: nodeTelemetry[node.id]
      },
      selected: node.id === selectedNodeId
    }))
  }, [activeArchitecture, selectedNodeId, nodeTelemetry])

  const edges = useMemo(() => {
    if (!activeArchitecture) return []
    return activeArchitecture.connections.map((conn) => ({
      id: conn.id,
      source: conn.sourceNodeId,
      sourceHandle: conn.sourceSocketId,
      target: conn.targetNodeId,
      targetHandle: conn.targetSocketId
    }))
  }, [activeArchitecture])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Selection and position changes are handled via onSelectionChange and onNodeDragStop
    },
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      // Handled via store sync
    },
    []
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!activeTabId || isSecondary || !reactFlowInstance || !reactFlowWrapper.current) return

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
          type: component.type, 
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
    [reactFlowInstance, activeTabId, addNode, isSecondary]
  )

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    if (isSecondary) return
    if (params.nodes.length === 1) {
      setSelectedNodeId(params.nodes[0].id)
    } else if (params.nodes.length === 0) {
      setSelectedNodeId(null)
    }
  }, [setSelectedNodeId, isSecondary])

  const isValidConnection = useCallback((connection: Connection) => {
    if (!activeArchitecture || isSecondary) return false
    
    const sourceNode = activeArchitecture.nodes.find(n => n.id === connection.source)
    const targetNode = activeArchitecture.nodes.find(n => n.id === connection.target)
    
    if (!sourceNode || !targetNode || !connection.sourceHandle || !connection.targetHandle) return false
    
    const valid = canConnect(sourceNode, connection.sourceHandle, targetNode, connection.targetHandle)
    
    if (!valid) {
      const sourceSocket = sourceNode.sockets.find(s => s.id === connection.sourceHandle)
      const targetSocket = targetNode.sockets.find(s => s.id === connection.targetHandle)
      
      if (sourceSocket && targetSocket) {
        if (sourceSocket.direction === targetSocket.direction) {
          addComplaint(`Cannot connect two ${sourceSocket.direction}s. Must be output to input.`, 'error')
        } else if (sourceSocket.type !== targetSocket.type) {
          addComplaint(`Incompatible types: ${sourceSocket.type} cannot connect to ${targetSocket.type}.`, 'error')
        }
      }
    }
    
    return valid
  }, [activeArchitecture, addComplaint, isSecondary])

  const onConnect = useCallback((params: Connection) => {
    if (!activeTabId || isSecondary || !params.source || !params.target || !params.sourceHandle || !params.targetHandle) return
    
    addConnection(activeTabId, {
      id: `conn-${Date.now()}`,
      sourceNodeId: params.source,
      sourceSocketId: params.sourceHandle,
      targetNodeId: params.target,
      targetSocketId: params.targetHandle
    })
  }, [activeTabId, addConnection, isSecondary])

  const onNodeDragStop: NodeDragHandler = useCallback((event, node) => {
    if (!activeTabId || isSecondary) return
    updateNodePosition(activeTabId, node.id, node.position)
  }, [activeTabId, updateNodePosition, isSecondary])

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: any) => {
      const archNode = activeArchitecture?.nodes.find(n => n.id === node.id)
      if (archNode && archNode.subArchitecture) {
          drillDown(archNode)
      }
  }, [activeArchitecture, drillDown])

  return (
    <div className="w-full h-full bg-[#1e1e1e]" data-testid="architecture-canvas" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onSelectionChange={onSelectionChange}
        isValidConnection={isValidConnection}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeDoubleClick={onNodeDoubleClick}
      />
    </div>
  )
}
