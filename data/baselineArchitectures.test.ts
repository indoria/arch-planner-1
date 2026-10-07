import { 
  BASELINE_ARCHITECTURES, 
  CHEAPEST_650MS_SETUP, 
  ULTRA_LOW_LATENCY_200MS_SETUP,
  getBaselineArchitecture
} from './baselineArchitectures'
import { validateArchitecture } from '@/store/architecture'
import { validateSchema } from '@/utils/schema'
import { useTabStore } from '@/store/useTabStore'
import { SimulationEngine } from '@/simulation/SimulationEngine'
import { ScriptRuntime } from '@/simulation/ScriptRuntime'

describe('Baseline Architectures ("Cheapest 650ms" and "Ultra-Low Latency 200ms")', () => {
  beforeEach(() => {
    useTabStore.setState({
      openTabs: [],
      activeTabId: null,
      activeArchitecture: null,
      drillDownStack: []
    })
  })

  it('defines valid Cheapest 650ms Setup architecture', () => {
    const arch = CHEAPEST_650MS_SETUP
    expect(validateArchitecture(arch)).toBe(true)

    // Valid schema check
    const schemaValidation = validateSchema({
      version: '1.0.0',
      type: 'architecture',
      nodes: arch.nodes,
      connections: arch.connections
    })
    expect(schemaValidation.valid).toBe(true)

    // Verify nodes and pipeline
    const nodeTypes = arch.nodes.map(n => n.type)
    expect(nodeTypes).toContain('vad')
    expect(nodeTypes).toContain('asr')
    expect(nodeTypes).toContain('llm')
    expect(nodeTypes).toContain('tts')

    // Cumulative latency in pipeline equals 650ms
    const totalLatency = arch.nodes.reduce((sum, n) => sum + (n.data?.latency || 0), 0)
    expect(totalLatency).toBe(650)
  })

  it('defines valid Ultra-Low Latency 200ms Setup architecture', () => {
    const arch = ULTRA_LOW_LATENCY_200MS_SETUP
    expect(validateArchitecture(arch)).toBe(true)

    // Valid schema check
    const schemaValidation = validateSchema({
      version: '1.0.0',
      type: 'architecture',
      nodes: arch.nodes,
      connections: arch.connections
    })
    expect(schemaValidation.valid).toBe(true)

    // Verify nodes
    const nodeTypes = arch.nodes.map(n => n.type)
    expect(nodeTypes).toContain('vad')
    expect(nodeTypes).toContain('asr')
    expect(nodeTypes).toContain('llm')
    expect(nodeTypes).toContain('tts')

    // Cumulative latency in pipeline equals 200ms
    const totalLatency = arch.nodes.reduce((sum, n) => sum + (n.data?.latency || 0), 0)
    expect(totalLatency).toBe(200)
  })

  it('loads baseline architectures into the Tab system correctly', () => {
    const store = useTabStore.getState()
    const cheapestTab = getBaselineArchitecture('baseline-cheapest-650ms')
    expect(cheapestTab).toBeDefined()

    store.openTab(cheapestTab!)

    const updatedState1 = useTabStore.getState()
    expect(updatedState1.openTabs).toHaveLength(1)
    expect(updatedState1.activeTabId).toBe('baseline-cheapest-650ms')
    expect(updatedState1.activeArchitecture).toEqual(CHEAPEST_650MS_SETUP)

    const ultraLowTab = getBaselineArchitecture('baseline-ultra-low-latency-200ms')
    expect(ultraLowTab).toBeDefined()

    expect(getBaselineArchitecture('nonexistent-id')).toBeUndefined()

    store.openTab(ultraLowTab!)

    const updatedState2 = useTabStore.getState()
    expect(updatedState2.openTabs).toHaveLength(2)
    expect(updatedState2.activeTabId).toBe('baseline-ultra-low-latency-200ms')
    expect(updatedState2.activeArchitecture).toEqual(ULTRA_LOW_LATENCY_200MS_SETUP)
  })

  it('runs simulation accurately on Cheapest 650ms setup', async () => {
    const runtime = new ScriptRuntime()
    const engine = new SimulationEngine(CHEAPEST_650MS_SETUP, runtime)
    const results = await engine.run()

    // Find the TTS sink node
    const ttsNode = CHEAPEST_650MS_SETUP.nodes.find(n => n.type === 'tts')!
    expect(results[ttsNode.id].status).toBe('success')
    expect(results[ttsNode.id].latency).toBe(650)
  })

  it('runs simulation accurately on Ultra-Low Latency 200ms setup', async () => {
    const runtime = new ScriptRuntime()
    const engine = new SimulationEngine(ULTRA_LOW_LATENCY_200MS_SETUP, runtime)
    const results = await engine.run()

    // Find the TTS sink node
    const ttsNode = ULTRA_LOW_LATENCY_200MS_SETUP.nodes.find(n => n.type === 'tts')!
    expect(results[ttsNode.id].status).toBe('success')
    expect(results[ttsNode.id].latency).toBe(200)
  })
})
