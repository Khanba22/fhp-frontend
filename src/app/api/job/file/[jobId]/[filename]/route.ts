import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string; filename: string } }
) {
  try {
    const { jobId, filename } = params;

    if (!jobId || !filename) {
      return NextResponse.json(
        { error: "Job ID and filename are required" },
        { status: 400 }
      );
    }

    // Call backend API to download specific file
    const response = await fetch(`${BACKEND_BASE_URL}/api/job/${jobId}/file/${filename}`, {
      method: 'GET',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 }
        );
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Backend error: ${response.status}`);
    }

    // Get file data and content type
    const fileData = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    // Return file
    return new NextResponse(fileData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
    
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to download file",
      },
      { status: 500 }
    );
  }
}
