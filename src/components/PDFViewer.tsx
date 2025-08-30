'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PDFContent } from './PDFViewer/index';

interface PDFViewerProps {
  pdfUrl?: string;
  fileName?: string;
}

export default function PDFViewer({ pdfUrl, fileName = "Commercial_Building_Report_Draft_v2.pdf" }: PDFViewerProps) {
  const router = useRouter();

  // Cleanup function for blob URLs
  useEffect(() => {
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleBackToEdit = () => {
    router.push('/review');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* FHP Logo */}
          <div 
            className="w-10 h-10 rounded flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <span className="text-white font-bold text-sm">FHP</span>
          </div>
          
          <div>
            <h1 className="text-lg font-semibold text-gray-900">FHP QA Tool</h1>
            <p className="text-sm text-gray-600">{fileName}</p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBackToEdit}
          className="flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105 text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Edit</span>
        </button>
      </header>

      {/* PDF Viewer - Full Width (minus header height) */}
      <div className="w-full h-[calc(100vh-80px)] bg-white">
        <PDFContent pdfUrl={pdfUrl} fileName={fileName} />
      </div>
    </div>
  );
}
