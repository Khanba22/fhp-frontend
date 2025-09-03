import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const draftReport = formData.get('draftReport') as File;
    const coverDocument = formData.get('coverDocument') as File;
    const apiKey = formData.get('apiKey') as string || process.env.GEMINI_API_KEY || '';

    if (!draftReport) {
      return NextResponse.json(
        { success: false, error: 'Draft report is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    // Create FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('draft_report', draftReport);
    
    // Add cover document if provided
    if (coverDocument && coverDocument.size > 0) {
      backendFormData.append('cover_document', coverDocument);
    }
    
    backendFormData.append('api_key', apiKey);
    backendFormData.append('model', 'gemini-2.5-flash');

    // Call backend API
    const response = await fetch(`${BACKEND_BASE_URL}/api/upload`, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Backend error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      jobId: data.job_id,
      message: data.message || 'Job started successfully'
    });
    
  } catch (error) {
    console.error('Error starting job:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to start job' 
      },
      { status: 500 }
    );
  }
}
