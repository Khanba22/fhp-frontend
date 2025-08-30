'use client';

import { ChevronRight } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Document Upload</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">Report and Summary</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <button 
          className="text-white px-4 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Preview & Download
        </button>
      </div>
    </nav>
  );
}
