'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

interface LoadingPopupProps {
  isVisible: boolean;
  jobId: string;
  onComplete: () => void;
  onError: (error: string) => void;
}

interface JobStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
}

export default function LoadingPopup({ isVisible, jobId, onComplete, onError }: LoadingPopupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [jobStatus, setJobStatus] = useState<JobStatus>({ status: 'pending' });

  const processingSteps = [
    'Processing document content',
    'Analyzing grammar issues',
    'Resolving technical problems'
  ];

  // Simulate step progression
  useEffect(() => {
    if (!isVisible) return;

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(stepInterval);
  }, [isVisible, processingSteps.length]);

  // Check job status every 10 seconds
  useEffect(() => {
    if (!isVisible || !jobId) return;

    const checkJobStatus = async () => {
      try {
        const response = await fetch(`/api/job/status?jobId=${jobId}`);
        
        if (!response.ok) {
          throw new Error('Failed to check job status');
        }

        const data: JobStatus = await response.json();
        setJobStatus(data);

        if (data.status === 'completed') {
          onComplete();
        } else if (data.status === 'failed') {
          onError(data.message || 'Job processing failed');
        }
      } catch (error) {
        console.error('Error checking job status:', error);
        // Don't show error to user, just log it and continue checking
      }
    };

    // Check immediately
    checkJobStatus();

    // Then check every 10 seconds
    const statusInterval = setInterval(checkJobStatus, 10000);

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

        {/* Description */}
        <p className="text-base mb-6" style={{ color: 'var(--color-medium-gray)' }}>
          Our AI is carefully examining your document for grammar and technical issues. This usually takes 2-3 minutes.
        </p>

        {/* Processing Steps */}
        <div className="space-y-3 mb-6">
          {processingSteps.map((step, index) => (
            <div key={index} className="flex items-center justify-center space-x-3">
              <div 
                className={`w-3 h-3 rounded-full ${
                  index <= currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
              <span 
                className={`text-sm ${
                  index <= currentStep 
                    ? 'text-green-600 font-medium' 
                    : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Job Status */}
        <div className="text-sm" style={{ color: 'var(--color-light-gray)' }}>
          Job ID: {jobId}
        </div>

        {/* Instruction */}
        <p className="text-sm mt-4" style={{ color: 'var(--color-light-gray)' }}>
          Please don't close this window
        </p>
      </div>
    </div>
  );
}
