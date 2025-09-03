// API utility functions for communicating with backend through frontend API routes

import { config } from '../../config';

export interface JobStatus {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  result?: unknown;
  created_at?: string;
  updated_at?: string;
  pdf_path?: string;
  fact_file_path?: string;
  output_dir?: string;
}

export interface AnalysisResult {
  job_id: string;
  status: string;
  categorized_issues: Record<string, unknown[]>;
  document_name: string;
  total_issues: number;
  analysis_date: string;
}

export interface JobStartResponse {
  success: boolean;
  job_id: string;
  message: string;
}

export interface UploadResponse {
  job_id: string;
  status: string;
  message: string;
  pdf_path: string;
  fact_file_path?: string;
}

export interface JobFile {
  filename: string;
  size: number;
  type: string;
}

export interface JobFilesResponse {
  files: JobFile[];
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
  // Start a new job (upload documents)
  async start(files: FormData): Promise<ApiResponse<UploadResponse>> {
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
  async getStatus(jobId: string): Promise<ApiResponse<JobStatus | Blob>> {
    try {
      const response = await fetch(`${config.api.jobStatus}?jobId=${jobId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if response is 206 (Partial Content) - job completed with file
      if (response.status === 206) {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('text/csv')) {
          // Return CSV file as Blob
          const csvBlob = await response.blob();
          return {
            success: true,
            data: csvBlob,
            error: undefined
          };
        }
      }

      // Regular JSON response
      const data = await response.json();
      return {
        success: true,
        data: data,
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        error: error instanceof Error ? error.message : 'Failed to get job status'
      };
    }
  },

  // Get job by ID (returns reconcile.csv if completed)
  async getJobById(jobId: string): Promise<ApiResponse<JobStatus | Blob>> {
    try {
      const response = await fetch(`${config.api.jobById}/${jobId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if response is CSV (completed job) or JSON (job status)
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('text/csv')) {
        const blob = await response.blob();
        return { success: true, data: blob };
      } else {
        const data = await response.json();
        return { success: true, data };
      }
    } catch (error) {
      console.error('Get job by ID failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get job',
      };
    }
  },

  // Get job files
  async getJobFiles(jobId: string): Promise<ApiResponse<JobFilesResponse>> {
    return apiCall<JobFilesResponse>(`${config.api.jobFiles}/${jobId}`);
  },

  // Download specific job file
  async downloadJobFile(jobId: string, filename: string): Promise<ApiResponse<Blob>> {
    try {
      const response = await fetch(`${config.api.jobFile}/${jobId}/${filename}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error('Download job file failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to download file',
      };
    }
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
  // Get analysis results (reconcile.csv)
  async getResults(jobId: string): Promise<ApiResponse<Blob>> {
    try {
      const response = await fetch(`${config.api.jobById}/${jobId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error('Get analysis results failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get analysis results',
      };
    }
  },

  // Generate PDF report
  async generatePDF(jobId: string): Promise<ApiResponse<Blob>> {
    try {
      const response = await fetch(`${config.api.generatePdf}/${jobId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
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
  async check(): Promise<ApiResponse<{ frontend: unknown; backend: unknown }>> {
    return apiCall<{ frontend: unknown; backend: unknown }>(config.api.health);
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
