"use client";

import { useState, useEffect } from "react";
import { Header, BasicDropdown, MultiSelectDropdown } from "@/UI";
import {
  parseCSVData,
  extractEditTypes,
  createWordChanges,
  CSVRow,
} from "@/utils/csvParser";
import ReviewPage from "@/components/ReviewPage";
import { ContentBlock } from "@/interface/ContentBlock";
import { WordChange } from "@/interface/WordChange";
import RagTable from "@/components/RagTable";
import ExecutiveSummary from "@/components/ExecutiveSummary";
  
export default function ReviewSummaryPage() {
  const [activeTab, setActiveTab] = useState<
    "content-suggestions" | "rag-table" | "executive-summary"
  >("content-suggestions");
  const [selectedFilter, setSelectedFilter] = useState("All Pages");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/review-data");
        const result = await response.json();
        setCsvData(result.data);
      } catch (error) {
        console.error("Error fetching review data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const parsedData = parseCSVData(csvData);

  // Convert CSV data to content blocks for display
  const allContentBlocks: ContentBlock[] = parsedData.editTypes.map(
    (row, index) => ({
      id: (index + 1).toString(),
      page: row.section_name,
      revisedText: row.proposed_revision,
      originalText: row.original_text,
      wordLevelChanges: createWordChanges(
        row.original_text,
        row.proposed_revision,
        extractEditTypes(row.edit_type)
      ),
      justification: row.justification,
      editTypes: extractEditTypes(row.edit_type),
    })
  );

  // Filter content blocks based on selected page and error types
  const contentBlocks = allContentBlocks.filter((block) => {
    // Filter by page
    if (
      selectedFilter !== "All Pages" &&
      !block.page.includes(selectedFilter)
    ) {
      return false;
    }

    // Filter by error types
    if (selectedTags.length > 0) {
      const hasMatchingErrorType = block.editTypes.some((type) =>
        selectedTags.some((selectedTag) =>
          type.toLowerCase().includes(selectedTag.toLowerCase())
        )
      );
      if (!hasMatchingErrorType) {
        return false;
      }
    }

    return true;
  });

  const getWordChangeColor = (
    type: "grammar" | "technical" | "clarity" | "formatting" | "other"
  ) => {
    switch (type) {
      case "grammar":
        return "text-red-600";
      case "technical":
        return "text-blue-600";
      case "clarity":
        return "text-purple-600";
      case "formatting":
        return "text-indigo-600";
      default:
        return "text-cyan-600";
    }
  };

  // Function to create inline text with strikethrough and corrected text
  const createInlineText = (
    originalText: string,
    wordChanges: WordChange[]
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

  const selectedTab = {
    "content-suggestions": (
      <ReviewPage
        contentBlocks={contentBlocks}
        activeTab={activeTab}
        setLoading={setLoading}
        setActiveTab={(tab: string) => setActiveTab(tab as "content-suggestions" | "rag-table" | "executive-summary")}
        loading={loading}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        createInlineText={createInlineText}
      />
    ),
    "rag-table": (
      <RagTable
        // activeTab={activeTab}
        // setActiveTab={setActiveTab}
        // loading={loading}
        // selectedFilter={selectedFilter}
        // setSelectedFilter={setSelectedFilter}
        // selectedTags={selectedTags}
        // setSelectedTags={setSelectedTags}
        // createInlineText={createInlineText}
      />
    ),
    "executive-summary": (
      <ExecutiveSummary
        // activeTab={activeTab}
        // setActiveTab={(tab: string) => setActiveTab(tab as "content-suggestions" | "rag-table" | "executive-summary")}
        // loading={loading}
        // selectedFilter={selectedFilter}
        // setSelectedFilter={setSelectedFilter}
        // selectedTags={selectedTags}
        // setSelectedTags={setSelectedTags}
        // createInlineText={createInlineText}
      />
    ),
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with navigation */}
      <Header currentStep="review" />

      {/* Main content */}
      {selectedTab[activeTab]}
    </div>
  );
}
