# Voicebot Architecture Planner


---

## 📖 [Application Guide (How to Use)](./DOC.md)

---

## Architecture Documentation

### Typed Architecture Schema

The core of the Architecture Planner is a strictly typed JSON schema that defines how voicebot components interact.

#### Socket Types
- `audio`: Streamed or recorded audio data.
- `text`: Natural language text (e.g., ASR output or LLM input).
- `json`: Structured data (e.g., API responses or intent metadata).
- `binary`: Raw binary data (e.g., STT/TTS engine buffers).

#### Core Interfaces
- **Socket**: Defines a connection point with a `type` and `direction` (input/output).
- **Node**: Represents a functional block (e.g., ASR, LLM, TTS) with a list of `sockets`.
- **TypedConnection**: Links an `output` socket of one node to an `input` socket of another, enforcing type compatibility.

### Layout & State Management

#### VS Code IDE Shell
The UI is modeled after the VS Code IDE to provide a familiar and powerful environment for architecture design:
- **Activity Bar**: Switches between the `Explorer` and `Interactive Library`.
- **Sidebar**: Provides collapsible sections for architecture management and educational knowledge base.
- **Auxillary Sidebar**: Provides additional information about components. It opens up on right end of the view.
- **Top Tab Bar**: Manages multiple open architectures using a Zustand-powered tab store.
- **Editor Area**: Renders the `ArchitectureCanvas` using React Flow for the active tab.
- **Status Bar**: A thin bar at bottom which has status for various services and information about current architecture.

#### State Management
- `useTabStore`: Manages the array of `openTabs` and the `activeTabId`. Handles opening, closing, and switching tabs.
- `useArchitectureStore` (planned): Will handle the synchronization between the canvas and the persistence layer.
