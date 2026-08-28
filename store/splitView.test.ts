import { useTabStore } from './useTabStore';

describe('useTabStore - Split View', () => {
  beforeEach(() => {
    useTabStore.getState().closeAllTabs();
    // Reset split view state if it exists (it doesn't yet, so this will fail)
  });

  it('initializes with split view disabled', () => {
    const state = useTabStore.getState();
    expect(state.isSplitView).toBe(false);
    expect(state.secondaryActiveTabId).toBeNull();
  });

  it('enables split view', () => {
    const { setSplitView } = useTabStore.getState();
    setSplitView(true);
    expect(useTabStore.getState().isSplitView).toBe(true);
  });

  it('manages secondary active tab', () => {
    const { openTab, setActiveTab, setSplitView, setSecondaryActiveTab } = useTabStore.getState();
    
    const tab1 = { id: 'tab-1', title: 'Arch 1', content: { nodes: [], connections: [] } };
    const tab2 = { id: 'tab-2', title: 'Arch 2', content: { nodes: [], connections: [] } };
    
    openTab(tab1);
    openTab(tab2);
    setActiveTab('tab-1'); // Explicitly set primary back to tab-1
    setSplitView(true);
    
    setSecondaryActiveTab('tab-2');
    
    const state = useTabStore.getState();
    expect(state.activeTabId).toBe('tab-1'); 
    expect(state.secondaryActiveTabId).toBe('tab-2');
    expect(state.secondaryActiveArchitecture).toEqual(tab2.content);
  });

  it('automatically sets secondary tab if split view enabled with multiple tabs', () => {
    const { openTab, setActiveTab, setSplitView } = useTabStore.getState();
    
    openTab({ id: 't1', title: 'T1', content: { nodes: [], connections: [] } });
    openTab({ id: 't2', title: 'T2', content: { nodes: [], connections: [] } });
    setActiveTab('t1');
    
    // When enabling split view, it should auto-pick t2 as secondary
    setSplitView(true);
    
    const state = useTabStore.getState();
    expect(state.secondaryActiveTabId).toBe('t2');
  });
});
