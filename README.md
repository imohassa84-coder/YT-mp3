# Lyrics Proxy (for Floating Lyrics)

This small project runs a local Node.js proxy to call the Genius API and scrape lyrics server-side so the browser doesn't hit CORS restrictions.

Quick start (Windows PowerShell):

```powershell
cd c:\Users\Acer\Downloads\test
npm install
npm start
# open http://localhost:3000/index.html in your browser
```

Notes:

- You can set the Genius API token via the environment variable `GENIUS_API_TOKEN` before starting the server.
- The proxy serves the static `index.html` and exposes `/api/search?artist=...&song=...`.

## YouTube search/playback

This project can search YouTube and play results in the app. To enable that you need a YouTube Data API key.

How to get a YouTube Data API key:

1. Go to https://console.cloud.google.com/ and sign in with your Google account.
2. Create or select a project.
3. In the left menu, go to "APIs & Services" → "Library" and enable the "YouTube Data API v3".
4. Go to "APIs & Services" → "Credentials" and click "Create Credentials" → "API key".
5. Copy the generated API key.

Set the API key before starting the app (PowerShell):

```powershell
$env:YOUTUBE_API_KEY = 'YOUR_API_KEY_HERE'
npm run desktop
```

Or set it for server-only mode:

```powershell
$env:YOUTUBE_API_KEY = 'YOUR_API_KEY_HERE'
npm start
```

If the API key is not set the YouTube search feature will return an error message in the UI.
