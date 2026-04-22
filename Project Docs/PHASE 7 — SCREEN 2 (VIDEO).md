PHASE 7 — SCREEN 2 (VIDEO)

Implement VIDEO screen.
Figma screenshot : "H:\Ai_Project\DusGuru\UI\Screen 2.png".
---

DATA:

button.trailers[0].videoUrl
button.trailers[0].description
button.galleries[]

---

UI:

- Fullscreen video player
- Description below
- Horizontal thumbnail strip

---

COMPONENTS:

- VideoPlayer
- ThumbnailStrip

---

INTERACTION:

- Video ends → go to GALLERY
- Thumbnail click → go to GALLERY with selected index

---

VIDEO RULES:

- autoplay
- muted optional
- handle errors

---

OUTPUT:

- VideoScreen.tsx
- VideoPlayer.tsx
- ThumbnailStrip.tsx

---

IMPORTANT:

- Smooth playback
- No re-render flicker