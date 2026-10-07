'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight, BookOpen, Search, Code, Cpu, Scale } from 'lucide-react'

export interface KnowledgeConcept {
  id: string
  title: string
  subtitle: string
  summary: string
  deepDive: {
    mechanism: string
    strategy: string
    tradeoffs: string
  }
}

export const ENTERPRISE_KNOWLEDGE_BASE: KnowledgeConcept[] = [
  {
    id: 'semantic-endpointing',
    title: 'Semantic Endpointing',
    subtitle: 'LLM-based silence detection',
    summary: 'Analyzes utterance semantics with a lightweight model to detect true user speech completion rather than relying purely on fixed silence timeouts.',
    deepDive: {
      mechanism: 'Traditional Voice Activity Detection (VAD) relies on a rigid 500-1000ms silence threshold, which either cuts off natural pauses or causes perceptible conversational lag. Semantic endpointing streams partial transcripts into a sub-30ms classifier or 0.5B-1B parameter LLM to calculate the probability that the sentence is grammatically and conversationally complete.',
      strategy: 'Deploy a hybrid pipeline: standard energy VAD triggers a "provisional pause" at 250ms. The semantic classifier evaluates the token context (e.g., trailing conjunctions like "and then..." vs full propositions). If probability > 0.88, commit turn endpoint immediately; otherwise, extend silence threshold to 1200ms.',
      tradeoffs: 'Significantly improves natural turn-taking and eliminates dead air, but introduces minor compute overhead (~20ms inference) and token processing cost on partial transcripts.'
    }
  },
  {
    id: 'sentence-boundary-streaming',
    title: 'Sentence-Boundary Streaming',
    subtitle: 'Chunking & TTS streaming',
    summary: 'Splits streaming LLM token generation at syntactic sentence and clause boundaries to synthesize TTS audio ahead of full text completion.',
    deepDive: {
      mechanism: 'Waiting for an LLM to generate its entire response introduces 1000-2500ms of latency. Streaming single tokens directly to TTS yields choppy, unnatural prosody. Sentence-boundary streaming maintains a sliding token buffer that parses punctuation (. ? ! ; :) and phonetic clauses, instantly dispatching the first complete thought to the TTS engine.',
      strategy: 'Implement an adaptive chunking buffer: target an initial clause length of 4-8 words for ultra-fast Time-To-First-Audio (TTFA < 350ms). While the user listens to the synthesized first clause, subsequent sentences are generated and synthesized in parallel queue buffers.',
      tradeoffs: 'Reduces perceived latency by up to 70%, but requires careful prosody continuation marks (SSML or pitch cues) to prevent cadence glitches across chunk boundaries.'
    }
  },
  {
    id: 'backchannel-filtering',
    title: 'Backchannel Filtering',
    subtitle: 'Handling "uh-huh" without barge-in',
    summary: 'Differentiates passive conversational acknowledgments like "uh-huh" from true user interruptions to prevent accidental bot speech cancellation.',
    deepDive: {
      mechanism: 'Standard barge-in protocols abruptly cancel bot audio whenever microphone input exceeds energy thresholds. Humans frequently emit backchannels ("mm-hmm", "yeah", "okay", "right") to signal attentiveness. Backchannel filtering evaluates 200ms speech bursts against an acoustic classifier or phoneme lattice before triggering cancellation.',
      strategy: 'When an incoming speech burst is classified as a backchannel, apply an audio ducking attenuation curve (-6dB) to the speaker output for 300ms instead of a hard interrupt. Resume full volume once the backchannel ceases.',
      tradeoffs: 'Avoids jarring false interruptions during long explanations, though misclassifying a genuine interrupt as a backchannel can make the bot feel briefly unresponsive.'
    }
  },
  {
    id: 'latency-masking',
    title: 'Latency Masking',
    subtitle: 'Pre-fetching filler words',
    summary: 'Immediately generates natural conversational acoustic fillers like "Hmm, let me check" while backend retrieval and heavy reasoning execute.',
    deepDive: {
      mechanism: 'When user queries trigger deep RAG retrieval, multi-tool workflows, or cold-start LLM inferences exceeding 700ms, total silence induces caller abandonment. Latency masking generates an instant, context-aware acoustic acknowledgment within 180ms.',
      strategy: 'Pre-cache audio waveforms for standard fillers ("Sure thing...", "One moment, pulling that up...", "Hmm, let me check...") with dynamic pitch variants. Dispatch immediate playback while asynchronous orchestration pipelines resolve.',
      tradeoffs: 'Eliminates caller anxiety and dead air, but overusing repetitive filler phrases can feel artificial or frustrating if used on simple deterministic queries.'
    }
  },
  {
    id: 'acoustic-echo-cancellation',
    title: 'Acoustic Echo Cancellation',
    subtitle: 'AEC & Full-Duplex Isolation',
    summary: 'Subtracts the bot speaker audio output from the incoming microphone signal to prevent feedback loops and self-interruption in full-duplex calls.',
    deepDive: {
      mechanism: 'In full-duplex voice pipelines (WebRTC/SIP), loudspeaker output reflects back into the microphone. Without AEC, the voicebot hears its own voice, triggers the VAD, and falsely interrupts its own response loop in an echo cascade.',
      strategy: 'Route the raw playback audio stream as a reference channel into a normalized least mean squares (NLMS) or Kalman adaptive filter. Subtract the estimated echo path from the microphone signal before routing to VAD and ASR.',
      tradeoffs: 'Essential for conversational full-duplex audio. Hardware AEC is optimal; software AEC requires 5-15ms processing buffer and continuous double-talk detection calibration.'
    }
  },
  {
    id: 'speculative-execution',
    title: 'Speculative Execution',
    subtitle: 'Pre-prompting before user finishes',
    summary: 'Initiates speculative LLM and backend tool queries on high-confidence partial transcripts before the user finishes speaking.',
    deepDive: {
      mechanism: 'As speech recognition delivers streaming partial hypotheses, the system identifies high-confidence intent trajectories (e.g., "Can I check my current balance for account..."). The orchestrator issues speculative API calls and LLM draft prompts in background threads.',
      strategy: 'Maintain a speculative state worker. If the final endpointed transcript matches the predicted intent prefix, commit the pre-computed response immediately for near-zero latency. If the user pivots ("...actually, cancel that"), abort speculative threads cleanly.',
      tradeoffs: 'Enables instant response times that match human conversational latency (~200ms), but consumes additional LLM tokens and API calls on aborted branches.'
    }
  }
]

