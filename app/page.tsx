import Shell from "@/components/Shell";
import TabBar from "@/components/TabBar";

export default function Home() {
  return (
    <Shell>
      <div className="flex flex-col h-full">
        <TabBar />
        <div className="flex-1 overflow-hidden">
          {/* This is where the React Flow canvas will live */}
          <div className="flex flex-col items-center justify-center h-full text-[#858585]">
            <p className="text-sm opacity-50 italic">Canvas Area (Editor)</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
