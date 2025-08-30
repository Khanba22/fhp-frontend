'use client';

import { useEditor } from '@/contexts/useEditor';
import PDFViewer from '@/components/PDFViewer';

export default function ResultsPage() {
  const { uploadedFile } = useEditor();

  // Create a blob URL from the uploaded file for display
  const pdfUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : undefined;
  const fileName = uploadedFile?.name || "Commercial_Building_Report_Draft_v2.pdf";

  return (
    <PDFViewer 
      fileName={fileName}
      pdfUrl={pdfUrl}
    />
  );
}
