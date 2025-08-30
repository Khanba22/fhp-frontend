'use client';

import { Download, Printer, Share2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface ControlsProps {
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onShare: () => void;
}

export default function Controls({
  currentPage,
  totalPages,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onPreviousPage,
  onNextPage,
  onDownload,
  onPrint,
  onShare
}: ControlsProps) {
  return (
    <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Zoom Controls */}
          <button
            onClick={onZoomOut}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <span className="text-sm font-medium min-w-[60px] text-center">
            {zoomLevel}%
          </span>
          
          <button
            onClick={onZoomIn}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Page Navigation */}
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={onPreviousPage}
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
              onClick={onNextPage}
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
            onClick={onDownload}
            className="flex items-center space-x-2 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          
          <button
            onClick={onPrint}
            className="flex items-center space-x-2 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            style={{ backgroundColor: 'var(--color-medium-gray)' }}
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          
          <button
            onClick={onShare}
            className="flex items-center space-x-2 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
