# DusGuru Kiosk Application

## Overview

This project is a kiosk application built using a modern stack of technologies: **Vite**, **React**, **TypeScript**, **Tailwind CSS**, **React Query**, **React Router**, and **Zustand**. It serves as a scaffold for a multi-screen interactive kiosk experience.

## Getting Started

Follow these steps to set up and run the development environment:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy the provided example file to create your local environment file:
   ```bash
   cp .env.example .env
   ```
   Ensure your API base URL is correctly set in the `.env` file using the `VITE_API_BASE_URL` variable.

3. **Run the Application:**
   ```bash
   npm run dev
   ```

## Build (Web)

```bash
npm run build
```

Output: `dist/`

## Build Windows `.exe` (Tauri)

This repo is already configured for **Tauri** (see `src-tauri/`).

### Prerequisites (Windows)

- **Rust + Cargo** (install via rustup)
- **Microsoft Visual Studio Build Tools** with “Desktop development with C++”
- **WebView2 Runtime** (usually already installed on Windows 10/11)

### Build command

```bash
npx tauri build
```

### Output locations (common)

- NSIS installer: `src-tauri/target/release/bundle/nsis/*.exe`
- MSI (if enabled): `src-tauri/target/release/bundle/msi/*.msi`

### Troubleshooting

- **`program not found` / cargo not recognized**
  - Close all terminals and **restart Cursor / PowerShell** so PATH refreshes.
  - Verify:
    ```bash
    where cargo
    cargo --version
    ```

- **`can't find library dusguru_kiosk_lib`**
  - This is fixed in this repo by adding `src-tauri/src/lib.rs` and having `src-tauri/src/main.rs` call `dusguru_kiosk_lib::run()`.

## Project Structure and Milestones

This application is structured to follow a phased development approach, as detailed in the project documentation.

**Current Milestone (Milestone 0):**
The core scaffold is complete, providing the basic UI structure and state management foundation.

**Next Steps:**
The next milestone involves implementing the API models and integrating the data layer based on the specifications outlined in the Project Documentation files.
