'use client';

import { useState } from 'react';
import { Header, FileUpload, Guidelines, LoadingPopup, ErrorScreen } from '@/UI';
import { useJobStatus } from '@/hooks/useJobStatus';
import { useEditor } from '@/contexts/useEditor';

export default function DocumentUploadPage() {
  const { 
    isLoading, 
    showLoadingPopup, 
    showErrorScreen, 
    errorMessage, 
    startJob, 
    jobId, 
    retryJob, 
    goBackToUpload 
  } = useJobStatus();
  
  const { setUploadedFile } = useEditor();
  
  const [draftReport, setDraftReport] = useState<File | null>(null);
  const [coverDocument, setCoverDocument] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  const guidelines = [
    {
      id: 'file-requirements',
      icon: 'warning' as const,
      title: 'File Requirements',
      description: 'Accepted formats: PDF, DOC, DOCX. Maximum file size: 50MB per document.'
    },
    {
      id: 'processing-time',
      icon: 'success' as const,
      title: 'Processing Time',
      description: 'Analysis typically takes 2-5 minutes depending on document length and complexity.'
    },
    {
      id: 'document-security',
      icon: 'info' as const,
      title: 'Document Security',
      description: 'All uploaded documents are encrypted and processed securely. Files are automatically deleted after 30 days.'
    }
  ]; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!draftReport) {
      alert('Please upload a draft report to continue.');
      return;
    }

    if (!apiKey) {
      alert('Please enter your Gemini API key to continue.');
      return;
    }

    // Store the uploaded file in the context
    setUploadedFile(draftReport);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('draftReport', draftReport, draftReport.name);
    formData.append('apiKey', apiKey);
    
    if (coverDocument) {
      formData.append('coverDocument', coverDocument, coverDocument.name);
    }

    // Start the job processing
    await startJob(formData);
  };

  // If error screen is showing, render only the error screen
  if (showErrorScreen) {
    console.log('Rendering error screen with message:', errorMessage);
    return (
      <ErrorScreen
        errorMessage={errorMessage}
        onRetry={retryJob}
        onGoBack={goBackToUpload}
        onContactSupport={() => {
          // TODO: Implement contact support functionality
          alert('Contact support functionality would be implemented here');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with navigation */}
      <Header currentStep="upload" />
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page title and description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-dark-gray)' }}>
            Upload Technical Due Diligence Documents
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-medium-gray)' }}>
            Upload your draft report and optional cover document to begin the AI-powered review process
          </p>
        </div>

        {/* Document upload form */}
        <form onSubmit={handleSubmit} className="mb-12">
          {/* API Key Input */}
          <div className="mb-8">
            <label htmlFor="apiKey" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
              Gemini API Key *
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-sm mt-1" style={{ color: 'var(--color-medium-gray)' }}>
              Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Draft Report Upload */}
            <FileUpload
              title="Draft Report"
              description="Upload your Technical Due Diligence draft document for review"
              required={true}
              onFileSelect={setDraftReport}
              className="h-full"
            />

            {/* Cover Document Upload */}
            <FileUpload
              title="Cover Document"
              description="Upload an optional cover document or executive summary"
              optional={true}
              onFileSelect={setCoverDocument}
              className="h-full"
            />
          </div>

          {/* Submit button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={!draftReport || isLoading}
              className={`
                px-8 py-4 text-lg font-semibold rounded-lg transition-all transform
                ${!draftReport || isLoading
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 active:scale-95'
                }
              `}
              style={{
                background: 'linear-gradient(to right, var(--color-button-gradient-from), var(--color-button-gradient-to))',
                color: 'white'
              }}
            >
              {isLoading ? 'Starting Job...' : 'Continue to Review'}
            </button>
          </div>
        </form>

        {/* Upload Guidelines */}
        <Guidelines guidelines={guidelines} />
      </main>

      {/* Loading Popup */}
      {showLoadingPopup && (
        <LoadingPopup
          isVisible={showLoadingPopup}
          jobId={jobId || ''}
          onComplete={() => {
            // This will be handled by the hook
          }}
          onError={(error) => {
            alert(`Error: ${error}`);
          }}
        />
      )}
    </div>
  );
}
