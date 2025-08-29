import React from "react";
import { BasicDropdown, MultiSelectDropdown } from "@/UI";
import { ContentBlock } from "@/interface/ContentBlock";
import { WordChange } from "@/interface/WordChange";

const ReviewPage = ({
  contentBlocks,
  loading,
  selectedFilter,
  setSelectedFilter,
  selectedTags,
  setSelectedTags,
  createInlineText,
}: {
  contentBlocks: ContentBlock[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  createInlineText: (originalText: string, wordChanges: WordChange[]) => string;
}) => {
  const getTagColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "grammar":
        return "bg-red-100 text-red-800 border-red-200";
      case "technical":
      case "technical accuracy":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "clarity":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "internal consistency":
        return "bg-green-100 text-green-800 border-green-200";
      case "professionalism & presentation":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "formatting":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "risk mitigation":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    
    <>
     <div className="flex items-center justify-between mb-8">
        <BasicDropdown
          options={[
            "All Pages",
            "Page 4",
            "Page 5",
            "Page 8",
            "Page 9",
            "Page 10",
          ]}
          placeholder="Select Page"
          value={selectedFilter}
          onChange={setSelectedFilter}
        />

        {/* Right side - Multi-select error type filter */}
        <MultiSelectDropdown
          options={[
            "Grammar",
            "Technical",
            "Clarity",
            "Internal Consistency",
            "Professionalism & Presentation",
            "Formatting",
            "Risk Mitigation",
          ]}
          placeholder="Select Error Types"
          value={selectedTags}
          onChange={setSelectedTags}
        />
      </div>

      {/* Content Blocks */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading review data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {contentBlocks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No content blocks found with current filters
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Try adjusting your page or error type filters
              </p>
            </div>
          ) : (
            contentBlocks.map((block) => (
              <div
                key={block.id}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                {/* Header with page title and tags inline */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-700">
                    {block.page}
                  </h3>
                  {/* Tags at the top right */}
                  <div className="flex flex-wrap gap-2">
                    {block.editTypes.map((type) => (
                      <span
                        key={type}
                        className={`px-2 py-1 text-xs rounded-full border ${getTagColor(
                          type
                        )}`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Left Column: Revised Text */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4
                      className="font-semibold mb-3"
                      style={{ color: "var(--color-dark-gray)" }}
                    >
                      Revised Text
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {block.revisedText}
                    </p>
                  </div>

                  {/* Right Column: Original Text with Inline Changes */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4
                      className="font-semibold mb-3"
                      style={{ color: "var(--color-dark-gray)" }}
                    >
                      Original Text with Changes
                    </h4>

                    {/* Original text with inline strikethrough and corrected text */}
                    <div
                      className="text-sm text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: createInlineText(
                          block.originalText,
                          block.wordLevelChanges
                        ),
                      }}
                    />

                    {/* Justification (if available) */}
                    {block.justification && (
                      <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                        <h5
                          className="font-semibold mb-2"
                          style={{ color: "var(--color-dark-gray)" }}
                        >
                          Justification
                        </h5>
                        <p className="text-sm text-gray-700">
                          {block.justification}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default ReviewPage;
