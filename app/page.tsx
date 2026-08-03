'use client'

import Shell from "@/components/Shell";
import TabBar from "@/components/TabBar";
import ArchitectureCanvas from "@/components/ArchitectureCanvas";
import { useTabStore } from "@/store/useTabStore";

export default function Home() {
  const openTabs = useTabStore((state) => state.openTabs);
  const activeTabId = useTabStore((state) => state.activeTabId);

  return (
    <Shell>
      {openTabs.length > 0 && (
        <div className="flex flex-col h-full">
          <TabBar />
          <div className="flex-1 overflow-hidden">
            {activeTabId ? (
              <ArchitectureCanvas />
            ) : (
              <div className="flex items-center justify-center h-full text-[#858585] italic">
                Select a tab to view architecture
              </div>
            )}
          </div>
        </div>
      )}
    </Shell>
  );
}
