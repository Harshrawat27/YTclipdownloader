'use client';

import { useState } from 'react';
import { FiDownload, FiYoutube } from 'react-icons/fi';

export default function VideoDownloader({
  onVideoDownloaded,
  setLoading,
  setError,
}) {
  const [url, setUrl] = useState('');
  const [resolution, setResolution] = useState('1080');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          resolution,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to download video');
      }

      const data = await response.json();
      onVideoDownloaded(data);
    } catch (error) {
      setError(
        error.message || 'An error occurred while downloading the video'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label htmlFor='youtube-url' className='block mb-2 font-medium'>
            YouTube Video URL
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <FiYoutube className='text-gray-400' />
            </div>
            <input
              id='youtube-url'
              type='text'
              className='input pl-10'
              placeholder='https://www.youtube.com/watch?v=...'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor='resolution' className='block mb-2 font-medium'>
            Maximum Resolution
          </label>
          <select
            id='resolution'
            className='input'
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
          >
            <option value='360'>360p</option>
            <option value='480'>480p</option>
            <option value='720'>720p</option>
            <option value='1080'>1080p (HD)</option>
            <option value='1440'>1440p (2K)</option>
            <option value='2160'>2160p (4K)</option>
          </select>
        </div>

        <button
          type='submit'
          className='btn w-full flex items-center justify-center gap-2'
        >
          <FiDownload />
          Download Video
        </button>
      </form>

      <div className='mt-6 text-sm text-gray-500'>
        <p className='font-medium mb-1'>Note:</p>
        <ul className='list-disc pl-5 space-y-1'>
          <li>Only YouTube videos are supported</li>
          <li>Downloaded videos are temporarily stored on the server</li>
          <li>Higher resolutions may take longer to download</li>
        </ul>
      </div>
    </div>
  );
}
