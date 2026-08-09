# Voicebot Architecture Planner

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
- **Top Tab Bar**: Manages multiple open architectures using a Zustand-powered tab store.
- **Editor Area**: Renders the `ArchitectureCanvas` using React Flow for the active tab.

#### State Management (Zustand)
- `useTabStore`: Manages the array of `openTabs` and the `activeTabId`. Handles opening, closing, and switching tabs.
- `useArchitectureStore` (planned): Will handle the synchronization between the canvas and the persistence layer.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
