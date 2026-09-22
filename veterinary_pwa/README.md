# PetCare Pro - Progressive Web App (PWA) 📱

A modern, mobile-first **Progressive Web Application (PWA)** built with React, Vite, and Service Worker for veterinary doctors, clinic staff, and administrators on-the-go.

## 🌟 Key Features

- **📲 Full PWA Installability**: Installable on Android, iOS (Safari Add to Home Screen), and Desktop with native standalone UI.
- **⚡ Offline-First Architecture (`sw.js`)**: Static caching & IndexedDB/LocalStorage fallback for viewing cached appointments and patient records even with zero internet.
- **🎯 Mobile-First Bottom Navigation**:
  - **Home / Dashboard**: Daily KPIs, today's schedule, quick check-in actions.
  - **Appointments**: Filterable visit manager (Confirmed, Completed, Cancelled) & fast booking modal.
  - **Patients**: Comprehensive pet electronic health records, breed, age, species, and owner details.
  - **Billing & POS**: Fast invoice generator, total collections tracker, receipt summary.
  - **Profile**: Staff details, offline sync triggers, cache management & logout.
- **✨ Quick Action Bottom Sheet (+ button)**: Instant 1-tap shortcuts from any screen.
- **🔗 Direct Backend Integration**: Connects to `veterinary_backend` on `http://localhost:5002`.

---

## 🚀 How to Run Locally

1. Open terminal in the PWA directory:
   ```bash
   cd veterinary_pwa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   The PWA will start on `http://localhost:5175`.

4. Build production bundle:
   ```bash
   npm run build
   ```

---

## 📱 Testing PWA Installation

- **Desktop (Chrome/Edge)**: Look for the install icon in the address bar or click the in-app **"Install"** button.
- **Android (Chrome)**: An install banner / prompt will automatically appear at the bottom.
- **iOS (Safari)**: Tap the **Share** button -> **Add to Home Screen**.
