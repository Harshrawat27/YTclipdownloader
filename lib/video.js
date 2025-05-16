import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// Convert HH:MM:SS timestamp to seconds
export const timestampToSeconds = (timestamp) => {
  const [hours, minutes, seconds] = timestamp.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Clip video using ffmpeg
export const clipVideo = (inputFile, timestamps, twitterCompatible = true) => {
  return new Promise((resolve, reject) => {
    // Validate input file
    if (!fs.existsSync(inputFile)) {
      return reject(new Error('Input video file not found'));
    }

    // Create output directory
    const outputDir = path.join(process.cwd(), 'public', 'videos', 'clips');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const clipPromises = timestamps.map((timestamp, index) => {
      return new Promise((resolveClip, rejectClip) => {
        // Parse start and end times
        const [startTime, endTime] = timestamp.split('-');
        const startSeconds = timestampToSeconds(startTime);
        const endSeconds = timestampToSeconds(endTime);
        const duration = endSeconds - startSeconds;

        // Create output filename
        const timestamp = Date.now();
        const outputFilename = `clip_${index + 1}_${startTime.replace(
          /:/g,
          '-'
        )}_to_${endTime.replace(/:/g, '-')}_${timestamp}.mp4`;
        const outputPath = path.join(outputDir, outputFilename);

        // Build FFmpeg command
        let ffmpegArgs;
        if (twitterCompatible) {
          // Twitter-compatible settings (H.264 video, AAC audio)
          ffmpegArgs = [
            '-i',
            inputFile,
            '-ss',
            startSeconds.toString(),
            '-t',
            duration.toString(),
            '-c:v',
            'libx264', // H.264 video codec
            '-c:a',
            'aac', // AAC audio codec
            '-b:a',
            '128k', // Audio bitrate
            '-preset',
            'medium', // Encoding speed/quality tradeoff
            '-profile:v',
            'main', // H.264 profile
            '-level',
            '3.1', // H.264 level
            '-pix_fmt',
            'yuv420p', // Pixel format for maximum compatibility
            outputPath,
          ];
        } else {
          // Fast copy mode (no re-encoding, keeps original codecs)
          ffmpegArgs = [
            '-i',
            inputFile,
            '-ss',
            startSeconds.toString(),
            '-t',
            duration.toString(),
            '-c',
            'copy',
            outputPath,
          ];
        }

        // Execute FFmpeg command
        const ffmpeg = spawn('ffmpeg', ffmpegArgs);

        let stdoutData = '';
        let stderrData = '';

        ffmpeg.stdout.on('data', (data) => {
          stdoutData += data.toString();
        });

        ffmpeg.stderr.on('data', (data) => {
          stderrData += data.toString();
        });

        ffmpeg.on('close', (code) => {
          if (code === 0) {
            resolveClip({
              path: outputPath,
              publicPath: `/videos/clips/${outputFilename}`,
              start: startTime,
              end: endTime,
            });
          } else {
            rejectClip(
              new Error(
                `FFmpeg process exited with code ${code}: ${stderrData}`
              )
            );
          }
        });

        ffmpeg.on('error', (err) => {
          rejectClip(
            new Error(`Failed to spawn FFmpeg process: ${err.message}`)
          );
        });
      });
    });

    Promise.all(clipPromises)
      .then((clips) => resolve(clips))
      .catch((err) => reject(err));
  });
};
