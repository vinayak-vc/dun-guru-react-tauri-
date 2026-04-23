# AI Understanding

Status: `pending confirmation`
Project: `DusGuru`

## Summary

# Codex Aider Bridge App is a local orchestrator that separates **planning and review** from **code execution**. It supports both: an external supervisor CLI flow ( , , etc.) a manual supervisor flow where the active agent session reviews each task directly and the bridge waits for decision JSON fil

## Important Docs

- `README.md`: # DusGuru Kiosk Application ## Overview This project is a kiosk application built using a modern stack of technologies: **Vite**, **React**, **TypeScript**, **Tailwind CSS**, **React Query**, **React Router**, and **Zustand**. It serves as a scaffold for a multi-screen interactive kiosk experience. ## Getting Started Follow these steps to set up and run the development environment: **Install Dependencies:** **Configure Environment Variables:** Copy the provided example file to create your local environment file: Ensure your API base URL is correctly set in the file using the variable.
- `bringe-runtime/README.md`: # Codex Aider Bridge App is a local orchestrator that separates **planning and review** from **code execution**. It supports both: an external supervisor CLI flow ( , , etc.) a manual supervisor flow where the active agent session reviews each task directly and the bridge waits for decision JSON files instead of calling another AI process For the most accurate low-token workflow, use: a pre-written That profile is designed for: Codex supervises, Aider implements, bridge validates. It ships with a **web UI** you can launch by double-clicking , and a CLI you can drive directly from the terminal.
- `.aider.chat.history.md`: # aider chat started at 2026-04-23 12:40:24 Can't initialize prompt toolkit: No Windows console found. C:\Python311\Scripts\aider.EXE --model ...lama/qwen2.5-coder:7b --yes-always --no-pretty --no-stream --no-auto-lint --no-gitignore --no-show-model-warnings --no-browser --no-detect-urls --no-suggest-shell-commands --timeout 960 --edit-format whole --map-refresh manual --message Reply with OK. RULES CRITICAL: edit ONLY the TARGET FILES listed above — do NOT create, reference, inspect, or add any other files to the chat CRITICAL: use the exact absolute path shown — do not change the filename, directory, or extension CRITICAL: stay scoped — do NOT mention, import, or reason about files outside the target list.
- `bringe-runtime/docs/AGENTIC_AI_ONBOARDING.md`: # AGENTIC AI ONBOARDING DOCUMENT ## Codex-Aider Bridge — Project Brief Read this document fully before doing anything. After reading, you will know exactly what this project is, how it works, your role, and what to do next — all in one prompt. The **Codex-Aider Bridge** is a local Flask web application that separates **AI planning/review** (expensive cloud AI like you) from **code execution** (cheap local Ollama LLM via Aider).
- `bringe-runtime/docs/AGENT_CONTEXT.md`: # AGENT_CONTEXT ## Architecture Summary The bridge is a local CLI orchestrator with a strict two-role separation: The loop is strictly sequential and acknowledgement-gated: the supervisor must approve each task before the next one starts. A **web UI** ( ) provides a browser-based front end over the same bridge, enabling setup detection, live task progress, and run history without any terminal interaction. --- ## Module Responsibilities ### Core bridge (CLI) Orchestrates repo scanning, plan acquisition, the sequential task-review loop, logging, git-readiness pre-flight, per-task auto-commit, and CLI argument handling.

## Key Files

- `.env.example`: with line VITE_API_BASE_URL=http://api-shm-kiosk.focalat.com/ exactly (include trailing slash).
- `.gitignore`: Create .gitignore ignoring node_modules, dist, .vite, .env, .env.local, .DS_Store, npm-debug.log*, yarn-debug.log*, yarn-error.log*, pnpm-debug.log*, coverage, .idea, .vscode (keep repo clean for...
- `README.md`: documenting Milestone 0: install deps with npm install, copy .env.example to .env, run npm run dev.
- `index.html`: Create root index.html with <!doctype html>, html lang en, head meta charset utf-8, meta viewport, title DusGuru Kiosk, body containing <div id=root></div>, script type module src=/src/main.tsx.
- `package.json`: for a Vite + React + TypeScript app targeting a Windows kiosk UI.
- `postcss.config.cjs`: exporting module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }.
- `src/app/App.tsx`: exporting default function App returning <AppProviders><AppRouter/></AppProviders>.
- `src/app/providers/AppProviders.tsx`: exporting const AppProviders wrapping children with QueryClientProvider using a module-level const queryClient = new QueryClient({ defaultOptions:{ queries:{ staleTime: 60_000, retry: 1 } } }).
- `src/components/layout/ScreenContainer.tsx`: exporting const ScreenContainer: React.FC<React.PropsWithChildren<{ className?: string }>> applying classes: min-h-screen w-full bg-black text-white flex flex-col.
- `src/components/transition/FadeTransition.tsx`: Export default function FadeTransition(props:{ screenKey: string; children: React.ReactNode; className?: string }).
- `src/hooks/useAppData.ts`: exporting hook useAppData().
- `src/main.tsx`: bootstrapping React 18 createRoot on document.getElementById('root')!.

