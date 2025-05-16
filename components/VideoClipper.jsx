'use client';

import { useState } from 'react';
import {
  FiScissors,
  FiPlus,
  FiTrash2,
  FiPlay,
  FiDownload,
} from 'react-icons/fi';

export default function VideoClipper({ videoInfo, setLoading, setError }) {
  const [timestamps, setTimestamps] = useState([
    { start: '00:00:00', end: '00:01:00' },
  ]);
  const [twitterCompatible, setTwitterCompatible] = useState(true);
  const [clippedVideos, setClippedVideos] = useState([]);

  const addTimestamp = () => {
    setTimestamps([...timestamps, { start: '00:00:00', end: '00:01:00' }]);
  };

  const removeTimestamp = (index) => {
    if (timestamps.length === 1) return;
    setTimestamps(timestamps.filter((_, i) => i !== index));
  };

  const updateTimestamp = (index, field, value) => {
    const newTimestamps = [...timestamps];
    newTimestamps[index][field] = value;
    setTimestamps(newTimestamps);
  };

  const validateTimestamps = () => {
    for (const ts of timestamps) {
      // Check format
      const formatRegex = /^\d{2}:\d{2}:\d{2}$/;
      if (!formatRegex.test(ts.start) || !formatRegex.test(ts.end)) {
        setError('All timestamps must be in HH:MM:SS format');
        return false;
      }

      // Convert to seconds for comparison
      const startParts = ts.start.split(':').map(Number);
      const endParts = ts.end.split(':').map(Number);

      const startSeconds =
        startParts[0] * 3600 + startParts[1] * 60 + startParts[2];
      const endSeconds = endParts[0] * 3600 + endParts[1] * 60 + endParts[2];

      if (startSeconds >= endSeconds) {
        setError('End time must be after start time');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoInfo) {
      setError('No video has been downloaded');
      return;
    }

    if (!validateTimestamps()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/clip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoPath: videoInfo.videoPath,
          timestamps: timestamps.map((ts) => `${ts.start}-${ts.end}`),
          twitterCompatible,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clip video');
      }

      const data = await response.json();
      setClippedVideos(data.clips);
    } catch (error) {
      setError(error.message || 'An error occurred while clipping the video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {videoInfo ? (
        <div className='mb-6'>
          <h3 className='font-medium mb-2'>Downloaded Video</h3>
          <div className='bg-gray-100 p-4 rounded-md'>
            <p className='font-medium'>{videoInfo.title}</p>
            <p className='text-sm text-gray-600 mt-1'>
              Resolution: {videoInfo.resolution}p | Duration:{' '}
              {videoInfo.duration}
            </p>
          </div>
        </div>
      ) : (
        <div className='mb-6 bg-yellow-50 p-4 rounded-md text-yellow-700'>
          No video downloaded. Please download a video first.
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <div className='flex justify-between items-center mb-2'>
            <label className='font-medium'>Clip Timestamps</label>
            <button
              type='button'
              className='text-sm flex items-center gap-1 text-black hover:text-gray-700'
              onClick={addTimestamp}
            >
              <FiPlus size={16} />
              Add Timestamp
            </button>
          </div>

          <div className='space-y-3'>
            {timestamps.map((ts, index) => (
              <div key={index} className='flex gap-2 items-center'>
                <div className='flex-1'>
                  <label className='block text-xs text-gray-500 mb-1'>
                    Start (HH:MM:SS)
                  </label>
                  <input
                    type='text'
                    className='input'
                    placeholder='00:00:00'
                    value={ts.start}
                    onChange={(e) =>
                      updateTimestamp(index, 'start', e.target.value)
                    }
                    pattern='^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'
                    required
                  />
                </div>
                <div className='flex-1'>
                  <label className='block text-xs text-gray-500 mb-1'>
                    End (HH:MM:SS)
                  </label>
                  <input
                    type='text'
                    className='input'
                    placeholder='00:01:00'
                    value={ts.end}
                    onChange={(e) =>
                      updateTimestamp(index, 'end', e.target.value)
                    }
                    pattern='^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'
                    required
                  />
                </div>
                <button
                  type='button'
                  className='mt-6 p-2 text-gray-500 hover:text-red-500'
                  onClick={() => removeTimestamp(index)}
                  disabled={timestamps.length === 1}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='twitter-compatible'
            checked={twitterCompatible}
            onChange={(e) => setTwitterCompatible(e.target.checked)}
            className='h-4 w-4 text-black focus:ring-black border-gray-300 rounded'
          />
          <label htmlFor='twitter-compatible' className='text-sm text-gray-700'>
            Optimize for social media (Twitter/X compatible format)
          </label>
        </div>

        <button
          type='submit'
          className='btn w-full flex items-center justify-center gap-2'
          disabled={!videoInfo}
        >
          <FiScissors />
          Clip Video
        </button>
      </form>

      {clippedVideos.length > 0 && (
        <div className='mt-8'>
          <h3 className='font-medium mb-4'>Clipped Videos</h3>
          <div className='space-y-4'>
            {clippedVideos.map((clip, index) => (
              <div key={index} className='bg-gray-100 p-4 rounded-md'>
                <p className='font-medium mb-2'>
                  Clip {index + 1}: {clip.start} to {clip.end}
                </p>
                <div className='flex justify-between'>
                  <a
                    href={`/api/view?path=${encodeURIComponent(clip.path)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-1 text-sm text-black hover:underline'
                  >
                    <FiPlay size={16} />
                    Play
                  </a>
                  <a
                    href={`/api/download?path=${encodeURIComponent(clip.path)}`}
                    download
                    className='inline-flex items-center gap-1 text-sm text-black hover:underline'
                  >
                    <FiDownload size={16} />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
