import { NextResponse } from 'next/server';
import { downloadYouTubeVideo } from '@/lib/youtube';

export async function POST(request) {
  try {
    const { url, resolution } = await request.json();

    if (!url) {
      return NextResponse.json(
        { message: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    const videoInfo = await downloadYouTubeVideo(url, resolution);

    return NextResponse.json(videoInfo);
  } catch (error) {
    console.error('Error downloading video:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to download video' },
      { status: 500 }
    );
  }
}
