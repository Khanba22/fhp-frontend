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

    // Call backend API to get analysis results
    const response = await fetch(`${BACKEND_BASE_URL}/api/analysis/${jobId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Job not found" },
          { status: 404 }
        );
      }
      if (response.status === 400) {
        return NextResponse.json(
          { error: "Job not completed yet" },
          { status: 400 }
        );
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Backend error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      jobId: data.job_id,
      status: data.status,
      categorized_issues: data.categorized_issues || {},
      document_name: data.document_name || 'Unknown Document',
      total_issues: data.total_issues || 0,
      analysis_date: data.analysis_date
    });
    
  } catch (error) {
    console.error("Error getting analysis results:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get analysis results",
      },
      { status: 500 }
    );
  }
}
