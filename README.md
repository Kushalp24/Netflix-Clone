# CineFlix

CineFlix is a dark, cinematic movie discovery app. Browse what is trending, popular, top rated and upcoming, read full movie details with cast, watch trailers on YouTube, and keep a personal watchlist that is saved to your account.

Movie data and images come from the TMDB API. Accounts and watchlists are handled by Firebase.

## Screenshots

| Home | Movie details |
| --- | --- |
| _Add `docs/screenshots/home.png`_ | _Add `docs/screenshots/details.png`_ |

| Search | My List |
| --- | --- |
| _Add `docs/screenshots/search.png`_ | _Add `docs/screenshots/watchlist.png`_ |

## Features

- Featured banner with title, rating, release year, **Explore movie** and **Watch trailer** buttons
- Horizontally scrolling rows: Trending this week (ranked), Popular, Top rated and Upcoming
- Movie details page with backdrop, poster, overview, release date, runtime, rating, genres, director and cast
- Trailer lookup through the TMDB videos endpoint, opened on YouTube
- Search by title with ratings, release years, an empty state and "Show more results"
- Email and password sign up, sign in and sign out with form validation and clear error messages
- Personal watchlist stored per user in Firestore, with add and remove from cards and the details page
- Protected My List page and secure Firestore rules
- Responsive layout for desktop, tablet and mobile, keyboard focus styles and reduced motion support

## Tech stack

- React 18 with functional components and hooks
- Vite
- React Router DOM
- Firebase Authentication and Cloud Firestore
- TMDB API
- Lucide React icons
- HTML5 and CSS3

## Project structure

```
src/
  components/   Header, Footer, MovieCard, MovieRow, MovieGrid, Hero, TrailerButton,
                ProtectedRoute, Logo, Spinner, Toast, StateMessage
  context/      AuthContext.jsx, WatchlistContext.jsx
  pages/        Home, Login, Signup, MovieDetails, Search, Watchlist, NotFound, AuthLayout
  lib/          firebase.js, tmdb.js, format.js, authErrors.js
  App.jsx
  main.jsx
  styles.css
public/assets/  logo.svg
firestore.rules
vercel.json
```

## Installation

You need Node.js 18 or newer.

```bash
git clone https://github.com/<your-username>/cineflix.git
cd cineflix
npm install
cp .env.example .env
```

On Windows PowerShell, use `copy .env.example .env`.

## TMDB API setup

1. Create a free account at <https://www.themoviedb.org/signup>.
2. Open **Settings > API** and request an API key (choose the developer option and fill in the short form).
3. Copy the value labelled **API Key** (the v3 key, not the Read Access Token).
4. Paste it into `.env`:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
```

## Firebase setup

1. Go to the [Firebase console](https://console.firebase.google.com/) and click **Add project**.
2. In **Project settings > General**, under **Your apps**, add a **Web app**. Copy the config values it shows.
3. Paste them into `.env`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

4. Open **Build > Authentication > Sign-in method** and enable **Email/Password**.
5. Open **Build > Firestore Database**, click **Create database** and pick a region.
6. Open the **Rules** tab, replace the contents with the rules below and click **Publish**.

### Firestore security rules

The same rules are saved in `firestore.rules`.

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Each signed-in user can read and write only their own watchlist.
    match /users/{userId}/watchlist/{movieId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Everything else is closed.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Watchlist entries are stored at `users/{uid}/watchlist/{movieId}`.

## Run locally

```bash
npm run dev
```

The app opens at <http://localhost:5173>. Restart the dev server after changing `.env`.

## Production build

```bash
npm run build
npm run preview
```

The optimized site is created in the `dist` folder.

## Publish to GitHub

1. Create an empty repository on GitHub (do not add a README or .gitignore there).
2. Run these commands in the project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/cineflix.git
git push -u origin main
```

The `.gitignore` file keeps `.env` and `node_modules` out of the repository, so your keys are not published.

## Deploy to Vercel

1. Push the project to GitHub (see above).
2. Sign in at <https://vercel.com> and click **Add New > Project**, then import the repository.
3. Vercel detects Vite automatically. Keep the defaults: build command `npm run build`, output directory `dist`.
4. Under **Environment Variables**, add every variable from `.env.example` with your real values.
5. Click **Deploy**.
6. In the Firebase console, open **Authentication > Settings > Authorized domains** and add your Vercel domain (for example `cineflix.vercel.app`) so sign in works on the live site.

`vercel.json` rewrites all routes to `index.html`, so links such as `/movie/550` work when opened directly or refreshed.

## Troubleshooting

- **Rows show "The TMDB API key is missing"**: check that `.env` exists, the variable name starts with `VITE_`, and the dev server was restarted.
- **Sign in shows "Firebase is not configured"**: fill in the Firebase values in `.env` and restart.
- **"Your list did not load"**: confirm Firestore is created and the rules above are published.
- **Sign in fails on the deployed site**: add the deployed domain to Firebase authorized domains.

## Credits

Movie information and images are provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
