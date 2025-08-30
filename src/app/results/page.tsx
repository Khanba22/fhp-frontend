import PDFViewer from '@/components/PDFViewer';

export default function ResultsPage() {
  return (
    <PDFViewer 
      fileName="Commercial_Building_Report_Draft_v2.pdf"
      // pdfUrl can be passed here when you have the actual PDF file
    />
  );
}
