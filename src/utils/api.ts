// API utility functions for communicating with backend through frontend API routes

import { config } from '../../config';

export interface JobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  result?: any;
  created_at?: string;
  updated_at?: string;
}

export interface AnalysisResult {
  jobId: string;
  status: string;
  categorized_issues: Record<string, any[]>;
  document_name: string;
  total_issues: number;
  analysis_date: string;
}

export interface JobStartResponse {
  success: boolean;
  jobId: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Generic API call function
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Job management API calls
export const jobApi = {
  // Start a new job
  async start(files: FormData): Promise<ApiResponse<JobStartResponse>> {
    try {
      const response = await fetch(config.api.jobStart, {
        method: 'POST',
        body: files,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Job start failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start job',
      };
    }
  },

  // Get job status
  async getStatus(jobId: string): Promise<ApiResponse<JobStatus>> {
    return apiCall<JobStatus>(`${config.api.jobStatus}?jobId=${jobId}`);
  },

  // Delete a job
  async delete(jobId: string): Promise<ApiResponse<{ message: string }>> {
    return apiCall<{ message: string }>(`${config.api.jobDelete}?jobId=${jobId}`, {
      method: 'DELETE',
    });
  },

  // List recent jobs
  async list(limit: number = 10): Promise<ApiResponse<{ jobs: JobStatus[]; total: number }>> {
    return apiCall<{ jobs: JobStatus[]; total: number }>(`${config.api.jobs}?limit=${limit}`);
  },
};

// Analysis API calls
export const analysisApi = {
  // Get analysis results
  async getResults(jobId: string): Promise<ApiResponse<AnalysisResult>> {
    return apiCall<AnalysisResult>(`${config.api.analysis}?jobId=${jobId}`);
  },

  // Generate PDF report
  async generatePDF(jobId: string): Promise<ApiResponse<Blob>> {
    try {
      const response = await fetch(`${config.api.pdf}?jobId=${jobId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error('PDF generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate PDF',
      };
    }
  },
};

// Health check API calls
export const healthApi = {
  // Check backend health
  async check(): Promise<ApiResponse<{ frontend: any; backend: any }>> {
    return apiCall<{ frontend: any; backend: any }>(config.api.health);
  },
};

// Utility function to download blob as file
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
