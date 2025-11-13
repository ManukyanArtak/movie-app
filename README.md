# Movie Explorer

A modern movie discovery app built with React, TypeScript, and the TMDb API.

## Features

- Browse popular movies with infinite scroll
- Search movies by title
- Filter by genre
- View movie details, cast, and trailers
- Save favorites to localStorage
- Responsive design

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create environment variables:

Copy `.env.example` to `.env.local` and fill in your TMDb API credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your TMDb Access Token. Get your token from [TMDb API Settings](https://www.themoviedb.org/settings/api).

**Environment Variables:**

- `VITE_TMDB_ACCESS_TOKEN` (Required) - Your TMDb API Bearer token
- `VITE_API_BASE_URL` (Optional) - TMDb API base URL (default: `https://api.themoviedb.org/3`)
- `VITE_IMAGE_BASE_URL` (Optional) - Image base URL for posters (default: `https://image.tmdb.org/t/p/w500`)
- `VITE_BACKDROP_BASE_URL` (Optional) - Backdrop image base URL (default: `https://image.tmdb.org/t/p/original`)

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router 7
- TMDb API
