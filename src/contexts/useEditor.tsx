'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CSVRow, ParsedData, RagRow } from '@/utils/csvParser';

// Types for the context
interface EditorContextType {
  // File upload states
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  
  // CSV data states
  csvData: string | null;
  parsedData: ParsedData | null;
  isLoading: boolean;
  
  // Review changes state
  reviewChanges: CSVRow[];
  selectedFilter: string;
  selectedTags: string[];
  setSelectedFilter: (filter: string) => void;
  setSelectedTags: (tags: string[]) => void;
  
  // RAG table state
  ragTableData: RagRow[];
  
  // Executive summary state
  executiveSummaryData: {
    original: string;
    aiVersions: {
      concise: string;
      buyer: string;
      lender: string;
      owner: string;
    };
  };
  
  // Actions
  fetchCSVData: () => Promise<void>;
  parseCSVData: () => void;
  resetAllData: () => void;
}

// Create the context
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Provider component
export function EditorProvider({ children }: { children: ReactNode }) {
  // File upload states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // CSV data states
  const [csvData, setCsvData] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Review changes state
  const [reviewChanges, setReviewChanges] = useState<CSVRow[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All Pages');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // RAG table state
  const [ragTableData, setRagTableData] = useState<RagRow[]>([]);
  
  // Executive summary state
  const [executiveSummaryData, setExecutiveSummaryData] = useState({
    original: '',
    aiVersions: {
      concise: '',
      buyer: '',
      lender: '',
      owner: ''
    }
  });

  // Fetch CSV data from API
  const fetchCSVData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/review-data');
      if (!response.ok) {
        throw new Error('Failed to fetch CSV data');
      }
      const data = await response.text();
      setCsvData(data);
    } catch (error) {
      console.error('Error fetching CSV data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse CSV data and populate all states
  const parseCSVData = () => {
    if (!csvData) return;

    try {
      // Import the parser dynamically to avoid SSR issues
      import('@/utils/csvParser').then(({ parseRawCSV, parseCSVData }) => {
        // First parse the raw CSV string into rows
        const rawRows = parseRawCSV(csvData);
        console.log('Raw CSV rows parsed:', rawRows.length);
        console.log('Sample raw row:', rawRows[0]);
        
        // Then parse the structured data
        const parsed = parseCSVData(rawRows);
        console.log('Structured data parsed:', {
          editTypes: parsed.editTypes.length,
          ragSuggestions: parsed.ragSuggestions.length,
          toneChanges: parsed.toneChanges.length
        });
        
        setParsedData(parsed);
        
        // Populate review changes (content suggestions)
        setReviewChanges(parsed.editTypes);
        console.log('Review changes set:', parsed.editTypes.length);
        
        // Populate RAG table data
        setRagTableData(parsed.ragSuggestions);
        console.log('RAG table data set:', parsed.ragSuggestions.length);
        
        // Populate executive summary data
        const summaryRows = parsed.editTypes.filter(row => 
          row.edit_type.includes('Executive Summary') || 
          row.edit_type.includes('executive summary')
        );
        
        if (summaryRows.length > 0) {
          const originalSummary = summaryRows.find(row => 
            !row.edit_type.includes('AI') && 
            !row.edit_type.includes('ai')
          );
          
          const aiVersions = summaryRows.filter(row => 
            row.edit_type.includes('AI') || 
            row.edit_type.includes('ai')
          );
          
          setExecutiveSummaryData({
            original: originalSummary?.proposed_revision || '',
            aiVersions: {
              concise: aiVersions.find(row => 
                row.edit_type.toLowerCase().includes('concise')
              )?.proposed_revision || '',
              buyer: aiVersions.find(row => 
                row.edit_type.toLowerCase().includes('buyer') ||
                row.edit_type.toLowerCase().includes('acquisition')
              )?.proposed_revision || '',
              lender: aiVersions.find(row => 
                row.edit_type.toLowerCase().includes('lender') ||
                row.edit_type.toLowerCase().includes('financing')
              )?.proposed_revision || '',
              owner: aiVersions.find(row => 
                row.edit_type.toLowerCase().includes('owner') ||
                row.edit_type.toLowerCase().includes('management')
              )?.proposed_revision || ''
            }
          });
        }
      });
    } catch (error) {
      console.error('Error parsing CSV data:', error);
    }
  };

  // Reset all data
  const resetAllData = () => {
    setUploadedFile(null);
    setCsvData(null);
    setParsedData(null);
    setReviewChanges([]);
    setRagTableData([]);
    setExecutiveSummaryData({
      original: '',
      aiVersions: { concise: '', buyer: '', lender: '', owner: '' }
    });
    setSelectedFilter('All Pages');
    setSelectedTags([]);
  };

  // Auto-fetch CSV data when component mounts
  useEffect(() => {
    fetchCSVData();
  }, []);

  // Auto-parse CSV data when it changes
  useEffect(() => {
    if (csvData) {
      parseCSVData();
    }
  }, [csvData]);

  const value: EditorContextType = {
    // File upload states
    uploadedFile,
    setUploadedFile,
    
    // CSV data states
    csvData,
    parsedData,
    isLoading,
    
    // Review changes state
    reviewChanges,
    selectedFilter,
    selectedTags,
    setSelectedFilter,
    setSelectedTags,
    
    // RAG table state
    ragTableData,
    
    // Executive summary state
    executiveSummaryData,
    
    // Actions
    fetchCSVData,
    parseCSVData,
    resetAllData
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

// Custom hook to use the editor context
export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
