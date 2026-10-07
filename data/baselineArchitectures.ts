import { Architecture } from '@/store/architecture'
import { Tab } from '@/store/useTabStore'

export interface BaselineArchitectureMeta {
  id: string
  title: string
  description: string
  targetLatency: number
  estimatedCost: string
  tags: string[]
  content: Architecture
}

export const CHEAPEST_650MS_SETUP: Architecture = {
  nodes: [
    {
      id: 'vad-cheapest',
      type: 'vad',
      label: 'WebRTC VAD (Low Compute)',
      position: { x: 60, y: 160 },
      sockets: [
        { id: 'v-in-cheap', type: 'audio', direction: 'input', label: 'Raw Audio' },
        { id: 'v-out-cheap', type: 'audio', direction: 'output', label: 'Voice Chunks' }
      ],
      data: {
        latency: 50,
        cost: 0.0001,
        description: 'Lightweight energy VAD with 50ms evaluation window.',
        script: "return input['v-in-cheap'] || 'audio_data';"
      }
    },
    {
      id: 'asr-cheapest',
      type: 'asr',
      label: 'Deepgram Nova-2 (Batch/Budget)',
      position: { x: 300, y: 160 },
      sockets: [
        { id: 'a-in-cheap', type: 'audio', direction: 'input', label: 'Voice Chunks' },
        { id: 'a-out-cheap', type: 'text', direction: 'output', label: 'Transcript' }
      ],
      data: {
        latency: 250,
        cost: 0.0043,
        description: 'Cost-optimized ASR model balance ($0.0043/min).',
        script: "return 'How can I check my current plan details?';"
      }
    },
    {
      id: 'llm-cheapest',
      type: 'llm',
      label: 'Llama 3 8B / GPT-4o-mini',
      position: { x: 540, y: 160 },
      sockets: [
        { id: 'l-in-cheap', type: 'text', direction: 'input', label: 'Transcript' },
        { id: 'l-out-cheap', type: 'text', direction: 'output', label: 'Generated Response' }
      ],
      data: {
        latency: 200,
        cost: 0.0015,
        description: 'High token throughput and minimal cost per 1k tokens.',
        script: "return 'You are on the Standard plan with 500 minutes remaining.';"
      }
    },
    {
      id: 'tts-cheapest',
      type: 'tts',
      label: 'Standard Cloud TTS',
      position: { x: 780, y: 160 },
      sockets: [
        { id: 't-in-cheap', type: 'text', direction: 'input', label: 'Generated Response' },
        { id: 't-out-cheap', type: 'audio', direction: 'output', label: 'Synthesized Voice' }
      ],
      data: {
        latency: 150,
        cost: 0.0015,
        description: 'Reliable cloud TTS synthesis with 150ms buffer time.',
        script: "return 'voice_stream_output';"
      }
    }
  ],
  connections: [
    {
      id: 'conn-cheap-1',
      sourceNodeId: 'vad-cheapest',
      sourceSocketId: 'v-out-cheap',
      targetNodeId: 'asr-cheapest',
      targetSocketId: 'a-in-cheap'
    },
    {
      id: 'conn-cheap-2',
      sourceNodeId: 'asr-cheapest',
      sourceSocketId: 'a-out-cheap',
      targetNodeId: 'llm-cheapest',
      targetSocketId: 'l-in-cheap'
    },
    {
      id: 'conn-cheap-3',
      sourceNodeId: 'llm-cheapest',
      sourceSocketId: 'l-out-cheap',
      targetNodeId: 'tts-cheapest',
      targetSocketId: 't-in-cheap'
    }
  ]
}

