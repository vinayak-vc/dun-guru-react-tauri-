# DusGuru — Milestones

This file consolidates the project plan into implementation milestones (scaffold → Phase 12).

## Milestone 0 — Project scaffold + core setup
- **Goal**: Create a production-grade kiosk app scaffold (React + Vite + TS) ready for feature work.
- **Deliverables**
  - Vite React TypeScript project initialized
  - TailwindCSS configured (kiosk-first: full-height layout, dark by default)
  - Folder architecture:
    - `src/components/`
    - `src/screens/`
    - `src/store/`
    - `src/services/`
    - `src/models/`
    - `src/router/`
    - `src/hooks/`
    - `src/utils/`
  - Absolute imports configured (TS path aliases)
  - React Query provider mounted at app root
  - Router bootstrapped + base fullscreen layout component
- **Acceptance checks**
  - App runs locally and renders a fullscreen layout without scroll glitches
  - Tailwind styles are applied globally (black bg, white text)

## Milestone 1 — Phase 2: Data model + API layer
- **Goal**: Define types, fetch app data, normalize API response safely.
- **Deliverables**
  - TypeScript models: `AppData`, `Button`, `Trailer`, `GalleryItem` (null-safe)
  - Axios client: baseURL, timeout, error handling (`services/api.ts`)
  - React Query hook: `useAppData()` (loading + error states)
  - Normalization: `getAppData(response)` returning cleaned `appData`
- **Acceptance checks**
  - No hardcoded UI data (all comes from API/hook)
  - Defensive null checks prevent runtime crashes on partial payloads

## Milestone 2 — Phase 3: Global state (Zustand)
- **Goal**: Centralize navigation + selected domain objects.
- **Deliverables**
  - `store/appStore.ts` with state:
    - `currentScreen`
    - `selectedButton`
    - `selectedGalleryItem`
    - `selectedIndex`
  - Actions:
    - `setScreen(screen)`
    - `setButton(button)`
    - `setGalleryItem(item)`
    - `reset()`
- **Acceptance checks**
  - Store stays minimal (no transient UI state)
  - Types are enforced (no `any`)

## Milestone 3 — Phase 4: Navigation system (state-driven)
- **Goal**: Render screens from state rather than URL-driven navigation.
- **Deliverables**
  - `AppRouter.tsx` that switches screens by Zustand `currentScreen`:
    - HOME → `HomeScreen`
    - VIDEO → `VideoScreen`
    - GALLERY → `GalleryScreen`
    - DETAIL → `DetailScreen`
  - Basic transition handling (fade optional) without re-render flicker
- **Acceptance checks**
  - Changing `currentScreen` updates the visible screen reliably
  - No heavy reliance on URL params for kiosk navigation

## Milestone 4 — Phase 5: Base UI system (design foundation)
- **Goal**: Build reusable UI components aligned with kiosk design.
- **Deliverables**
  - Global styles: black background, white text, font smoothing
  - Reusable components:
    - `ButtonCard`
    - `ScreenContainer`
    - `SectionTitle`
    - `Divider`
    - `ImageView`
  - Utility class patterns:
    - flex-centering helpers
    - hidden scrollbars where needed
- **Acceptance checks**
  - Consistent spacing/typography across screens
  - No inline styles; Tailwind-first implementation

## Milestone 5 — Phase 6: Screen 1 (HOME)
- **Goal**: Implement the HOME design (Screen 1) with real API data.
- **Deliverables**
  - `HomeScreen.tsx` matching the mock:
    - logo at top
    - title + subtitle + description
    - dynamic button thumbnail list (cards)
  - Interaction:
    - click a button → set `selectedButton` → navigate to VIDEO
  - Performance: lazy image loading
- **Acceptance checks**
  - No hardcoded values; spacing matches mock closely
  - Click targets are clearly tappable (kiosk)

## Milestone 6 — Phase 7: Screen 2 (VIDEO)
- **Goal**: Implement video player + gallery entry and thumbnail strip.
- **Deliverables**
  - `VideoScreen.tsx`
  - `VideoPlayer.tsx` (autoplay, error handling)
  - `ThumbnailStrip.tsx`
  - Interaction:
    - video end → navigate to GALLERY
    - thumbnail click → navigate to GALLERY with selected index
- **Acceptance checks**
  - Smooth playback; no flicker on state updates
  - Handles missing/failed video URLs gracefully

## Milestone 7 — Phase 8: Screen 3 (GALLERY)
- **Goal**: Implement gallery item view with correct text wrapping and image scaling.
- **Deliverables**
  - `GalleryScreen.tsx`:
    - large image
    - title + short description + divider + long description
  - Interaction:
    - click image → navigate to DETAIL
- **Acceptance checks**
  - Long text wraps cleanly at kiosk resolution
  - Image scaling remains consistent across items

## Milestone 8 — Phase 9: Screen 4 (DETAIL)
- **Goal**: Implement detailed view with metadata hierarchy.
- **Deliverables**
  - `DetailScreen.tsx`:
    - full image
    - metadata: accession, period/origin, credit, more detail URL
- **Acceptance checks**
  - Typography and spacing are clean and readable from distance

## Milestone 9 — Phase 10: Tauri integration (Windows EXE)
- **Goal**: Package kiosk as a Windows executable with locked-down window behavior.
- **Deliverables**
  - Tauri initialized + build config for Windows EXE
  - Fullscreen on launch
  - Devtools disabled in production builds
  - Window configuration:
    - fullscreen
    - non-resizable
    - (optional) no decorations
- **Acceptance checks**
  - `tauri build` produces a working Windows executable
  - Production build does not expose devtools

## Milestone 10 — Phase 11: Performance optimization
- **Goal**: Ensure smooth UX with large image datasets.
- **Deliverables**
  - Lazy image loading across screens
  - Memoization where it reduces unnecessary re-renders
  - Video handling optimized (startup/cleanup)
  - Clear loading states + graceful API error UI
- **Acceptance checks**
  - Screen transitions remain smooth under larger datasets
  - Error states do not break navigation flow

## Milestone 11 — Phase 12: Pixel-perfect refinement
- **Goal**: Match the provided mock screens exactly without changing logic.
- **Deliverables**
  - Spacing, typography, alignment, colors refined using Tailwind only
  - Visual polish passes “pixel-perfect” review against the mock images
- **Acceptance checks**
  - No behavioral/logic changes introduced (UI-only adjustments)
  - Screens visually match the mock at target kiosk resolution

