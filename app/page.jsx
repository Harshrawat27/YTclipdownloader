'use client';

import { useState } from 'react';
import VideoDownloader from '@/components/VideoDownloader';
import VideoClipper from '@/components/VideoClipper';

export default function Home() {
  const [downloadedVideo, setDownloadedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('download');

  const handleVideoDownloaded = (videoInfo) => {
    setDownloadedVideo(videoInfo);
    setActiveTab('clip');
    setError('');
  };

  return (
    <div>
      <header className='mb-10'>
        <h1 className='text-4xl font-bold text-center'>
          YouTube Video Clipper
        </h1>
        <p className='text-center text-gray-600 mt-2'>
          Download and clip YouTube videos with precision
        </p>
      </header>

      <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
        <div className='flex border-b border-gray-200 mb-6'>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'download'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('download')}
          >
            Download Video
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'clip'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500'
            } ${!downloadedVideo ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => downloadedVideo && setActiveTab('clip')}
            disabled={!downloadedVideo}
          >
            Clip Video
          </button>
        </div>

        {activeTab === 'download' ? (
          <VideoDownloader
            onVideoDownloaded={handleVideoDownloaded}
            setLoading={setLoading}
            setError={setError}
          />
        ) : (
          <VideoClipper
            videoInfo={downloadedVideo}
            setLoading={setLoading}
            setError={setError}
          />
        )}

        {error && (
          <div className='bg-red-50 text-red-700 p-4 mt-4 rounded-md'>
            {error}
          </div>
        )}

        {loading && (
          <div className='flex justify-center items-center mt-6'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black'></div>
          </div>
        )}
      </div>
    </div>
  );
}
