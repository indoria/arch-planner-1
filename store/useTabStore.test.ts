import { renderHook, act } from '@testing-library/react'
import { useTabStore } from './useTabStore'

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
    const newTab = { id: '1', title: 'Test Arch', content: {} }
    
    act(() => {
      result.current.openTab(newTab)
    })

    expect(result.current.openTabs).toContainEqual(newTab)
    expect(result.current.activeTabId).toBe('1')
  })

  it('should switch between tabs', () => {
    const { result } = renderHook(() => useTabStore())
    act(() => {
      result.current.openTab({ id: '1', title: 'Arch 1', content: {} })
      result.current.openTab({ id: '2', title: 'Arch 2', content: {} })
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
      result.current.openTab({ id: '1', title: 'Arch 1', content: {} })
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
      result.current.openTab({ id: '1', title: 'Arch 1', content: {} })
      result.current.openTab({ id: '2', title: 'Arch 2', content: {} })
    })

    act(() => {
      result.current.closeTab('2')
    })

    expect(result.current.activeTabId).toBe('1')
  })
})
