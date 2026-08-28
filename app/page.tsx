'use client'

import React, { useEffect } from 'react'
import Shell from "@/components/Shell";
import TabBar from "@/components/TabBar";
import ArchitectureCanvas from "@/components/ArchitectureCanvas";
import { useTabStore } from "@/store/useTabStore";
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

export default function Home() {
  const openTabs = useTabStore((state) => state.openTabs);
  const activeTabId = useTabStore((state) => state.activeTabId);
  const secondaryActiveTabId = useTabStore((state) => state.secondaryActiveTabId);
  const isSplitView = useTabStore((state) => state.isSplitView);
  const initStore = useTabStore((state) => state.init);

  useEffect(() => {
    initStore();
  }, [initStore]);

  return (
    <Shell>
      {openTabs.length > 0 && (
        <div className="flex flex-col h-full overflow-hidden">
          <TabBar />
          <div className="flex-1 overflow-hidden">
            {!isSplitView ? (
              activeTabId ? (
                <ArchitectureCanvas />
              ) : (
                <div className="flex items-center justify-center h-full text-[#858585] italic">
                  Select a tab to view architecture
                </div>
              )
            ) : (
              <PanelGroup direction="horizontal">
                <Panel defaultSize={50} minSize={20}>
                  <ArchitectureCanvas />
                </Panel>
                <PanelResizeHandle className="w-1 bg-[#2b2b2b] hover:bg-[#007acc] transition-colors" />
                <Panel defaultSize={50} minSize={20}>
                  {secondaryActiveTabId ? (
                    <ArchitectureCanvas tabId={secondaryActiveTabId} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#858585] italic bg-[#1e1e1e]">
                      Select secondary tab
                    </div>
                  )}
                </Panel>
              </PanelGroup>
            )}
          </div>
        </div>
      )}
    </Shell>
  );
}
