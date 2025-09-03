'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingPopupProps {
  isVisible: boolean;
  jobId: string;
  onComplete: () => void;
  onError: (error: string) => void;
}

interface JobStatus {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  result?: any;
  created_at?: string;
  updated_at?: string;
  pdf_path?: string;
  fact_file_path?: string;
  output_dir?: string;
}

export default function LoadingPopup({ isVisible, jobId, onComplete, onError }: LoadingPopupProps) {
  const [jobStatus, setJobStatus] = useState<JobStatus>({ 
    job_id: jobId,
    status: 'pending',
    progress: 0,
    message: 'Job created, waiting to start processing'
  });

  // Check job status every 3 seconds for more responsive updates
  useEffect(() => {
    if (!isVisible || !jobId) return;

    const checkJobStatus = async () => {
      try {
        const response = await fetch(`/api/job/status?jobId=${jobId}`);
        
        if (!response.ok) {
          throw new Error('Failed to check job status');
        }

        // Check if response is 206 (completed with CSV file)
        if (response.status === 206) {
          // Job completed with CSV file
          setJobStatus(prev => ({
            ...prev,
            status: 'completed',
            progress: 100,
            message: '🎉 Document analysis completed successfully! All processes finished.'
          }));
          onComplete();
          return;
        }

        // Regular JSON response
        const data = await response.json();
        if (data.success && data.data) {
          setJobStatus(data.data);
          
          if (data.data.status === 'completed') {
            onComplete();
          } else if (data.data.status === 'failed') {
            onError(data.data.message || 'Job processing failed');
          }
        }
      } catch (error) {
        console.error('Error checking job status:', error);
        // Don't show error to user, just log it and continue checking
      }
    };

    // Check immediately
    checkJobStatus();

    // Then check every 3 seconds for more responsive updates
    const statusInterval = setInterval(checkJobStatus, 3000);

    return () => clearInterval(statusInterval);
  }, [isVisible, jobId, onComplete, onError]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        {/* Loading Spinner */}
        <div className="mb-6">
          <Loader2 
            className="h-16 w-16 mx-auto animate-spin" 
            style={{ color: 'var(--color-accent)' }} 
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-dark-gray)' }}>
          Analyzing Your Document
        </h2>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--color-medium-gray)' }}>
              Progress
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>
              {Math.round(jobStatus.progress)}%
            </span>
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                backgroundColor: 'var(--color-accent)',
                width: `${jobStatus.progress}%`
              }}
            />
          </div>
        </div>

        {/* Current Status Message */}
        <div className="mb-6">
          <p className="text-base font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
            Current Status
          </p>
          <p className="text-sm" style={{ color: 'var(--color-medium-gray)' }}>
            {jobStatus.message || 'Processing...'}
          </p>
        </div>

        {/* Job Status */}
        <div className="text-sm" style={{ color: 'var(--color-light-gray)' }}>
          Job ID: {jobId}
        </div>

        {/* Status-specific instruction */}
        <p className="text-sm mt-4" style={{ color: 'var(--color-light-gray)' }}>
          {jobStatus.status === 'completed' 
            ? 'Analysis complete! Redirecting to results...'
            : 'Please don\'t close this window while processing'
          }
        </p>
      </div>
    </div>
  );
}
