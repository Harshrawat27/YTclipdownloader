import { NextResponse } from 'next/server';
import { clipVideo } from '@/lib/video';

export async function POST(request) {
  try {
    const { videoPath, timestamps, twitterCompatible } = await request.json();

    if (!videoPath) {
      return NextResponse.json(
        { message: 'Video path is required' },
        { status: 400 }
      );
    }

    if (!timestamps || !timestamps.length) {
      return NextResponse.json(
        { message: 'At least one timestamp range is required' },
        { status: 400 }
      );
    }

    const clips = await clipVideo(videoPath, timestamps, twitterCompatible);

    return NextResponse.json({ clips });
  } catch (error) {
    console.error('Error clipping video:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to clip video' },
      { status: 500 }
    );
  }
}
