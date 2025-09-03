// Frontend Configuration
export const config = {
  // Backend API URL
  backendBaseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8000',
  
  // API endpoints
  api: {
    health: '/api/health',
    jobStart: '/api/job/start',
    jobStatus: '/api/job/status',
    jobDelete: '/api/job/delete',
    analysis: '/api/analysis',
    pdf: '/api/pdf',
    jobs: '/api/jobs',
    // New backend endpoints
    upload: '/api/upload',
    jobById: '/api/job',
    generatePdf: '/api/generate-pdf',
    jobFiles: '/api/job/files',
    jobFile: '/api/job/file',
  },
  
  // File upload settings
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['.pdf', '.doc', '.docx'],
  },
  
  // Job polling settings
  jobPolling: {
    interval: 10000, // 10 seconds
    maxAttempts: 300, // 50 minutes max
  },
  
  // UI settings
  ui: {
    autoRedirectDelay: 3000, // 3 seconds
    maxDisplayIssues: 100,
  }
};
