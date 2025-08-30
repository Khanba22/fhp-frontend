'use client';

import { useRef } from 'react';

interface PDFContentProps {
  pdfUrl?: string;
  fileName: string;
}

export default function PDFContent({ pdfUrl, fileName }: PDFContentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (pdfUrl) {
    return (
      <div className="w-full h-full bg-white">
        <iframe
          ref={iframeRef}
          src={pdfUrl}
          className="w-full h-full border-0 bg-white"
          title="PDF Viewer"
          style={{
            backgroundColor: 'white',
            filter: 'brightness(1.1) contrast(0.95) saturate(1.05)',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
          }}
        />
      </div>
    );
  }

  // Demo PDF Content - Full Width
  return (
    <div>
      
    </div>
  );
}
