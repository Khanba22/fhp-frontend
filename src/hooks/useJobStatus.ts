'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jobApi, JobStatus } from '@/utils/api';

interface UseJobStatusReturn {
  isLoading: boolean;
  showLoadingPopup: boolean;
  showErrorScreen: boolean;
  errorMessage: string;
  jobId: string | null;
  startJob: (files: FormData) => Promise<void>;
  checkExistingJob: () => void;
  retryJob: () => void;
  goBackToUpload: () => void;
}

const JOB_ID_KEY = 'fhp_job_id';
const JOB_STATUS_KEY = 'fhp_job_status';

export function useJobStatus(): UseJobStatusReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);
  const [showErrorScreen, setShowErrorScreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const router = useRouter();

  // Check for existing job on mount
  useEffect(() => {
    checkExistingJob();
  }, []);

  // Check job status every 10 seconds when popup is visible
  useEffect(() => {
    if (!showLoadingPopup || !jobId) return;

    const checkJobStatus = async () => {
      try {
        const result = await jobApi.getStatus(jobId);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to check job status');
        }

        const data: JobStatus = result.data!;
        
        // Update localStorage
        localStorage.setItem(JOB_STATUS_KEY, JSON.stringify(data));

        if (data.status === 'completed') {
          // Job completed successfully
          localStorage.removeItem(JOB_ID_KEY);
          localStorage.removeItem(JOB_STATUS_KEY);
          setShowLoadingPopup(false);
          setIsLoading(false);
          setJobId(null);
          
          // Redirect to review page
          router.push('/review');
        } else if (data.status === 'failed') {
          // Job failed
          console.log('Job failed, showing error screen:', data.message);
          localStorage.removeItem(JOB_ID_KEY);
          localStorage.removeItem(JOB_STATUS_KEY);
          setShowLoadingPopup(false);
          setIsLoading(false);
          setJobId(null);
          setErrorMessage(data.message || 'Job processing failed');
          setShowErrorScreen(true);
        }
      } catch (error) {
        console.error('Error checking job status:', error);
        // Continue checking on next interval
      }
    };

    // Check immediately
    checkJobStatus();

    // Then check every 10 seconds
    const statusInterval = setInterval(checkJobStatus, 10000);

    return () => clearInterval(statusInterval);
  }, [showLoadingPopup, jobId, router]);

  const startJob = useCallback(async (files: FormData) => {
    try {
      setIsLoading(true);
      
      // Call the backend API to start the job
      const result = await jobApi.start(files);

      if (!result.success) {
        throw new Error(result.error || 'Failed to start job');
      }

      const data = result.data!;
      const newJobId = data.jobId;

      if (!newJobId) {
        throw new Error('No job ID received from server');
      }

      // Store job ID in localStorage
      localStorage.setItem(JOB_ID_KEY, newJobId);
      localStorage.setItem(JOB_STATUS_KEY, JSON.stringify({ status: 'pending' }));

      setJobId(newJobId);
      setShowLoadingPopup(true);
      setIsLoading(false);

    } catch (error) {
      console.error('Error starting job:', error);
      setIsLoading(false);
      alert(`Failed to start job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  const checkExistingJob = useCallback(() => {
    const existingJobId = localStorage.getItem(JOB_ID_KEY);
    const existingJobStatus = localStorage.getItem(JOB_STATUS_KEY);

    if (existingJobId && existingJobStatus) {
      try {
        const status: JobStatus = JSON.parse(existingJobStatus);
        
        if (status.status === 'completed') {
          // Job was already completed, clean up and redirect
          localStorage.removeItem(JOB_ID_KEY);
          localStorage.removeItem(JOB_STATUS_KEY);
          router.push('/review');
        } else if (status.status === 'failed') {
          // Job failed, clean up and show error
          localStorage.removeItem(JOB_ID_KEY);
          localStorage.removeItem(JOB_STATUS_KEY);
          setErrorMessage(status.message || 'Job processing failed');
          setShowErrorScreen(true);
        } else {
          // Job is still pending or processing, show loading popup
          setJobId(existingJobId);
          setShowLoadingPopup(true);
        }
      } catch (error) {
        console.error('Error parsing job status:', error);
        // Clean up corrupted data
        localStorage.removeItem(JOB_ID_KEY);
        localStorage.removeItem(JOB_STATUS_KEY);
      }
    }
  }, [router]);

  const retryJob = useCallback(() => {
    setShowErrorScreen(false);
    setErrorMessage('');
    // The user will need to upload files again and click submit
  }, []);

  const goBackToUpload = useCallback(() => {
    setShowErrorScreen(false);
    setErrorMessage('');
    // Reset to initial state
    setJobId(null);
    setShowLoadingPopup(false);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    showLoadingPopup,
    showErrorScreen,
    errorMessage,
    jobId,
    startJob,
    checkExistingJob,
    retryJob,
    goBackToUpload,
  };
}
