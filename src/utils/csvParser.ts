export interface CSVRow {
  section_name: string;
  original_text: string;
  proposed_revision: string;
  justification: string;
  edit_type: string;
  diff_output?: string; // HTML string with styled diff output
}

export interface RagRow extends CSVRow {
  system_name: string;
  critical_safety: 'Red' | 'Amber' | 'Green';
  critical_cost: 'Red' | 'Amber' | 'Green';
  lenient_safety: 'Red' | 'Amber' | 'Green';
  lenient_cost: 'Red' | 'Amber' | 'Green';
  critical_justification?: string;
  lenient_justification?: string;
}

export interface ParsedData {
  ragSuggestions: RagRow[];
  toneChanges: CSVRow[];
  editTypes: CSVRow[];
}

export function parseRawCSV(csvString: string): CSVRow[] {
  // Improved CSV parsing that handles quoted fields with commas better
  const lines = csvString.split('\n').filter(line => line.trim());
  const rows: CSVRow[] = [];
  
  // Skip header row if it exists
  const startIndex = lines[0]?.includes('section_name') ? 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Improved CSV parsing - better handling of quoted fields with commas
    const fields: string[] = [];
    let currentField = '';
    let inQuotes = false;
    let escapeNext = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (escapeNext) {
        currentField += char;
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    // Add the last field
    fields.push(currentField.trim());
    
    // Remove quotes from fields and clean up
    const cleanFields = fields.map(field => {
      let cleaned = field.replace(/^"|"$/g, ''); // Remove outer quotes
      cleaned = cleaned.replace(/""/g, '"'); // Handle escaped quotes
      return cleaned.trim();
    });
    
    // Only add rows that have all required fields
    if (cleanFields.length >= 5) {
      const row = {
        section_name: cleanFields[0] || '',
        original_text: cleanFields[1] || '',
        proposed_revision: cleanFields[2] || '',
        justification: cleanFields[3] || '',
        edit_type: cleanFields[4] || '',
        diff_output: cleanFields[5] || '' // Optional diff output field
      };
      
      // Basic validation - only filter out obviously broken rows
      const isValidRow = 
        row.section_name.length > 0 &&
        row.original_text.length > 0 &&
        row.proposed_revision.length > 0 &&
        row.justification.length > 0 &&
        row.edit_type.length > 0 &&
        // Check for obvious malformed data
        !row.section_name.includes('undefined') &&
        !row.original_text.includes('undefined') &&
        !row.proposed_revision.includes('undefined') &&
        !row.justification.includes('undefined') &&
        !row.edit_type.includes('undefined');
      
      if (isValidRow) {
        rows.push(row);
      } else {
        console.log('Filtered out malformed row at parsing level:', {
          line: i + 1,
          fields: cleanFields
        });
      }
    }
  }
  
  console.log(`Parsed ${lines.length - startIndex} raw CSV lines, kept ${rows.length} valid rows`);
  return rows;
}

