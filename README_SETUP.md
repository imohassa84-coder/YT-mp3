# YT-mp3 - YouTube Music Downloader & Lyrics Viewer

A modern web application built with Next.js and React that allows users to search for YouTube videos, view lyrics, and download audio files.

## Features

- 🎵 **YouTube Search**: Search for music videos on YouTube in real-time
- 📝 **Lyrics Display**: View song lyrics using the Genius API
- 🎬 **Video Player**: Embedded YouTube player for preview
- 📥 **Audio Download**: Convert and download audio from YouTube videos
- 🌙 **Dark/Light Mode**: Beautiful theme-responsive UI
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **Next.js 16.0.0** - React framework with Turbopack
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4.1.9** - Styling with dark/light mode support
- **Radix UI** - Accessible component library
- **Sonner** - Toast notifications

### Backend
- **Express.js 5.1.0** - Node.js web framework
- **ytdl-core 4.11.5** - YouTube video downloader
- **play-dl 1.9.7** - YouTube stream extractor
- **ffmpeg-static/fluent-ffmpeg** - Audio conversion
- **cheerio** - HTML parsing for lyrics extraction
- **yt-dlp** - System binary for robust YouTube handling

## Project Structure

```
├── app/
│   ├── api/              # Next.js API routes
│   │   ├── convert-to-mp3/
│   │   ├── search-lyrics/
│   │   └── search-youtube/
│   ├── page.tsx          # Main page with grid layout
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles with CSS variables
├── components/
│   ├── music-player.tsx  # YouTube player + download button
│   ├── music-search.tsx  # Search bar + results
│   ├── lyrics-display.tsx
│   └── ui/               # Radix UI components
├── server.js             # Express backend server
└── package.json
```

## Installation

### Prerequisites
- Node.js 18+
- npm or pnpm
- FFmpeg installed globally
- yt-dlp installed globally

### Steps

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up git (if pushing to GitHub)
git init
git config user.email "your-email@example.com"
git config user.name "Your Name"
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YT-mp3.git
git push -u origin main
```

## Running the Application

### Start Backend Server (Express)
```bash
node server.js
# Server runs on http://localhost:3001
```

### Start Frontend (Next.js)
```bash
npm run dev
# App runs on http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

## API Routes

### Frontend Routes (Next.js)
- `POST /api/search-youtube` - Search YouTube videos
- `POST /api/search-lyrics` - Get song lyrics
- `GET/POST /api/convert-to-mp3` - Convert video to MP3

### Backend Routes (Express)
- `GET /api/search?artist=&song=` - Search lyrics via Genius API
- `GET /api/ytmp3?id=VIDEO_ID` - Download video as MP3
- `GET /api/ytmp3-rapid?id=VIDEO_ID` - RapidAPI fallback converter

## Environment Variables

No required environment variables for local development. Optional:
- `GENIUS_API_TOKEN` - For lyrics API (defaults included)
- `PORT` - Backend port (default: 3001)

## Current Status

✅ **Completed**
- YouTube search functionality
- Lyrics API integration
- YouTube IFrame video player
- Dark/light mode UI
- Search results scrolling
- API route proxying

🟡 **In Progress**
- MP3 download optimization (currently uses ytdl-core)
- FFmpeg integration for format conversion

## Troubleshooting

### Server Won't Start
- Check ports 3000 and 3001 are available
- Ensure all dependencies are installed: `npm install --legacy-peer-deps`

### MP3 Download Issues
- Verify yt-dlp is installed: `yt-dlp --version`
- Check FFmpeg installation: `ffmpeg -version`
- Some videos may be region-restricted or unavailable

### YouTube Search Returns No Results
- Check internet connection
- Verify YouTube API can be accessed

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues and questions, please create an issue on GitHub.

---

**Built with ❤️ using Next.js and Express**
