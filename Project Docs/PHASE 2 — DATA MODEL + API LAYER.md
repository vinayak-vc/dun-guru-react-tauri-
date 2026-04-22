PHASE 2 — DATA MODEL + API LAYER

Now implement the API and data layer.

We are consuming a REST API that returns structured JSON.

---

TASKS:

1. Create TypeScript models for:

- AppData
- Button
- Trailer
- GalleryItem

Make them flexible (nullable-safe)

---

2. Create API service using axios:

services/api.ts

- baseURL config
- error handling
- timeout

---

3. Create data fetch hook using React Query:

useAppData()

- fetch API
- cache data
- handle loading + error states

---

4. Add a normalization layer:

We only care about a specific object:
data[i].buttons[0]._id == TARGET_ID

Create a function:

getAppData(response) → returns cleaned appData

---

OUTPUT:

- types.ts
- api.ts
- useAppData.ts
- normalization function

---

IMPORTANT:

- No hardcoded data
- Defensive coding (null checks)
- Clean separation of concerns