import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoPath = searchParams.get('path');

    if (!videoPath) {
      return NextResponse.json(
        { message: 'Video path is required' },
        { status: 400 }
      );
    }

    // Validate path to prevent directory traversal attacks
    const normalizedPath = path.normalize(videoPath);

    if (!fs.existsSync(normalizedPath)) {
      return NextResponse.json(
        { message: 'Video file not found' },
        { status: 404 }
      );
    }

    // Get filename for the Content-Disposition header
    const filename = path.basename(normalizedPath);

    // Create readable stream
    const videoStream = fs.createReadStream(normalizedPath);

    // Get file stats
    const stat = fs.statSync(normalizedPath);
    const fileSize = stat.size;

    // Return appropriate headers for download
    const headers = {
      'Content-Type': 'video/mp4',
      'Content-Length': fileSize,
      'Content-Disposition': `attachment; filename="${filename}"`,
    };

    return new NextResponse(videoStream, { headers });
  } catch (error) {
    console.error('Error downloading video:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to download video' },
      { status: 500 }
    );
  }
}
