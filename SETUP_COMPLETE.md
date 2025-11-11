# YT-mp3 Project - Setup & Running Guide

## 🎉 Project Status

✅ **Complete and Ready to Use!**

Your YouTube Music Downloader & Lyrics Viewer application is fully set up with:
- Modern Next.js + React frontend
- Express.js backend
- YouTube search integration
- Lyrics API (Genius)
- Audio download capability

---

## 🚀 Running the Application

### Prerequisites
- Node.js 18+ installed
- FFmpeg installed globally
- yt-dlp installed globally (for audio download)

### Start Both Servers

**Option 1: Separate Terminal Windows**

Terminal 1 - Backend Server:
```powershell
cd "c:\Users\Acer\Downloads\test"
node server.js
# Runs on http://localhost:3001
```

Terminal 2 - Frontend Server:
```powershell
cd "c:\Users\Acer\Downloads\test"
npm run dev
# Runs on http://localhost:3000
```

**Option 2: Single Command (using npm)**
```powershell
npm run dev  # Runs Next.js on port 3000
# In another terminal:
node server.js  # Runs Express on port 3001
```

---

## 🌐 Access the Application

Once both servers are running, open your browser and go to:

### **http://localhost:3000**

You'll see:
- 🎵 YouTube Music Search (top right)
- 🎬 Embedded YouTube Video Player (center)
- 📝 Song Lyrics Display (left panel)
- 📥 Download Audio Button
- 🌙 Dark/Light Mode Toggle (top right)

---

## ✨ Features

### 1. **YouTube Search**
- Search for any music video
- Real-time results
- Click a result to load the video

### 2. **Video Player**
- Embedded YouTube player
- Play directly in the app
- Autoplay disabled for user preference

### 3. **Lyrics Display**
- Automatic lyrics lookup via Genius API
- Shows song title and artist
- Displays full lyrics if available

### 4. **Audio Download**
- Download button visible when video is loaded
- Saves as WebM audio format
- Downloads with video ID as filename

### 5. **Dark/Light Mode**
- Toggle in top right corner
- Automatic theme detection
- Persistent across sessions

---

## 📁 Project Structure

```
c:\Users\Acer\Downloads\test\
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── convert-to-mp3/       # Audio download endpoint
│   │   ├── search-lyrics/        # Lyrics API endpoint
│   │   └── search-youtube/       # YouTube search endpoint
│   ├── page.tsx                  # Main page (grid layout)
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── music-player.tsx          # Video player + download
│   ├── music-search.tsx          # Search bar + results
│   ├── lyrics-display.tsx        # Lyrics panel
│   ├── theme-provider.tsx        # Dark/light mode
│   └── ui/                       # Radix UI components
├── server.js                     # Express backend
├── package.json                  # Dependencies
└── README_SETUP.md              # Full documentation
```

---

## 🔌 API Endpoints

### Frontend (Next.js) Routes
- `POST /api/search-youtube` - Search YouTube videos
- `POST /api/search-lyrics` - Get song lyrics
- `GET/POST /api/convert-to-mp3` - Download audio

### Backend (Express) Routes
- `GET /api/search?artist=&song=` - Genius lyrics API
- `GET /api/ytmp3?id=VIDEO_ID` - Download video audio
- `GET /api/ytmp3-rapid?id=VIDEO_ID` - RapidAPI fallback

---

## 🛠️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend Framework** | Next.js | 16.0.0 |
| **UI Library** | React | 19.2.0 |
| **UI Components** | Radix UI | Latest |
| **Styling** | Tailwind CSS | 4.1.9 |
| **Backend** | Express.js | 5.1.0 |
| **YouTube API** | ytdl-core | 4.11.5 |
| **Type Safety** | TypeScript | Latest |
| **Audio Processing** | FFmpeg | 8.0 |

---

## 📝 Configuration

### Environment Variables
No required environment variables for local development.

Optional:
- `GENIUS_API_TOKEN` - Lyrics API token (pre-configured)
- `PORT` - Backend port (default: 3001)

### .npmrc Configuration
Already configured with `--legacy-peer-deps` to handle dependency conflicts.

---

## 🐛 Troubleshooting

### Server Won't Start
```powershell
# Kill existing processes
taskkill /F /IM node.exe

# Check ports are free
netstat -ano | findstr ":3000\|:3001"

# Start fresh
node server.js  # Terminal 1
npm run dev     # Terminal 2
```

### YouTube Search Returns Nothing
- Check internet connection
- Verify YouTube is accessible
- Refresh the page

### Download Not Working
- Verify yt-dlp is installed: `yt-dlp --version`
- Check FFmpeg: `ffmpeg -version`
- Some videos may be region-restricted

### Dark Mode Not Working
- Clear browser cache
- Check localStorage is enabled
- Refresh the page

---

## 📤 GitHub Integration

Your code is ready to push to GitHub! Follow these steps:

1. **Create GitHub Personal Access Token**:
   - Go to: https://github.com/settings/tokens
   - Generate new token (classic)
   - Select `repo` scope
   - Copy the token

2. **Push to GitHub**:
   ```powershell
   cd "c:\Users\Acer\Downloads\test"
   git push -u origin main
   ```
   
   When prompted:
   - Username: `imohassa84-coder`
   - Password: Paste your Personal Access Token

3. **Verify**:
   - Visit: https://github.com/imohassa84-coder/YT-mp3
   - All your code should be there!

See `PUSH_TO_GITHUB.md` for detailed instructions.

---

## 🎯 Next Steps

1. ✅ Run the application: `node server.js` + `npm run dev`
2. ✅ Test features at http://localhost:3000
3. ✅ Push to GitHub with your Personal Access Token
4. 🔄 Optional: Deploy to cloud (Vercel, Heroku, etc.)

---

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Verify both servers are running
3. Check browser console for errors (F12)
4. Check terminal output for backend errors

---

**Happy music downloading! 🎵🎉**

Built with ❤️ using Next.js and Express
