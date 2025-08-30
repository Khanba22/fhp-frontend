'use client';

import { useState, useRef } from 'react';
import { Download, Printer, Share2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl?: string;
  fileName?: string;
}

export default function PDFViewer({ pdfUrl, fileName = "Commercial_Building_Report_Draft_v2.pdf" }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(15);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isAutoSaved, setIsAutoSaved] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(100);
  const [currentStep, setCurrentStep] = useState(4);
  const [totalSteps, setTotalSteps] = useState(4);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Zoom functionality
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  // Page navigation
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Download functionality
  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For demo purposes, create a dummy download
      const blob = new Blob(['PDF content would be here'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Print functionality
  const handlePrint = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeWindow = iframe.contentWindow;
      if (iframeWindow) {
        iframeWindow.print();
      }
    } else {
      // Fallback for demo
      window.print();
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Technical Due Diligence Report',
          text: 'Check out this technical due diligence report',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* FHP Logo */}
            <div className="w-12 h-12 bg-blue-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">FHP</span>
            </div>
            
            <div>
              <h1 className="text-xl font-semibold text-gray-900">FHP QA Tool</h1>
              <p className="text-sm text-gray-600">{fileName}</p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Auto-saved</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{completionPercentage}% Complete</span>
            </div>
            
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Document Upload</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Report and Summary</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button className="bg-blue-800 text-white px-4 py-2 rounded-md font-medium">
            Preview & Download
          </button>
        </div>
      </nav>

      {/* Document Viewer Controls */}
      <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Zoom Controls */}
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <span className="text-sm font-medium min-w-[60px] text-center">
              {zoomLevel}%
            </span>
            
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            
            

            {/* Page Navigation */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-sm font-medium min-w-[80px] text-center">
                {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

                     {/* Action Buttons */}
           <div className="flex items-center space-x-3">
             <button
               onClick={handleDownload}
               className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
             >
               <Download className="w-4 h-4" />
               <span>Download</span>
             </button>
             
             <button
               onClick={handlePrint}
               className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
             >
               <Printer className="w-4 h-4" />
               <span>Print</span>
             </button>
             
             <button
               onClick={handleShare}
               className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
             >
               <Share2 className="w-4 h-4" />
               <span>Share</span>
             </button>
           </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-white overflow-auto">
        {pdfUrl ? (
          <div className="p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
              <iframe
                ref={iframeRef}
                src={pdfUrl}
                className="w-full h-[calc(100vh-250px)] border-0 rounded-lg"
                title="PDF Viewer"
              />
            </div>
          </div>
        ) : (
          // Demo PDF Content
          <div className="p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Technical Due Diligence Report
                  </h1>
                  <h2 className="text-xl text-gray-700 mb-2">
                    Commercial Building Assessment
                  </h2>
                  <p className="text-lg text-gray-600 mb-2">123 Business Park Drive</p>
                  <p className="text-gray-500 mb-1">Prepared by: FHP Engineering</p>
                  <p className="text-gray-500">Date: 8/22/2025</p>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Executive Summary</h2>
                  
                  <p className="text-gray-700 mb-4">
                    This comprehensive technical due diligence evaluation reveals that the subject property is structurally sound, 
                    but with strategic opportunities for improvement. The foundational integrity is solid, providing a reliable 
                    base for future enhancements, while the HVAC and electrical infrastructure require targeted investments to 
                    enhance operational efficiency.
                  </p>
                  
                  <p className="text-gray-700 mb-4">
                    This approach will increase the property&apos;s long-term value and sustainability. Updating these systems is 
                    critical for modernizing the facility, reducing future maintenance costs, and ensuring compliance with 
                    evolving energy efficiency standards.
                  </p>
                  
                  <p className="text-gray-700 mb-4">
                    The property aligns with all current safety standards and is ready for immediate occupancy. Our 
                    recommendations offer a roadmap for implementing value-enhancing improvements, which will boost market 
                    appeal and long-term viability.
                  </p>
                  
                  <p className="text-gray-700">
                    The evaluation identifies strategic upgrades that will optimize the building&apos;s performance, reduce 
                    operational costs, and position the asset for future growth and higher returns on investment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
