# 🎬 Movie Explorer App

A production-grade, cinematic mobile application built from scratch using **React Native**, **Expo**, and the **TMDB API**.

---

## 📱 Features Overview

### 1. 🍿 Home Screen (Popular Movies)
- **Virtualized List Rendering:** Utilizes React Native's `FlatList` with `React.memo` and `useCallback` for buttery 60 FPS scrolling.
- **Infinite Scrolling (Pagination):** Automatically fetches consecutive pages (Page 2, 3, etc.) as the user scrolls.
- **Duplicate Prevention:** Implements synchronous locking using `useRef` and defensive ID deduplication with `Set` to prevent duplicate pagination requests.
- **Pull-to-Refresh:** Pulling down fetches fresh trending movies while preserving existing data if the network fails.
- **Loading & Error States:** Native `ActivityIndicator` and helpful retry mechanisms.

### 2. 🔍 Search Screen
- **Debounced Input (~400ms):** Prevents unnecessary API calls on every keystroke by delaying the request until typing stops for 400ms.
- **Stale Response Protection:** Employs an active closure flag (`isCurrent`) and cleanup handlers to prevent slow out-of-order responses from overwriting newer search queries.
- **Instant Clear Action:** Dedicated `(x)` button to reset query and results in one tap.
- **Empty States:** Clear visual feedback when no matching movies are found.

### 3. 🎬 Movie Details Screen
- **Cinematic Artwork:** Dynamic wide backdrop banner with overlapping poster thumbnail.
- **Comprehensive Metadata:** Release year, formatted rating badge (`⭐ 8.5`), formatted runtime (`⏱️ 2h 25m`), and genre chips.
- **Full Storyline:** Scrollable synopsis with defensive fallbacks for missing descriptions.
- **Seamless Navigation:** Native Stack transition with zero white-screen flash.

### 4. 💖 Favourites Tab & Offline Storage
- **Local Persistence:** Uses `@react-native-async-storage/async-storage` to permanently persist saved movies on the device.
- **Global State Synchronization:** Centralized `FavouritesContext` keeps favorite status synced across Home, Search, Details, and Favourites tabs.
- **Offline Resilience:** Previously saved favorite movies remain fully viewable and accessible even when the device is completely offline (Airplane mode).
- **Consistent Indicators:** Card-level ❤️ indicators show saved status everywhere.

---

## 🛠️ Technology Stack

- **Framework:** React Native (0.88) with Expo (SDK 58)
- **Language:** JavaScript & JSX
- **Navigation:** React Navigation v7 (Native Stack & Bottom Tabs)
- **Icons:** `@expo/vector-icons` (Ionicons)
- **Local Storage:** `@react-native-async-storage/async-storage`
- **API:** TMDB (The Movie Database) REST API v3
- **Network Resilience:** Native `fetch` with `AbortController` timeouts

---

## 📂 Project Structure

```text
src/
├── components/
│   └── MovieCard.jsx          # Reusable, memoized movie card with favorite indicator
├── context/
│   └── FavouritesContext.jsx   # Global state and AsyncStorage persistence
├── navigation/
│   └── AppNavigator.jsx       # Root Native Stack wrapping Bottom Tabs
├── screens/
│   ├── HomeScreen.jsx          # Trending movies with pagination & pull-to-refresh
│   ├── SearchScreen.jsx        # Debounced movie search
│   ├── MovieDetailsScreen.jsx  # Full details, backdrop, genres, runtime & toggle
│   └── FavouritesScreen.jsx    # Offline saved collection & empty state
└── services/
    └── movieApi.js            # TMDB API service layer with AbortController timeouts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or v20+)
- npm
- **Expo Go** app installed on your physical Android or iOS device

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YashAstro11/Zovli.git
   cd Movie_Explorer_App
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and insert your TMDB API key:
     ```env
     EXPO_PUBLIC_TMDB_API_KEY=your_actual_tmdb_api_key_here
     ```

4. **Start the development server:**
   ```bash
   npx expo start
   ```

5. **Run on your device:**
   - Scan the QR code in the terminal using the **Expo Go** app (Android) or Camera app (iOS).

---

## 🛡️ Network Resilience & Fallbacks

- Requests are wrapped with a **10-second `AbortController` timeout** to prevent indefinite hanging on slow connections.
- Missing posters automatically fall back to placeholder graphics.
- Missing release dates, runtimes, and synopses are safely displayed with graceful fallback text.
- Existing movie lists are preserved during failed refreshes.

---

## 📜 Attribution

This product uses the **TMDB API** but is not endorsed or certified by TMDB.
