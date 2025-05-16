YouTube Video Clipper
A Next.js 15 application with a clean black and white UI for downloading YouTube videos and creating clips from specific timestamps.
Features

Download YouTube videos with selectable resolution
Create clips from video using timestamp ranges
Option to optimize clips for social media (Twitter/X compatible)
Preview and download individual clips
Clean, responsive black and white UI

Prerequisites
Before running this application, make sure you have the following installed:

Node.js (v18.0.0 or higher)
FFmpeg - for video processing
yt-dlp - for YouTube video downloading

Installing FFmpeg
On macOS:
bashbrew install ffmpeg
On Ubuntu/Debian:
bashsudo apt update
sudo apt install ffmpeg
On Windows:

Download from ffmpeg.org
Add to your PATH environment variable

Installing yt-dlp
On macOS:
bashbrew install yt-dlp
On Ubuntu/Debian:
bashsudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
On Windows:

Download from yt-dlp releases
Add to your PATH environment variable

Getting Started

Clone the repository:

bashgit clone https://github.com/yourusername/youtube-clipper.git
cd youtube-clipper

Install dependencies:

bashnpm install

Run the development server:

bashnpm run dev

Open http://localhost:3000 in your browser

Building for Production
bashnpm run build
npm start
Project Structure
youtube-clipper/
├── app/
│ ├── page.js # Main page with UI
│ ├── layout.js # Root layout with Tailwind setup
│ ├── globals.css # Global styles
│ ├── api/
│ │ ├── download/route.js # API route for downloading YouTube videos
│ │ ├── clip/route.js # API route for clipping videos
│ │ ├── view/route.js # API route for viewing clips
│ │ └── download-clip/route.js # API route for downloading clips
├── components/
│ ├── VideoDownloader.jsx # Component for video downloading
│ └── VideoClipper.jsx # Component for video clipping
├── lib/
│ ├── youtube.js # Utility functions for YouTube operations
│ └── video.js # Utility functions for video operations
├── public/
│ └── videos/ # Directory to store downloaded/clipped videos
├── package.json # Project dependencies
└── tailwind.config.js # Tailwind CSS configuration
Technologies Used

Next.js 15
React
Tailwind CSS
FFmpeg
yt-dlp / ytdl-core
React Icons

License
MIT
Notes

Downloaded videos and clips are stored in the public/videos directory
For production use, consider implementing authentication and storage limitations
This application is for educational purposes only