export const ULTRA_LOW_LATENCY_200MS_SETUP: Architecture = {
  nodes: [
    {
      id: 'vad-ultralow',
      type: 'vad',
      label: 'Neural VAD + Semantic Endpointing',
      position: { x: 60, y: 160 },
      sockets: [
        { id: 'v-in-fast', type: 'audio', direction: 'input', label: 'Mic Stream' },
        { id: 'v-out-fast', type: 'audio', direction: 'output', label: 'Active Audio' }
      ],
      data: {
        latency: 15,
        cost: 0.001,
        description: 'Ultra-fast sub-15ms silero neural VAD with semantic turn prediction.',
        script: "return input['v-in-fast'] || 'audio_data';"
      }
    },
    {
      id: 'asr-ultralow',
      type: 'asr',
      label: 'Groq Whisper v3 Turbo Streaming',
      position: { x: 300, y: 160 },
      sockets: [
        { id: 'a-in-fast', type: 'audio', direction: 'input', label: 'Active Audio' },
        { id: 'a-out-fast', type: 'text', direction: 'output', label: 'Streaming Tokens' }
      ],
      data: {
        latency: 85,
        cost: 0.010,
        description: 'Hardware accelerated streaming ASR running at 85ms TTFT.',
        script: "return 'Can you update my shipping address?';"
      }
    },
    {
      id: 'llm-ultralow',
      type: 'llm',
      label: 'Cerebras Llama-3.1 70B (Speculative)',
      position: { x: 540, y: 160 },
      sockets: [
        { id: 'l-in-fast', type: 'text', direction: 'input', label: 'Streaming Tokens' },
        { id: 'l-out-fast', type: 'text', direction: 'output', label: 'First Clause' }
      ],
      data: {
        latency: 60,
        cost: 0.015,
        description: 'Ultra-fast inference (1800 tok/s) emitting first clause in 60ms.',
        script: "return 'Certainly, I can help update that right now.';"
      }
    },
    {
      id: 'tts-ultralow',
      type: 'tts',
      label: 'Cartesia Sonic (Sentence-Boundary TTS)',
      position: { x: 780, y: 160 },
      sockets: [
        { id: 't-in-fast', type: 'text', direction: 'input', label: 'First Clause' },
        { id: 't-out-fast', type: 'audio', direction: 'output', label: 'Realtime Audio' }
      ],
      data: {
        latency: 40,
        cost: 0.010,
        description: 'Real-time WebSocket streaming with 40ms Time-To-First-Audio.',
        script: "return 'realtime_pcm_stream';"
      }
    }
  ],
  connections: [
    {
      id: 'conn-fast-1',
      sourceNodeId: 'vad-ultralow',
      sourceSocketId: 'v-out-fast',
      targetNodeId: 'asr-ultralow',
      targetSocketId: 'a-in-fast'
    },
    {
      id: 'conn-fast-2',
      sourceNodeId: 'asr-ultralow',
      sourceSocketId: 'a-out-fast',
      targetNodeId: 'llm-ultralow',
      targetSocketId: 'l-in-fast'
    },
    {
      id: 'conn-fast-3',
      sourceNodeId: 'llm-ultralow',
      sourceSocketId: 'l-out-fast',
      targetNodeId: 'tts-ultralow',
      targetSocketId: 't-in-fast'
    }
  ]
}

export const BASELINE_ARCHITECTURES: BaselineArchitectureMeta[] = [
  {
    id: 'baseline-cheapest-650ms',
    title: 'Cheapest 650ms Setup',
    description: 'Cost-optimized baseline targeting ~$0.007/min at an acceptable 650ms turn-taking latency.',
    targetLatency: 650,
    estimatedCost: '$0.0074/min',
    tags: ['Budget', 'Batch ASR', 'Standard LLM'],
    content: CHEAPEST_650MS_SETUP
  },
  {
    id: 'baseline-ultra-low-latency-200ms',
    title: 'Ultra-Low Latency 200ms Setup',
    description: 'Speed-optimized baseline targeting human-conversational 200ms latency with streaming LPU and Sonic TTS.',
    targetLatency: 200,
    estimatedCost: '$0.0360/min',
    tags: ['Ultra-Low Latency', 'Groq/Cerebras', 'Streaming TTS'],
    content: ULTRA_LOW_LATENCY_200MS_SETUP
  }
]

export function getBaselineArchitecture(id: string): Tab | undefined {
  const meta = BASELINE_ARCHITECTURES.find(b => b.id === id)
  if (!meta) return undefined
  return {
    id: meta.id,
    title: meta.title,
    content: meta.content
  }
}
