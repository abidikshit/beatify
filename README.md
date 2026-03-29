# Beatify

<p align="center">
  <img src="./public/favicon.svg" alt="Beatify logo" width="120" height="120" />
</p>

Beatify is a sleek web music player built with React that helps you discover and stream free, legal tracks from the Jamendo catalog.  
It offers genre browsing, search, liked songs, and a modern player experience in one place.

## Live app

Access Beatify directly here: [https://beatify-music.vercel.app/](https://beatify-music.vercel.app/)

## What this app is for

- Discover new music across many global and Hindi-focused genres
- Stream tracks directly in the browser using Jamendo's public API
- Build a personal liked-song collection saved in local storage
- Enjoy a clean desktop-first music player UI with mobile-friendly navigation

## Features

- One-time Jamendo API key onboarding
- Browse by genre (global + Hindi categories)
- Search by artist/song keyword
- Trending tracks on home screen
- Liked songs library with persistent local storage
- Playback controls: play/pause, next/previous, seek, and volume

## Tech stack

- React
- Vite
- Jamendo API (`/tracks` endpoint)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the local URL shown in terminal (usually `http://localhost:5173`).

## How to use the app

1. Launch Beatify in your browser.
2. On first run, enter your Jamendo Client ID.
3. If you do not have one:
   - Go to [Jamendo Developer](https://developer.jamendo.com)
   - Create a free account
   - Create an app and copy the Client ID
4. After setup:
   - Use **Home** for trending tracks
   - Use **Search** to find tracks/artists
   - Use **Genres** to explore categories (including Hindi-specific genres)
   - Tap/click the heart icon to save tracks in **Liked Songs**
5. Use the bottom player controls for playback and volume.

## Data and storage

- Your Jamendo Client ID is stored in browser local storage.
- Liked tracks are stored in browser local storage.
- No backend server is required for this project.

## Scripts

- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm run preview` - preview production build locally
