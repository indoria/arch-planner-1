import { renderHook, act } from '@testing-library/react'
import { useTabStore } from './useTabStore'
import { Node } from './architecture'

describe('useTabStore', () => {
  beforeEach(() => {
    act(() => {
      useTabStore.getState().closeAllTabs()
    })
  })

  it('should start with no open tabs', () => {
    const { result } = renderHook(() => useTabStore())
    expect(result.current.openTabs).toEqual([])
    expect(result.current.activeTabId).toBeNull()
  })

  it('should open a new tab', () => {
    const { result } = renderHook(() => useTabStore())
    const newTab = { id: '1', title: 'Test Arch', content: { nodes: [], connections: [] } }
    
    act(() => {
      result.current.openTab(newTab)
    })

    expect(result.current.openTabs).toContainEqual(newTab)
    expect(result.current.activeTabId).toBe('1')
  })

  it('should switch between tabs', () => {
    const { result } = renderHook(() => useTabStore())
    act(() => {
      result.current.openTab({ id: '1', title: 'Arch 1', content: { nodes: [], connections: [] } })
      result.current.openTab({ id: '2', title: 'Arch 2', content: { nodes: [], connections: [] } })
    })

    expect(result.current.activeTabId).toBe('2')

    act(() => {
      result.current.setActiveTab('1')
    })

    expect(result.current.activeTabId).toBe('1')
  })

  it('should close a tab', () => {
    const { result } = renderHook(() => useTabStore())
    act(() => {
      result.current.openTab({ id: '1', title: 'Arch 1', content: { nodes: [], connections: [] } })
    })

    act(() => {
      result.current.closeTab('1')
    })

    expect(result.current.openTabs).toEqual([])
    expect(result.current.activeTabId).toBeNull()
  })

  it('should set the next tab active when the current active tab is closed', () => {
    const { result } = renderHook(() => useTabStore())
    act(() => {
      result.current.openTab({ id: '1', title: 'Arch 1', content: { nodes: [], connections: [] } })
      result.current.openTab({ id: '2', title: 'Arch 2', content: { nodes: [], connections: [] } })
    })

    act(() => {
      result.current.closeTab('2')
    })

    expect(result.current.activeTabId).toBe('1')
  })

  it('should add a node to a specific tab', () => {
    const { result } = renderHook(() => useTabStore())
    act(() => {
      result.current.openTab({ id: '1', title: 'Arch 1', content: { nodes: [], connections: [] } })
    })

    const newNode: Node = { 
      id: 'node-1', 
      type: 'asr', 
      label: 'ASR', 
      sockets: [], 
      position: { x: 100, y: 100 }, 
      data: {} 
    }
    
    act(() => {
      result.current.addNode('1', newNode)
    })

    const tab = result.current.openTabs.find(t => t.id === '1')
    expect(tab?.content.nodes).toContainEqual(newNode)
  })

  it('should replace a component in a specific tab and preserve valid connections', () => {
    const { result } = renderHook(() => useTabStore())
    
    const initialArch = {
      nodes: [
        { 
          id: 'n1', 
          type: 'asr', 
          label: 'Standard ASR', 
          sockets: [
            { id: 'audio-in', type: 'audio', direction: 'input' },
            { id: 'text-out', type: 'text', direction: 'output' }
          ], 
          position: { x: 0, y: 0 }, 
          data: {} 
        },
        { 
          id: 'n2', 
          type: 'llm', 
          label: 'Standard LLM', 
          sockets: [
            { id: 'text-in', type: 'text', direction: 'input' }
          ], 
          position: { x: 200, y: 0 }, 
          data: {} 
        }
      ],
      connections: [
        { id: 'c1', sourceNodeId: 'n1', sourceSocketId: 'text-out', targetNodeId: 'n2', targetSocketId: 'text-in' }
      ]
    }

    act(() => {
      result.current.openTab({ id: '1', title: 'Arch 1', content: initialArch })
    })

    const newComponentData = {
      type: 'asr-premium',
      label: 'Premium ASR',
      sockets: [
        { id: 'audio-in', type: 'audio', direction: 'input' },
        { id: 'text-out', type: 'text', direction: 'output' }
      ]
    }

    act(() => {
      result.current.replaceComponent('1', 'n1', newComponentData)
    })

    const tab = result.current.openTabs.find(t => t.id === '1')
    const replacedNode = tab?.content.nodes.find(n => n.id === 'n1')
    
    expect(replacedNode?.type).toBe('asr-premium')
    expect(replacedNode?.label).toBe('Premium ASR')
    // Connection should be preserved
    expect(tab?.content.connections.length).toBe(1)
    expect(tab?.content.connections[0].id).toBe('c1')
  })

  it('should remove invalid connections after replacement', () => {
    const { result } = renderHook(() => useTabStore())
    
    const initialArch = {
      nodes: [
        { 
          id: 'n1', 
          type: 'asr', 
          label: 'Standard ASR', 
          sockets: [
            { id: 'text-out', type: 'text', direction: 'output' }
          ], 
          position: { x: 0, y: 0 }, 
          data: {} 
        },
        { 
          id: 'n2', 
          type: 'llm', 
          label: 'Standard LLM', 
          sockets: [
            { id: 'text-in', type: 'text', direction: 'input' }
          ], 
          position: { x: 200, y: 0 }, 
          data: {} 
        }
      ],
      connections: [
        { id: 'c1', sourceNodeId: 'n1', sourceSocketId: 'text-out', targetNodeId: 'n2', targetSocketId: 'text-in' }
      ]
    }

    act(() => {
      result.current.openTab({ id: '1', title: 'Arch 1', content: initialArch })
    })

    const newComponentData = {
      type: 'audio-buffer',
      label: 'Audio Buffer',
      sockets: [
        { id: 'audio-out', type: 'audio', direction: 'output' }
      ]
    }

    act(() => {
      result.current.replaceComponent('1', 'n1', newComponentData)
    })

    const tab = result.current.openTabs.find(t => t.id === '1')
    // Connection should be removed because text-out no longer exists or is incompatible
    expect(tab?.content.connections.length).toBe(0)
  })
})
