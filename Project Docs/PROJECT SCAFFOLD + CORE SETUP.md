You are building a production-grade Windows kiosk application.

Tech Stack:
- React (Vite + TypeScript)
- Tauri (for Windows EXE)
- Zustand (state management)
- React Router (navigation)
- React Query (API caching)
- TailwindCSS (UI)

Goal:
Create a clean, scalable project scaffold with best practices.

---

TASKS:

1. Initialize a Vite React TypeScript project
2. Setup TailwindCSS properly
3. Setup folder architecture:

src/
  components/
  screens/
  store/
  services/
  models/
  router/
  hooks/
  utils/

4. Configure absolute imports using tsconfig paths

5. Setup React Query Provider in root
6. Setup basic React Router structure
7. Create a base layout component (fullscreen container)

8. Configure Tailwind for kiosk UI:
   - disable container queries
   - ensure full height layout (h-screen)
   - dark theme default

---

OUTPUT:

- All config files
- Tailwind setup
- App.tsx setup
- Basic router setup
- Folder structure

---

IMPORTANT:

- Use TypeScript everywhere
- No placeholder junk code
- Keep architecture clean and modular