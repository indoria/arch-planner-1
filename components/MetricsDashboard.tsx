'use client'

import React from 'react'
import { useSimulationStore } from '@/store/useSimulationStore'
import { Clock, DollarSign, Activity, BarChart3 } from 'lucide-react'

const MetricsDashboard: React.FC = () => {
  const { aggregatedMetrics } = useSimulationStore()

  if (aggregatedMetrics.nodeCount === 0) {
    return (
      <div className="p-8 text-center text-[#858585] italic flex flex-col items-center gap-4">
        <BarChart3 size={48} className="opacity-20" />
        <p>Waiting for simulation to record metrics...</p>
      </div>
    )
  }

  return (
    <div className="p-4 h-full bg-[#1e1e1e] text-[#cccccc] font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#252526] p-4 rounded border border-[#333] flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-blue-900/20 rounded-full text-blue-400">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[#666] tracking-wider">E2E Latency</div>
            <div className="text-xl font-bold text-white">{aggregatedMetrics.totalLatency}ms</div>
          </div>
        </div>

        <div className="bg-[#252526] p-4 rounded border border-[#333] flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-green-900/20 rounded-full text-green-400">
            <DollarSign size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[#666] tracking-wider">Total Cost</div>
            <div className="text-xl font-bold text-white">${aggregatedMetrics.totalCost.toFixed(3)}</div>
          </div>
        </div>

        <div className="bg-[#252526] p-4 rounded border border-[#333] flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-purple-900/20 rounded-full text-purple-400">
            <Activity size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[#666] tracking-wider">Nodes Active</div>
            <div className="text-xl font-bold text-white">{aggregatedMetrics.nodeCount}</div>
          </div>
        </div>
      </div>

      <div className="bg-[#252526] p-4 rounded border border-[#333] h-48 flex items-center justify-center text-[#555] italic border-dashed">
         Chart rendering (Chart.js) placeholder
      </div>
    </div>
  )
}

export default MetricsDashboard