export function parseCSVData(csvData: CSVRow[]): ParsedData {
  const result: ParsedData = {
    ragSuggestions: [],
    toneChanges: [],
    editTypes: []
  };

  csvData.forEach(row => {
    // Check if this is a RAG suggestion row - look for the exact pattern "RAG suggestion"
    const isRagSuggestion = row.edit_type.toLowerCase().includes('rag suggestion');
    
    if (isRagSuggestion) {
      // Parse RAG data from the proposed_revision field which contains the assessment changes
      const proposedRevision = row.proposed_revision.toLowerCase();
      const justification = row.justification;
      
      // Extract system name from proposed_revision (it contains the actual system name)
      let systemName = row.section_name.split(',')[1]?.trim() || row.section_name;
      
      // Try to extract system name from proposed_revision if it's more specific
      if (proposedRevision.includes(':')) {
        const systemPart = proposedRevision.split(':')[0];
        if (systemPart && systemPart !== '-') {
          systemName = systemPart.trim();
        }
      }
      
      // Parse safety and cost changes from proposed_revision
      let safety: 'Red' | 'Amber' | 'Green' = 'Amber';
      let cost: 'Red' | 'Amber' | 'Green' = 'Amber';
      
      // Extract safety assessment
      if (proposedRevision.includes('safety change to green')) {
        safety = 'Green';
      } else if (proposedRevision.includes('safety change to red')) {
        safety = 'Red';
      } else if (proposedRevision.includes('safety change to amber')) {
        safety = 'Amber';
      }
      
      // Extract cost assessment (look for "operation / cost" or "cost" changes)
      if (proposedRevision.includes('operation / cost change to green') || proposedRevision.includes('cost change to green')) {
        cost = 'Green';
      } else if (proposedRevision.includes('operation / cost change to red') || proposedRevision.includes('cost change to red')) {
        cost = 'Red';
      } else if (proposedRevision.includes('operation / cost change to amber') || proposedRevision.includes('cost change to amber')) {
        cost = 'Amber';
      }
      
      // Determine if this is critical or lenient based on edit_type
      const isLenient = row.edit_type.includes('lenient');
      
      const ragRow: RagRow = {
        ...row,
        system_name: systemName,
        critical_safety: isLenient ? 'Amber' : safety, // Default for critical
        critical_cost: isLenient ? 'Amber' : cost,     // Default for critical
        lenient_safety: isLenient ? safety : 'Green',  // Default for lenient
        lenient_cost: isLenient ? cost : 'Amber',      // Default for lenient
        critical_justification: isLenient ? undefined : justification,
        lenient_justification: isLenient ? justification : undefined
      };
      result.ragSuggestions.push(ragRow);
      
      // Debug logging for RAG parsing
      console.log('RAG Row parsed:', {
        system: systemName,
        isLenient,
        safety,
        cost,
        editType: row.edit_type
      });
    } else if (row.edit_type.startsWith('Tone')) {
      result.toneChanges.push(row);
    } else {
      // This is the comma-separated edit types (like "Grammar, Clarity, Internal Consistency")
      // These are the content recommendation rows
      
              // Filter out only obviously malformed rows
        const isValidContentRow = 
          row.section_name && 
          row.section_name.trim() !== '' &&
          row.original_text && 
          row.original_text.trim() !== '' &&
          row.proposed_revision && 
          row.proposed_revision.trim() !== '' &&
          row.justification && 
          row.justification.trim() !== '' &&
          row.edit_type && 
          row.edit_type.trim() !== '' &&
          // Check that the edit_type contains valid categories (not broken text)
          row.edit_type.includes(',') &&
          // Only filter out rows with obvious broken text patterns
          !row.original_text.toLowerCase().includes('this is an example') &&
          !row.proposed_revision.toLowerCase().includes('this is an example') &&
          !row.justification.toLowerCase().includes('this is an example') &&
          !row.original_text.toLowerCase().includes('your task is to') &&
          !row.proposed_revision.toLowerCase().includes('your task is to') &&
          !row.justification.toLowerCase().includes('your task is to') &&
          // Ensure the edit_type contains recognizable categories
          (row.edit_type.includes('Grammar') || 
           row.edit_type.includes('Clarity') || 
           row.edit_type.includes('Formatting') || 
           row.edit_type.includes('Professionalism') ||
           row.edit_type.includes('Technical') ||
           row.edit_type.includes('Consistency') ||
           row.edit_type.includes('Risk'));
      
      if (isValidContentRow) {
        result.editTypes.push(row);
        
        // Debug logging for content recommendation rows
        console.log('Content recommendation row:', {
          section: row.section_name,
          editType: row.edit_type,
          originalText: row.original_text.substring(0, 50) + '...'
        });
      } else {
        console.log('Filtered out malformed row:', {
          section: row.section_name,
          editType: row.edit_type,
          originalText: row.original_text.substring(0, 50) + '...',
          reason: 'Failed validation checks'
        });
      }
    }
  });

  // Debug logging to see what we're getting
  console.log('Parsed CSV Data:', {
    totalRows: csvData.length,
    ragSuggestions: result.ragSuggestions.length,
    toneChanges: result.toneChanges.length,
    editTypes: result.editTypes.length,
    sampleEditTypes: result.editTypes.slice(0, 3).map(row => ({
      section: row.section_name,
      editType: row.edit_type,
      original: row.original_text.substring(0, 50) + '...'
    }))
  });

  return result;
}

export function extractEditTypes(editTypeString: string): string[] {
  return editTypeString.split(',').map(type => type.trim());
}

export function createWordChanges(originalText: string, proposedRevision: string, editTypes: string[]): Array<{
  original: string;
  corrected: string;
  type: 'grammar' | 'technical' | 'clarity' | 'formatting' | 'other';
}> {
  // This is a simplified version - in a real implementation, you'd want to use
  // a diff algorithm to identify the actual word-level changes
  const changes: Array<{
    original: string;
    corrected: string;
    type: 'grammar' | 'technical' | 'clarity' | 'formatting' | 'other';
  }> = [];

  // For now, return a mock change based on edit types
  if (editTypes.includes('Grammar')) {
    changes.push({
      original: 'advane',
      corrected: 'advanced',
      type: 'grammar'
    });
  }

  if (editTypes.includes('Clarity')) {
    changes.push({
      original: 'safety',
      corrected: 'security',
      type: 'clarity'
    });
  }

  if (editTypes.includes('Technical')) {
    changes.push({
      original: 'system',
      corrected: 'systems',
      type: 'technical'
    });
  }

  // Add more realistic changes based on the actual text differences
  if (editTypes.includes('Internal Consistency')) {
    changes.push({
      original: '6th',
      corrected: 'sixth',
      type: 'grammar'
    });
  }

  if (editTypes.includes('Professionalism & Presentation')) {
    changes.push({
      original: 'covering',
      corrected: 'comprising',
      type: 'clarity'
    });
  }

  if (editTypes.includes('Formatting')) {
    changes.push({
      original: 'on site',
      corrected: 'on-site',
      type: 'formatting'
    });
  }

  // Add more changes to make the inline text more visible
  if (editTypes.includes('Grammar')) {
    changes.push({
      original: 'The is a',
      corrected: 'The property is an',
      type: 'grammar'
    });
  }

  if (editTypes.includes('Technical Accuracy')) {
    changes.push({
      original: 'Air Handling units',
      corrected: 'Air Handling Units',
      type: 'technical'
    });
  }

  return changes;
}
