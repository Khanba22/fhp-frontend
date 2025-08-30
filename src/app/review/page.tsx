"use client";

import { useState } from "react";
import { Header} from "@/UI";
import ReviewPage from "@/components/ReviewPage";
import { RagTable } from "@/UI";
import ExecutiveSummary from "@/components/ExecutiveSummary";
import { useEditor } from "@/contexts/useEditor";

export default function ReviewSummaryPage() {
  const [activeTab, setActiveTab] = useState<
    "content-suggestions" | "rag-table" | "executive-summary"
  >("content-suggestions");
  
  const { 
    reviewChanges, 
    ragTableData, 
    executiveSummaryData,
    selectedFilter, 
    selectedTags, 
    setSelectedFilter, 
    setSelectedTags,
    isLoading 
  } = useEditor();

  // Convert CSVRow data to ContentBlock format for ReviewPage component
  const contentBlocks = reviewChanges.map((row, index) => ({
    id: (index + 1).toString(),
    page: row.section_name || 'Unknown Page',
    revisedText: row.proposed_revision || '',
    originalText: row.original_text || '',
    wordLevelChanges: [], // We'll handle this in the createInlineText function
    justification: row.justification || '',
    editTypes: row.edit_type ? row.edit_type.split(',').map(type => type.trim()) : []
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
            tab as "content-suggestions" | "rag-table" | "executive-summary"
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
        </div>

        {/* Filter and Tags */}
        {selectedTab[activeTab]}
      </main>
    </div>
  );
}
