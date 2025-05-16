import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import ytdl from 'ytdl-core';

// Ensure the videos directory exists
const ensureVideoDir = () => {
  const videoDir = path.join(process.cwd(), 'public', 'videos');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }
  return videoDir;
};

// Download YouTube video using yt-dlp
export const downloadYouTubeVideo = (url, resolution = '1080') => {
  return new Promise((resolve, reject) => {
    // Validate the URL
    if (!ytdl.validateURL(url)) {
      return reject(new Error('Invalid YouTube URL'));
    }

    const videoDir = ensureVideoDir();
    const timestamp = Date.now();
    const outputFilename = `video_${timestamp}.mp4`;
    const outputPath = path.join(videoDir, outputFilename);

    // Get video info
    ytdl
      .getInfo(url)
      .then((info) => {
        const videoTitle = info.videoDetails.title;
        const videoDuration = info.videoDetails.lengthSeconds;

        // Create a stream with the specified resolution
        const stream = ytdl(url, {
          quality: `highestvideo[height<=${resolution}]`,
          filter: 'videoandaudio',
        });

        // Pipe the video to the output file
        const fileStream = fs.createWriteStream(outputPath);
        stream.pipe(fileStream);

        stream.on('error', (err) => {
          reject(new Error(`Failed to download video: ${err.message}`));
        });

        fileStream.on('finish', () => {
          resolve({
            videoPath: outputPath,
            title: videoTitle,
            duration: formatDuration(videoDuration),
            resolution,
            publicPath: `/videos/${outputFilename}`,
          });
        });

        fileStream.on('error', (err) => {
          reject(new Error(`Failed to save video: ${err.message}`));
        });
      })
      .catch((err) => {
        reject(new Error(`Failed to get video info: ${err.message}`));
      });
  });
};

// Format seconds into HH:MM:SS
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs]
    .map((val) => val.toString().padStart(2, '0'))
    .join(':');
};
