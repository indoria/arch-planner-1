import { renderHook, act } from '@testing-library/react'
import { useTabStore } from './useTabStore'
import { Architecture } from './architecture'

describe('useTabStore drill down', () => {
  beforeEach(() => {
    act(() => {
      useTabStore.getState().closeAllTabs()
    })
  })

  it('should navigate into a sub-architecture and back', () => {
    const { result } = renderHook(() => useTabStore())
    
    const subArch: Architecture = {
      nodes: [{ id: 'sub-node', type: 'input', label: 'Sub Node', sockets: [], position: { x: 0, y: 0 }, data: {} }],
      connections: []
    }
    const rootArch: Architecture = {
      nodes: [{ id: 'root-node', type: 'container', label: 'Root Node', sockets: [], position: { x: 0, y: 0 }, data: {}, subArchitecture: subArch }],
      connections: []
    }
    
    act(() => {
      result.current.openTab({ id: '1', title: 'Arch 1', content: rootArch })
    })

    // Initially active architecture should be rootArch
    expect(result.current.activeArchitecture).toEqual(rootArch)

    // Drill down
    act(() => {
      result.current.drillDown(rootArch.nodes[0])
    })
    
    expect(result.current.activeArchitecture).toEqual(subArch)

    // Reset view
    act(() => {
      result.current.resetView()
    })

    expect(result.current.activeArchitecture).toEqual(rootArch)
  })
})