export default function EnterpriseKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openConceptId, setOpenConceptId] = useState<string | null>(null)
  const [openDeepDiveIds, setOpenDeepDiveIds] = useState<Set<string>>(new Set())

  const filteredConcepts = ENTERPRISE_KNOWLEDGE_BASE.filter(concept =>
    concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    concept.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    concept.summary.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleConcept = (id: string) => {
    setOpenConceptId(prev => prev === id ? null : id)
  }

  const toggleDeepDive = (id: string) => {
    setOpenDeepDiveIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col text-[#cccccc] text-xs font-sans select-none" data-testid="enterprise-knowledge-base">
      <div className="p-2 border-b border-[#2b2b2b] bg-[#252526]">
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-2 text-[#858585]" />
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e1e1e] text-[#cccccc] pl-7 pr-2 py-1 rounded text-xs border border-[#3c3c3c] focus:outline-none focus:border-[#007acc]"
          />
        </div>
      </div>

      <div className="divide-y divide-[#2b2b2b]">
        {filteredConcepts.map(concept => {
          const isOpen = openConceptId === concept.id
          const isDeepDiveOpen = openDeepDiveIds.has(concept.id)

          return (
            <div key={concept.id} className="bg-[#1e1e1e]">
              <button
                onClick={() => toggleConcept(concept.id)}
                className="w-full flex items-center justify-between p-2.5 hover:bg-[#2a2d2e] transition-colors text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isOpen ? (
                    <ChevronDown size={14} className="text-[#007acc] flex-shrink-0" />
                  ) : (
                    <ChevronRight size={14} className="text-[#858585] flex-shrink-0" />
                  )}
                  <div className="truncate">
                    <div className="font-medium text-[#e1e1e1]">{concept.title}</div>
                    <div className="text-[10px] text-[#858585] truncate">{concept.subtitle}</div>
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="px-3 pb-3 pt-1 border-t border-[#252526] bg-[#181818] space-y-2">
                  <div className="text-[#cccccc] text-[11px] leading-relaxed">
                    {concept.summary}
                  </div>

                  <div>
                    <button
                      onClick={() => toggleDeepDive(concept.id)}
                      data-testid={`deep-dive-toggle-${concept.id}`}
                      className="flex items-center gap-1.5 text-[11px] font-mono text-[#007acc] hover:underline mt-1"
                    >
                      {isDeepDiveOpen ? (
                        <>
                          <ChevronDown size={12} /> Hide Deep Dive
                        </>
                      ) : (
                        <>
                          <ChevronRight size={12} /> Explore Deep Dive
                        </>
                      )}
                    </button>

                    {isDeepDiveOpen && (
                      <div className="mt-2.5 p-2.5 rounded bg-[#252526] border border-[#333333] space-y-2.5 text-[11px]">
                        <div>
                          <div className="flex items-center gap-1 font-semibold text-[#4ec9b0] mb-0.5">
                            <Cpu size={12} />
                            <span>Mechanism:</span>
                          </div>
                          <p className="text-[#a0a0a0] leading-relaxed">{concept.deepDive.mechanism}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 font-semibold text-[#ce9178] mb-0.5">
                            <Code size={12} />
                            <span>Architecture Strategy:</span>
                          </div>
                          <p className="text-[#a0a0a0] leading-relaxed">{concept.deepDive.strategy}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 font-semibold text-[#dcdcaa] mb-0.5">
                            <Scale size={12} />
                            <span>Trade-offs:</span>
                          </div>
                          <p className="text-[#a0a0a0] leading-relaxed">{concept.deepDive.tradeoffs}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filteredConcepts.length === 0 && (
          <div className="p-4 text-center text-[#858585] italic text-[11px]">
            No matching concepts found
          </div>
        )}
      </div>
    </div>
  )
}
