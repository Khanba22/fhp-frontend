# Frontend-Backend API Integration

This document explains how the frontend Next.js API routes integrate with the Python FastAPI backend.

## Architecture Overview

The frontend uses Next.js API routes as a proxy layer between the React components and the Python backend. This approach provides:

- **Security**: Backend credentials are not exposed to the client
- **Flexibility**: Easy to switch backend URLs or add middleware
- **Error Handling**: Centralized error handling and response formatting
- **Type Safety**: TypeScript interfaces for all API responses

## Backend API Endpoints

The Python backend provides these main endpoints:

### 1. Document Upload & Processing
- `POST /api/upload` - Upload and start processing a document
- `GET /api/job/{job_id}` - Get job status and progress
- `GET /api/analysis/{job_id}` - Get analysis results
- `POST /api/generate-pdf/{job_id}` - Generate PDF report

### 2. Job Management
- `GET /api/jobs` - List recent jobs
- `DELETE /api/job/{job_id}` - Delete a job

### 3. Health & Status
- `GET /api/health` - Backend health check
- `GET /` - Root endpoint with API info

## Frontend API Routes

The frontend provides these API routes that proxy to the backend:

### 1. Job Management
```
POST /api/job/start
- Accepts: FormData with draftReport, coverDocument, apiKey
- Returns: { success: true, jobId: string, message: string }
- Backend: POST /api/upload

GET /api/job/status?jobId={id}
- Returns: JobStatus object with progress and status
- Backend: GET /api/job/{job_id}

DELETE /api/job/delete?jobId={id}
- Returns: { success: true, message: string }
- Backend: DELETE /api/job/{job_id}
```

### 2. Analysis & Results
```
GET /api/analysis?jobId={id}
- Returns: AnalysisResult with categorized issues
- Backend: GET /api/analysis/{job_id}

POST /api/pdf?jobId={id}
- Returns: PDF file blob
- Backend: POST /api/generate-pdf/{job_id}
```

### 3. Job Listing
```
GET /api/jobs?limit={number}
- Returns: { jobs: JobStatus[], total: number }
- Backend: GET /api/jobs?limit={number}
```

### 4. Health Check
```
GET /api/health
- Returns: Frontend and backend health status
- Backend: GET /api/health
```

## Data Flow

```
React Component → Frontend API Route → Backend API → Response
     ↓                ↓                    ↓         ↓
  Form Data    →  FormData Validation → FastAPI → JSON/File
     ↓                ↓                    ↓         ↓
  State Update ←  Response Processing ←  Process ←  Database
```

## Configuration

### Environment Variables
```bash
# Frontend .env.local
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:8000
```

### Configuration File
```typescript
// config.ts
export const config = {
  backendBaseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8000',
  api: { /* endpoint mappings */ },
  upload: { /* file upload settings */ },
  jobPolling: { /* polling configuration */ }
};
```

## API Utilities

### Job API
```typescript
import { jobApi } from '@/utils/api';

// Start a job
const result = await jobApi.start(formData);

// Check status
const status = await jobApi.getStatus(jobId);

// Delete job
await jobApi.delete(jobId);

// List jobs
const jobs = await jobApi.list(10);
```

### Analysis API
```typescript
import { analysisApi } from '@/utils/api';

// Get results
const results = await analysisApi.getResults(jobId);

// Generate PDF
const pdf = await analysisApi.generatePDF(jobId);
```

### Health Check
```typescript
import { healthApi } from '@/utils/api';

const health = await healthApi.check();
```

## Error Handling

All API calls return a consistent response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Error Examples
```typescript
// Backend connection failed
{
  success: false,
  error: "Backend health check failed: 500"
}

// Job not found
{
  success: false,
  error: "Job not found"
}

// Success response
{
  success: true,
  data: { jobId: "123", status: "processing" }
}
```

## File Upload Process

1. **Frontend**: User selects files and enters API key
2. **Form Validation**: Check required fields and file types
3. **Frontend API**: POST to `/api/job/start` with FormData
4. **Backend API**: Process files and start analysis job
5. **Response**: Return job ID for tracking
6. **Polling**: Frontend polls `/api/job/status` every 10 seconds
7. **Completion**: Redirect to results page when done

## Security Considerations

- **API Keys**: Never exposed to client-side code
- **File Validation**: Both frontend and backend validate file types
- **CORS**: Backend configured to allow frontend origin
- **Rate Limiting**: Consider implementing on backend
- **Authentication**: Future enhancement for user management

## Development Setup

### 1. Start Backend
```bash
cd fhp-backend-code
python api.py
# Backend runs on http://localhost:8000
```

### 2. Start Frontend
```bash
cd fhp-frontend-code
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. Test API Integration
```bash
# Test backend health
curl http://localhost:8000/api/health

# Test frontend health (proxies to backend)
curl http://localhost:3000/api/health
```

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Check if backend is running on port 8000
   - Verify CORS settings in backend
   - Check network connectivity

2. **File Upload Errors**
   - Verify file size limits (50MB)
   - Check supported file types (.pdf, .doc, .docx)
   - Ensure API key is provided

3. **Job Status Not Updating**
   - Check backend job processing logs
   - Verify job ID is valid
   - Check polling interval configuration

### Debug Steps

1. Check browser console for frontend errors
2. Check backend terminal for Python errors
3. Test backend endpoints directly with curl/Postman
4. Verify environment variables are set correctly
5. Check network tab for failed requests

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live progress
- **File Chunking**: Support for large file uploads
- **Authentication**: User login and job history
- **Caching**: Redis integration for job status
- **Monitoring**: Prometheus metrics and health checks
