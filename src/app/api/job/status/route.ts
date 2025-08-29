import { NextRequest, NextResponse } from 'next/server';

// Mock job statuses - in real implementation, this would query your backend
const mockJobStatuses: Record<string, { status: string; message?: string; progress?: number }> = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    // Initialize job status if it doesn't exist
    if (!mockJobStatuses[jobId]) {
      mockJobStatuses[jobId] = { status: 'pending', progress: 0 };
    }
    
    // Simulate job progression
    const job = mockJobStatuses[jobId];
    
    if (job.status === 'pending') {
      // Simulate job starting after a few checks
      if (Math.random() > 0.7) {
        job.status = 'processing';
        job.progress = 25;
      }
    } else if (job.status === 'processing') {
      // Simulate job completion after some time
      if (Math.random() > 0.8) {
        job.status = 'completed';
        job.progress = 100;
      } else {
        // Increment progress
        job.progress = Math.min(95, (job.progress || 0) + Math.random() * 20);
      }
    }
    
    // Simulate occasional failures (for testing)
    if (Math.random() > 1 && job.status !== 'completed') {
      job.status = 'failed';
      job.message = 'Simulated failure for testing purposes';
    }
    
    return NextResponse.json({
      success: true,
      jobId: jobId,
      status: job.status,
      progress: job.progress,
      message: job.message
    });
    
  } catch (error) {
    console.error('Error checking job status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check job status' 
      },
      { status: 500 }
    );
  }
}
