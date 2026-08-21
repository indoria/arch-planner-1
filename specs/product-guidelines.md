# Product Guidelines - Voicebot Architecture Playground

## Visual Aesthetic: Modern Technical
- **Design Philosophy:** Prioritize clarity, readability, and data density. The interface should feel like a high-end technical dashboard.
- **Color Palette:** Professional neutrals (grays, whites, dark blues) with high-contrast accent colors (e.g., electric blue, vibrant orange) for active states and alerts.
- **Typography:** Clean, sans-serif typefaces for general UI; monospaced fonts for data values and component parameters.

## Tone & Voice: Instructive & Collaborative
- **Communication Style:** The tool acts as a peer mentor—supportive, knowledgeable, and encouraging.
- **Documentation & Tooltips:** Use clear, jargon-free language where possible, but provide technical definitions when necessary to aid learning.
- **Error Messages:** Focused on resolution rather than blame; providing clear paths to fix architectural issues.

## UX Principles
- **Instant Feedback:** Every interaction (tuning a parameter, dragging a component) must result in immediate visual or data feedback to reinforce the cause-and-effect relationship.
- **Non-Destructive Design:** Users should feel free to experiment. Implement robust undo/redo functionality and the ability to save/reset simulation "snapshots."
- **Just-in-Time Learning:** Integrate help markers and tooltips that explain *why* a certain architectural choice might impact performance (e.g., "Increasing LLM context length may increase first-token latency").

## Diagramming & Visualization Standards
- **Standardized Components:** Use a consistent icon set for common voicebot nodes (VAD, ASR, LLM, TTS, Orchestrator) to ensure diagrams are intuitive.
- **Semantic Color Coding:** Use a "traffic light" system or a gradient (e.g., Green to Red) to represent real-time health, latency, or cost metrics.
- **Dynamic Data Flow:** Visualize active call simulations with animated data "packets" moving along connection lines, making the sequence of events and bottlenecks visually obvious.
