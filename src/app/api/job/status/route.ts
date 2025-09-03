import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Call backend API to get job status
    const response = await fetch(`${BACKEND_BASE_URL}/api/job/${jobId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/csv',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Job not found" },
          { status: 404 }
        );
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Backend error: ${response.status}`);
    }

    // Check if response is 206 (Partial Content) - job completed with file
    if (response.status === 206) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('text/csv')) {
        // Return CSV file with 206 status
        const csvData = await response.text();
        return new NextResponse(csvData, {
          status: 206,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="reconcile_${jobId}.csv"`,
          },
        });
      }
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      job_id: data.job_id,
      status: data.status,
      progress: data.progress || 0,
      message: data.message || '',
      result: data.result,
      created_at: data.created_at,
      updated_at: data.updated_at,
      pdf_path: data.pdf_path,
      fact_file_path: data.fact_file_path,
      output_dir: data.output_dir
    });
    
  } catch (error) {
    console.error("Error checking job status:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to check job status",
      },
      { status: 500 }
    );
  }
}
