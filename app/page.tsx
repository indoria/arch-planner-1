import Shell from "@/components/Shell";
import TabBar from "@/components/TabBar";

export default function Home() {
  return (
    <Shell>
      <div className="flex flex-col h-full">
        <TabBar />
        <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
          {/* This is where the React Flow canvas will live */}
          <div className="flex flex-col items-center justify-center h-full text-[#858585] border border-dashed border-[#333333] m-4 rounded-lg">
            <p className="text-sm opacity-50 italic font-mono uppercase tracking-widest">Main Canvas (Editor Area)</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
