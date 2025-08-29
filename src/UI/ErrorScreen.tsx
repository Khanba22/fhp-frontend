'use client';

import { AlertTriangle, RefreshCw, ArrowLeft, Headphones } from 'lucide-react';

interface ErrorScreenProps {
  errorMessage?: string;
  onRetry: () => void;
  onGoBack: () => void;
  onContactSupport?: () => void;
  className?: string;
}

export default function ErrorScreen({ 
  errorMessage = "We encountered an issue while analyzing your document. This could be due to document format issues or a temporary server problem.",
  onRetry, 
  onGoBack, 
  onContactSupport,
  className = '' 
}: ErrorScreenProps) {
  return (
    <div className={`min-h-screen bg-white flex items-center justify-center p-4 ${className}`}>
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--color-light-blue-border)' }}></div>
      
      {/* Header with logo */}
      <div className="absolute top-6 left-6 flex items-center">
        <div className="w-12 h-12 rounded-lg mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>
          <div className="flex items-center justify-center h-full">
            <span className="text-white font-bold text-sm">FHP</span>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-dark-gray)' }}>
            FHP QA Tool
          </h1>
        </div>
      </div>

      {/* Main error content */}
      <div className="text-center max-w-md w-full">
        {/* Error Icon */}
        <div className="w-24 h-24 rounded-full mx-auto mb-6" style={{ backgroundColor: '#FEE2E2' }}>
          <div className="flex items-center justify-center h-full">
            <AlertTriangle className="h-12 w-12" style={{ color: '#DC2626' }} />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-dark-gray)' }}>
          Analysis Failed
        </h1>

        {/* Error Description */}
        <p className="text-lg mb-8" style={{ color: 'var(--color-medium-gray)' }}>
          {errorMessage}
        </p>

        {/* Possible Causes Section */}
        <div 
          className="text-left mb-8 p-4 rounded-lg"
          style={{ 
            backgroundColor: '#FEE2E2',
            borderLeft: '4px solid #DC2626'
          }}
        >
          <h3 className="font-semibold mb-3" style={{ color: '#DC2626' }}>
            Possible causes:
          </h3>
          <ul className="space-y-2" style={{ color: '#DC2626' }}>
            <li>• Unsupported document format</li>
            <li>• Document too large or corrupted</li>
            <li>• Network connection issue</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          {/* Try Again Button */}
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>

          {/* Go Back Button */}
          <button
            onClick={onGoBack}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Contact Support Link */}
        <button
          onClick={onContactSupport}
          className="flex items-center justify-center space-x-2 mx-auto text-sm hover:underline transition-colors"
          style={{ color: 'var(--color-medium-gray)' }}
        >
          <Headphones className="h-4 w-4" />
          <span>Contact Support</span>
        </button>
      </div>
    </div>
  );
}
