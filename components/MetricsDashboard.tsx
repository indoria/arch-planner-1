'use client'

import React from 'react'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTabStore } from '@/store/useTabStore'
import { Clock, DollarSign, Activity, BarChart3, Download, TrendingUp, TrendingDown } from 'lucide-react'
import { exportToJson } from '@/utils/exportUtils'

const MetricsDashboard: React.FC = () => {
  const { aggregatedMetrics, secondaryAggregatedMetrics } = useSimulationStore()
  const { isSplitView, openTabs, activeTabId, secondaryActiveTabId } = useTabStore()
  
  const activeTab = openTabs.find(t => t.id === activeTabId)
  const secondaryTab = openTabs.find(t => t.id === secondaryActiveTabId)
  const activeTitle = activeTab?.title || 'Primary'
  const secondaryTitle = secondaryTab?.title || 'Secondary'

  const handleExport = () => {
    const data = isSplitView 
      ? { primary: aggregatedMetrics, secondary: secondaryAggregatedMetrics }
      : aggregatedMetrics
    exportToJson(data, `simulation_metrics_${new Date().toISOString()}.json`)
  }

  if (aggregatedMetrics.nodeCount === 0) {
    return (
      <div className="p-8 text-center text-[#858585] italic flex flex-col items-center gap-4">
        <BarChart3 size={48} className="opacity-20" />
        <p>Waiting for simulation to record metrics...</p>
      </div>
    )
  }

  const renderMetricCard = (
    label: string, 
    value: string | number, 
    secondaryValue: string | number | null, 
    icon: React.ReactNode, 
    colorClass: string,
    delta?: number | null,
    deltaInverted?: boolean
  ) => {
    const hasComparison = isSplitView && secondaryValue !== null
    
    let descriptiveText = ''
    if (hasComparison && delta !== undefined && delta !== null) {
      if (delta === 0) {
        descriptiveText = 'Identical performance'
      } else if (label === "E2E Latency") {
        descriptiveText = `${secondaryTitle} is ${Math.abs(delta)}ms ${delta > 0 ? 'slower' : 'faster'} than ${activeTitle}`
      } else if (label === "Total Cost") {
        descriptiveText = `${secondaryTitle} is $${Math.abs(delta).toFixed(3)} ${delta > 0 ? 'more expensive' : 'cheaper'} than ${activeTitle}`
      }
    }

    return (
      <div className="bg-[#252526] p-4 rounded border border-[#333] flex flex-col gap-2 shadow-lg">
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-${colorClass.split('-')[1]}-900/20 rounded-full ${colorClass}`}>
            {icon}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[#666] tracking-wider">{label}</div>
            <div className="text-xl font-bold text-white">{value}</div>
          </div>
        </div>
        
        {hasComparison && (
          <div className="mt-2 pt-2 border-t border-[#333] flex flex-col gap-1">
            <div className="text-[11px] text-[#858585]">
              {secondaryTitle}: <span className="text-[#ccc]">{secondaryValue}</span>
            </div>
            {delta !== undefined && delta !== null && (
              <div className={`text-[11px] font-bold flex flex-col gap-0.5 ${
                delta > 0 
                  ? (deltaInverted ? 'text-green-400' : 'text-red-400')
                  : (deltaInverted ? 'text-red-400' : 'text-green-400')
              }`}>
                <div className="flex items-center gap-1">
                  {delta > 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                  Delta: {delta > 0 ? `+${delta}` : delta}
                </div>
                {descriptiveText && (
                  <div className="text-[10px] opacity-80 italic font-normal">
                    {descriptiveText}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const latencyDelta = secondaryAggregatedMetrics.totalLatency - aggregatedMetrics.totalLatency
  const costDelta = secondaryAggregatedMetrics.totalCost - aggregatedMetrics.totalCost

  return (
    <div className="p-4 h-full bg-[#1e1e1e] text-[#cccccc] font-sans overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#888]">
          {isSplitView ? 'Comparative Overview' : 'Simulation Overview'}
        </h2>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#333] hover:bg-[#444] rounded border border-[#444] text-xs font-bold transition-all shadow-md active:scale-95"
        >
          <Download size={14} />
          Export JSON
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {renderMetricCard(
          "E2E Latency", 
          `${aggregatedMetrics.totalLatency}ms`, 
          `${secondaryAggregatedMetrics.totalLatency}ms`, 
          <Clock size={20} />, 
          "text-blue-400",
          latencyDelta,
          true // Inverted: lower is better
        )}

        {renderMetricCard(
          "Total Cost", 
          `$${aggregatedMetrics.totalCost.toFixed(3)}`, 
          `$${secondaryAggregatedMetrics.totalCost.toFixed(3)}`, 
          <DollarSign size={20} />, 
          "text-green-400",
          costDelta,
          true // Inverted: lower is better
        )}

        {renderMetricCard(
          "Nodes Active", 
          aggregatedMetrics.nodeCount, 
          secondaryAggregatedMetrics.nodeCount, 
          <Activity size={20} />, 
          "text-purple-400"
        )}
      </div>

      <div className="bg-[#252526] p-4 rounded border border-[#333] h-48 flex items-center justify-center text-[#555] italic border-dashed">
         Chart rendering (Chart.js) placeholder
      </div>
    </div>
  )
}

export default MetricsDashboard
