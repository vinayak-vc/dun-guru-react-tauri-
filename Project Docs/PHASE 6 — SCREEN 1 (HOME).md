PHASE 6 — SCREEN 1 (HOME)

Implement HOME screen.

Figma screenshot : "H:\Ai_Project\DusGuru\UI\Screen 1.png".

---

DATA:

appData.name
appData.description
appData.buttons[]

---

UI REQUIREMENTS:

- Centered layout
- Logo at top
- Title (large bold)
- Subtitle
- Description text
- Dynamic button list

---

COMPONENTS:

- ButtonCard (image + text)

---

INTERACTION:

- On click:
  → set selectedButton
  → navigate to VIDEO

---

PERFORMANCE:

- Lazy load images

---

OUTPUT:

- HomeScreen.tsx

---

IMPORTANT:

- Match Figma spacing exactly
- Use Tailwind (no CSS files)
- Do not hardcode values