## Architecture Signals

- Code-review-graph nodes=0, edges=0, files=0
- Code-review-graph flows=0, communities=0

## Context Text

This is the compact context summary that can be reused in later bridge sessions.

```text
PROJECT: DusGuru
SUMMARY: # Codex Aider Bridge App is a local orchestrator that separates **planning and review** from **code execution**. It supports both: an external supervisor CLI flow ( , , etc.) a manual supervisor flow where the active agent session reviews each task directly and the bridge waits for decision JSON fil

DOCUMENTATION SIGNALS:
  README.md
    -> # DusGuru Kiosk Application ## Overview This project is a kiosk application built using a modern stack of technologies: **Vite**, **React**, **TypeScript**, **Tailwind CSS**, **React Query**, **React Router**, and **Zustand**. It serves as a scaffold for a multi-screen interactive kiosk experience. ## Getting Started Follow these steps to set up and run the development environment: **Install Dependencies:** **Configure Environment Variables:** Copy the provided example file to create your local environment file: Ensure your API base URL is correctly set in the file using the variable.
  bringe-runtime/README.md
    -> # Codex Aider Bridge App is a local orchestrator that separates **planning and review** from **code execution**. It supports both: an external supervisor CLI flow ( , , etc.) a manual supervisor flow where the active agent session reviews each task directly and the bridge waits for decision JSON files instead of calling another AI process For the most accurate low-token workflow, use: a pre-written That profile is designed for: Codex supervises, Aider implements, bridge validates. It ships with a **web UI** you can launch by double-clicking , and a CLI you can drive directly from the terminal.
  .aider.chat.history.md
    -> # aider chat started at 2026-04-23 12:40:24 Can't initialize prompt toolkit: No Windows console found. C:\Python311\Scripts\aider.EXE --model ...lama/qwen2.5-coder:7b --yes-always --no-pretty --no-stream --no-auto-lint --no-gitignore --no-show-model-warnings --no-browser --no-detect-urls --no-suggest-shell-commands --timeout 960 --edit-format whole --map-refresh manual --message Reply with OK. RULES CRITICAL: edit ONLY the TARGET FILES listed above — do NOT create, reference, inspect, or add any other files to the chat CRITICAL: use the exact absolute path shown — do not change the filename, directory, or extension CRITICAL: stay scoped — do NOT mention, import, or reason about files outside the target list.
  bringe-runtime/docs/AGENTIC_AI_ONBOARDING.md
    -> # AGENTIC AI ONBOARDING DOCUMENT ## Codex-Aider Bridge — Project Brief Read this document fully before doing anything. After reading, you will know exactly what this project is, how it works, your role, and what to do next — all in one prompt. The **Codex-Aider Bridge** is a local Flask web application that separates **AI planning/review** (expensive cloud AI like you) from **code execution** (cheap local Ollama LLM via Aider).
  bringe-runtime/docs/AGENT_CONTEXT.md
    -> # AGENT_CONTEXT ## Architecture Summary The bridge is a local CLI orchestrator with a strict two-role separation: The loop is strictly sequential and acknowledgement-gated: the supervisor must approve each task before the next one starts. A **web UI** ( ) provides a browser-based front end over the same bridge, enabling setup detection, live task progress, and run history without any terminal interaction. --- ## Module Responsibilities ### Core bridge (CLI) Orchestrates repo scanning, plan acquisition, the sequential task-review loop, logging, git-readiness pre-flight, per-task auto-commit, and CLI argument handling.

FILE REGISTRY (what each file does):
  .env.example
    -> with line VITE_API_BASE_URL=http://api-shm-kiosk.focalat.com/ exactly (include trailing slash).
  .gitignore
    -> Create .gitignore ignoring node_modules, dist, .vite, .env, .env.local, .DS_Store, npm-debug.log*, yarn-debug.log*, yarn-error.log*, pnpm-debug.log*, coverage, .idea, .vscode (keep repo clean for...
  README.md
    -> documenting Milestone 0: install deps with npm install, copy .env.example to .env, run npm run dev.
  index.html
    -> Create root index.html with <!doctype html>, html lang en, head meta charset utf-8, meta viewport, title DusGuru Kiosk, body containing <div id=root></div>, script type module src=/src/main.tsx.
  package.json
    -> for a Vite + React + TypeScript app targeting a Windows kiosk UI.
  postcss.config.cjs
    -> exporting module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }.
  src/app/App.tsx
    -> exporting default function App returning <AppProviders><AppRouter/></AppProviders>.
  src/app/providers/AppProviders.tsx
    -> exporting const AppProviders wrapping children with QueryClientProvider using a module-level const queryClient = new QueryClient({ defaultOptions:{ queries:{ staleTime: 60_000, retry: 1 } } }).
  src/components/layout/ScreenContainer.tsx
    -> exporting const ScreenContainer: React.FC<React.PropsWithChildren<{ className?: string }>> applying classes: min-h-screen w-full bg-black text-white flex flex-col.
  src/components/transition/FadeTransition.tsx
    -> Export default function FadeTransition(props:{ screenKey: string; children: React.ReactNode; className?: string }).
  src/hooks/useAppData.ts
    -> exporting hook useAppData().
  src/main.tsx
    -> bootstrapping React 18 createRoot on document.getElementById('root')!.
  src/models/screen.ts
    -> exporting union type AppScreen = 'HOME' | 'VIDEO' | 'GALLERY' | 'DETAIL'.
  src/models/types.ts
    -> exporting TypeScript types/interfaces for the API domain: AppData, Button, Trailer, GalleryItem.
  src/router/AppRouter.tsx
    -> exporting const AppRouter.
  src/screens/DetailScreen.tsx
    -> exporting const DetailScreen.
  src/screens/GalleryScreen.tsx
    -> exporting const GalleryScreen.
  src/screens/HomeScreen.tsx
    -> exporting const HomeScreen.
  src/screens/VideoScreen.tsx
    -> exporting const VideoScreen.
  src/services/api.ts
    -> exporting an Axios instance apiClient configured with baseURL from getApiBaseUrl(), timeout 10000.
  src/services/normalization.ts
    -> exporting function getAppData(response: unknown, targetButtonId: string): AppData.
  src/store/appStore.ts
    -> using zustand create.
  src/styles/index.css
    -> with Tailwind directives @tailwind base; @tailwind components; @tailwind utilities;.
  src/utils/env.ts
    -> exporting function getApiBaseUrl(): string reading import.meta.env.VITE_API_BASE_URL as string | undefined.
  src/vite-env.d.ts
    -> containing exactly: /// <reference types='vite/client' />.
  tailwind.config.ts
    -> exporting default satisfies Config object.
  tsconfig.json
    -> for Vite React TS using project references pattern.
  tsconfig.node.json
    -> for Vite config typing.
  vite.config.ts
    -> exporting default defineConfig({ plugins:[react()], resolve:{ alias:{ '@': fileURLToPath(new URL('./src', import.meta.url)) } }, server:{ port:5173 } }).

CODE PATTERNS:
  -Code-review-graph nodes=0, edges=0, files=0
  -Code-review-graph flows=0, communities=0

ALREADY IMPLEMENTED: package, vite.config, tsconfig, tsconfig.node, tailwind.config, postcss.config, index, vite-env.d, screen, env, appStore, ScreenContainer, HomeScreen, VideoScreen, GalleryScreen, DetailScreen, AppRouter, AppProviders, App, main, .env, .gitignore, README, types, api, normalization, useAppData, FadeTransition

LAST RUN: 2026-04-23 | 3 tasks | "Milestone 3 fix"
```
