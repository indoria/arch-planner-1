import { Socket } from './architecture'

export interface ComponentDef {
  id: string
  type: string
  label: string
  description: string
  cost: string
  latency: string
  sockets: Socket[]
}

export const AVAILABLE_COMPONENTS: ComponentDef[] = [
  {
    id: 'asr-1',
    type: 'asr',
    label: 'Standard ASR',
    description: 'High-accuracy speech-to-text engine.',
    cost: '$0.01/min',
    latency: '200ms',
    sockets: [
      { id: 'audio-in', type: 'audio', direction: 'input', label: 'Audio In' },
      { id: 'text-out', type: 'text', direction: 'output', label: 'Text Out' }
    ]
  },
  {
    id: 'llm-1',
    type: 'llm',
    label: 'Standard LLM',
    description: 'General-purpose large language model.',
    cost: '$0.02/1k tokens',
    latency: '500ms',
    sockets: [
      { id: 'text-in', type: 'text', direction: 'input', label: 'Query' },
      { id: 'text-out', type: 'text', direction: 'output', label: 'Response' }
    ]
  },
  {
    id: 'tts-1',
    type: 'tts',
    label: 'Standard TTS',
    description: 'Natural-sounding text-to-speech engine.',
    cost: '$0.005/1k chars',
    latency: '300ms',
    sockets: [
      { id: 'text-in', type: 'text', direction: 'input', label: 'Text In' },
      { id: 'audio-out', type: 'audio', direction: 'output', label: 'Audio Out' }
    ]
  }
]
