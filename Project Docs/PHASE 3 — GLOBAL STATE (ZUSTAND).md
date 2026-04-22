PHASE 3 — GLOBAL STATE (ZUSTAND)

Implement global state management using Zustand.

---

APP FLOW:

HOME → VIDEO → GALLERY → DETAIL

---

TASKS:

1. Create store:

store/appStore.ts

State should include:

- currentScreen
- selectedButton
- selectedGalleryItem
- selectedIndex (for navigation)

---

2. Add actions:

- setScreen(screen)
- setButton(button)
- setGalleryItem(item)
- reset()

---

3. Ensure typesafety

---

4. Add derived helpers if needed

---

OUTPUT:

- Zustand store fully implemented

---

IMPORTANT:

- Keep store minimal (no UI state)
- Only global navigation + selected data