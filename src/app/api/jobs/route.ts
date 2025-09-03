import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";

    // Call backend API to list jobs
    const response = await fetch(`${BACKEND_BASE_URL}/api/jobs?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Backend error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the data to match frontend expectations
    const jobs = data.map((job: any) => ({
      job_id: job.job_id,
      status: job.status,
      progress: job.progress || 0,
      message: job.message || '',
      result: job.result,
      created_at: job.created_at,
      updated_at: job.updated_at
    }));
    
    return NextResponse.json({
      success: true,
      jobs: jobs,
      total: jobs.length
    });
    
  } catch (error) {
    console.error("Error listing jobs:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to list jobs",
        jobs: [],
        total: 0
      },
      { status: 500 }
    );
  }
}
