'use client';

import { useState, useEffect } from 'react';
import { Header, BasicDropdown, MultiSelectDropdown } from '@/UI';
import { parseCSVData, extractEditTypes, createWordChanges, CSVRow } from '@/utils/csvParser';

interface ContentBlock {
  id: string;
  page: string;
  revisedText: string;
  originalText: string;
  wordLevelChanges: WordChange[];
  justification?: string;
  editTypes: string[];
}

interface WordChange {
  original: string;
  corrected: string;
  type: 'grammar' | 'technical' | 'clarity' | 'formatting' | 'other';
}

export default function ReviewSummaryPage() {
  const [activeTab, setActiveTab] = useState<'content-suggestions' | 'rag-table' | 'executive-summary'>('content-suggestions');
  const [selectedFilter, setSelectedFilter] = useState('All Pages');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/review-data');
        const result = await response.json();
        setCsvData(result.data);
      } catch (error) {
        console.error('Error fetching review data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const parsedData = parseCSVData(csvData);
  
  // Convert CSV data to content blocks for display
  const allContentBlocks: ContentBlock[] = parsedData.editTypes.map((row, index) => ({
    id: (index + 1).toString(),
    page: row.section_name,
    revisedText: row.proposed_revision,
    originalText: row.original_text,
    wordLevelChanges: createWordChanges(row.original_text, row.proposed_revision, extractEditTypes(row.edit_type)),
    justification: row.justification,
    editTypes: extractEditTypes(row.edit_type)
  }));

  // Filter content blocks based on selected page and error types
  const contentBlocks = allContentBlocks.filter(block => {
    // Filter by page
    if (selectedFilter !== 'All Pages' && !block.page.includes(selectedFilter)) {
      return false;
    }
    
    // Filter by error types
    if (selectedTags.length > 0) {
      const hasMatchingErrorType = block.editTypes.some(type => 
        selectedTags.some(selectedTag => 
          type.toLowerCase().includes(selectedTag.toLowerCase())
        )
      );
      if (!hasMatchingErrorType) {
        return false;
      }
    }
    
    return true;
  });

  const getTagColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'grammar':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'technical':
      case 'technical accuracy':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'clarity':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'internal consistency':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'professionalism & presentation':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'formatting':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'risk mitigation':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWordChangeColor = (type: 'grammar' | 'technical' | 'clarity' | 'formatting' | 'other') => {
    switch (type) {
      case 'grammar':
        return 'text-red-600';
      case 'technical':
        return 'text-blue-600';
      case 'clarity':
        return 'text-purple-600';
      case 'formatting':
        return 'text-indigo-600';
      default:
        return 'text-cyan-600';
    }
  };

  // Function to create inline text with strikethrough and corrected text
  const createInlineText = (originalText: string, wordChanges: WordChange[]) => {
    let result = originalText;
    
    // Sort changes by position in text (longest first to avoid partial replacements)
    const sortedChanges = [...wordChanges].sort((a, b) => b.original.length - a.original.length);
    
    sortedChanges.forEach(change => {
      const regex = new RegExp(change.original, 'gi');
      const colorClass = getWordChangeColor(change.type);
      result = result.replace(regex, `<span class="line-through ${colorClass}">${change.original}</span> <span class="font-medium  ${colorClass}">${change.corrected}</span>`);
    });
    
    return result;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with navigation */}
      <Header currentStep="review" />
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-dark-gray)' }}>
            Review and Summary
          </h1>
        </div>

        {/* Primary Action Buttons/Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('content-suggestions')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'content-suggestions'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Content Suggestions
          </button>
          <button
            onClick={() => setActiveTab('rag-table')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'rag-table'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            RAG TABLE
          </button>
          <button
            onClick={() => setActiveTab('executive-summary')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'executive-summary'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Executive Summary
          </button>
        </div>

        {/* Filter and Tags */}
        <div className="flex items-center justify-between mb-8">
          <BasicDropdown
            options={['All Pages', 'Page 4', 'Page 5', 'Page 8', 'Page 9', 'Page 10']}
            placeholder="Select Page"
            value={selectedFilter}
            onChange={setSelectedFilter}
          />
          
          {/* Right side - Multi-select error type filter */}
          <MultiSelectDropdown
            options={['Grammar', 'Technical', 'Clarity', 'Internal Consistency', 'Professionalism & Presentation', 'Formatting', 'Risk Mitigation']}
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
                <p className="text-lg text-gray-600">No content blocks found with current filters</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your page or error type filters</p>
              </div>
            ) : (
              contentBlocks.map((block) => (
            <div key={block.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Header with page title and tags inline */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-700">{block.page}</h3>
                {/* Tags at the top right */}
                <div className="flex flex-wrap gap-2">
                  {block.editTypes.map((type) => (
                    <span
                      key={type}
                      className={`px-2 py-1 text-xs rounded-full border ${getTagColor(type)}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column: Revised Text */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--color-dark-gray)' }}>
                    Revised Text
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {block.revisedText}
                  </p>
                </div>

                {/* Right Column: Original Text with Inline Changes */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--color-dark-gray)' }}>
                    Original Text with Changes
                  </h4>
                  
                  {/* Original text with inline strikethrough and corrected text */}
                  <div 
                    className="text-sm text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: createInlineText(block.originalText, block.wordLevelChanges) 
                    }}
                  />

                  {/* Justification (if available) */}
                  {block.justification && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                      <h5 className="font-semibold mb-2" style={{ color: 'var(--color-dark-gray)' }}>
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

        {/* Placeholder for other tabs */}
        {activeTab === 'rag-table' && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">RAG TABLE Component</p>
            <p className="text-sm text-gray-500 mt-2">This component will be added soon</p>
          </div>
        )}

        {activeTab === 'executive-summary' && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Executive Summary Component</p>
            <p className="text-sm text-gray-500 mt-2">This component will be added soon</p>
          </div>
        )}
      </main>
    </div>
  );
}
