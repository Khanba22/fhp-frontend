"use client";

import { useState, useEffect } from "react";
import { Header} from "@/UI";
import ReviewPage from "@/components/ReviewPage";
import { RagTable } from "@/UI";
import ExecutiveSummary from "@/components/ExecutiveSummary";
import PDFViewer from "@/components/PDFViewer";
import { useEditor } from "@/contexts/useEditor";

export default function ReviewSummaryPage() {
  const [activeTab, setActiveTab] = useState<
    "content-suggestions" | "rag-table" | "executive-summary" | "pdf-viewer"
  >("content-suggestions");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  
  const { 
    reviewChanges, 
    // ragTableData, 
    // executiveSummaryData,
    selectedFilter, 
    selectedTags, 
    setSelectedFilter, 
    setSelectedTags,
    isLoading 
  } = useEditor();

  // Function to load the generated PDF
  const loadGeneratedPDF = async () => {
    try {
      setIsLoadingPdf(true);
      
      // Get job ID from localStorage
      const jobId = localStorage.getItem('fhp_job_id');
      if (!jobId) {
        console.error('No job ID found in localStorage');
        return;
      }

      // Fetch the generated PDF
      const response = await fetch(`/api/review-pdf?jobId=${jobId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch generated PDF');
      }

      // Create blob URL for the PDF
      const pdfBlob = await response.blob();
      const blobUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(blobUrl);
      
    } catch (error) {
      console.error('Error loading generated PDF:', error);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  // Load PDF when PDF viewer tab is selected
  useEffect(() => {
    if (activeTab === 'pdf-viewer' && !pdfUrl && !isLoadingPdf) {
      loadGeneratedPDF();
    }
  }, [activeTab, pdfUrl, isLoadingPdf]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Convert CSVRow data to ContentBlock format for ReviewPage component
  const contentBlocks = reviewChanges.map((row, index) => ({
    id: (index + 1).toString(),
    page: row.section_name || 'Unknown Page',
    revisedText: row.proposed_revision || '',
    originalText: row.original_text || '',
    wordLevelChanges: [], // We'll handle this in the createInlineText function
    justification: row.justification || '',
    editTypes: row.edit_type ? row.edit_type.split(',').map(type => type.trim()) : [],
    diffOutput: row.diff_output || '' // HTML string with styled diff output
  }));

  // Function to create inline text with strikethrough and corrected text
  const createInlineText = (
    originalText: string,
    wordChanges: { original: string; corrected: string; type: string }[]
  ) => {
    let result = originalText;

    // Sort changes by position in text (longest first to avoid partial replacements)
    const sortedChanges = [...wordChanges].sort(
      (a, b) => b.original.length - a.original.length
    );

    sortedChanges.forEach((change) => {
      const regex = new RegExp(change.original, "gi");
      const colorClass = getWordChangeColor(change.type);
      result = result.replace(
        regex,
        `<span class="line-through ${colorClass}">${change.original}</span> <span class="font-medium  ${colorClass}">${change.corrected}</span>`
      );
    });

    return result;
  };

  const getWordChangeColor = (
    type: string
  ) => {
    switch (type.toLowerCase()) {
      case "grammar":
        return "text-red-600";
      case "technical":
        return "text-blue-600";
      case "clarity":
        return "text-purple-600";
      case "formatting":
        return "text-indigo-600";
      case "internal consistency":
        return "text-orange-600";
      case "professionalism & presentation":
        return "text-pink-600";
      case "risk mitigation":
        return "text-amber-600";
      default:
        return "text-cyan-600";
    }
  };

  const selectedTab = {
    "content-suggestions": (
      <ReviewPage
        contentBlocks={contentBlocks}
        activeTab={activeTab}
        setLoading={() => {}}
        setActiveTab={(tab: string) =>
          setActiveTab(
            tab as "content-suggestions" | "rag-table" | "executive-summary" | "pdf-viewer"
          )
        }
        loading={isLoading}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        createInlineText={createInlineText}
      />
    ),
    "rag-table": (
      <RagTable />
    ),
    "executive-summary": (
      <ExecutiveSummary />
    ),
    "pdf-viewer": (
      <div className="w-full h-[calc(100vh-200px)]">
        {isLoadingPdf ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading generated PDF...</p>
            </div>
          </div>
        ) : pdfUrl ? (
          <PDFViewer pdfUrl={pdfUrl} fileName="Analysis Report" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-600 mb-4">No PDF available</p>
              <button
                onClick={loadGeneratedPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Load PDF
              </button>
            </div>
          </div>
        )}
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with navigation */}
      <Header currentStep="review" />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--color-dark-gray)" }}
          >
            Review and Summary
          </h1>
        </div>

        {/* Primary Action Buttons/Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("content-suggestions")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "content-suggestions"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Content Suggestions
          </button>
          <button
            onClick={() => setActiveTab("rag-table")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "rag-table"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            RAG TABLE
          </button>
          <button
            onClick={() => setActiveTab("executive-summary")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "executive-summary"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setActiveTab("pdf-viewer")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "pdf-viewer"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Generated PDF
          </button>
        </div>

        {/* Filter and Tags */}
        {selectedTab[activeTab]}
      </main>
    </div>
  );
}
