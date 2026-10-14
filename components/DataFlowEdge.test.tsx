import React from 'react'
import { render, screen } from '@testing-library/react'
import DataFlowEdge from './DataFlowEdge'
import { Position } from 'reactflow'
import { useSimulationStore } from '@/store/useSimulationStore'

// Mock getBezierPath from reactflow if needed
jest.mock('reactflow', () => ({
  ...jest.requireActual('reactflow'),
  getBezierPath: () => ['M0,0 C50,0 50,100 100,100', 50, 50],
  Position: {
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom',
  }
}))

describe('DataFlowEdge', () => {
  const defaultProps = {
    id: 'e1-2',
    source: 'node-1',
    target: 'node-2',
    sourceX: 0,
    sourceY: 0,
    targetX: 100,
    targetY: 100,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }

  beforeEach(() => {
    useSimulationStore.getState().resetTelemetry()
  })

  it('renders standard edge path when idle', () => {
    const { container } = render(
      <svg>
        <DataFlowEdge {...defaultProps} />
      </svg>
    )
    expect(container.querySelector('[data-testid="edge-path"]')).toBeInTheDocument()
    expect(screen.queryByTestId('data-packet')).not.toBeInTheDocument()
    expect(screen.queryByTestId('congestion-ripple')).not.toBeInTheDocument()
  })

  it('renders animated data packet when source node is running', () => {
    useSimulationStore.getState().setNodeTelemetry('node-1', {
      status: 'running',
      latency: 50,
      cost: 0.001
    })

    const { container } = render(
      <svg>
        <DataFlowEdge {...defaultProps} />
      </svg>
    )
    const packet = screen.getByTestId('data-packet')
    expect(packet).toBeInTheDocument()
    expect(packet.querySelector('animateMotion')).toBeInTheDocument()
    expect(screen.queryByTestId('congestion-ripple')).not.toBeInTheDocument()
  })

  it('renders congestion ripple and congested packet when latency indicates bottleneck', () => {
    useSimulationStore.getState().setNodeTelemetry('node-1', {
      status: 'running',
      latency: 450,
      cost: 0.01
    })

    render(
      <svg>
        <DataFlowEdge {...defaultProps} />
      </svg>
    )
    const packet = screen.getByTestId('data-packet')
    expect(packet).toBeInTheDocument()
    expect(packet).toHaveAttribute('data-congested', 'true')
    
    const ripple = screen.getByTestId('congestion-ripple')
    expect(ripple).toBeInTheDocument()
  })
})
