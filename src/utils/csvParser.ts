export interface CSVRow {
  section_name: string;
  original_text: string;
  proposed_revision: string;
  justification: string;
  edit_type: string;
}

export interface ParsedData {
  ragSuggestions: {
    lenient: CSVRow[];
    critical: CSVRow[];
  };
  toneChanges: CSVRow[];
  editTypes: CSVRow[];
}

export function parseCSVData(csvData: CSVRow[]): ParsedData {
  const result: ParsedData = {
    ragSuggestions: { lenient: [], critical: [] },
    toneChanges: [],
    editTypes: []
  };

  csvData.forEach(row => {
    if (row.edit_type.startsWith('RAG suggestion')) {
      if (row.edit_type.includes('lenient')) {
        result.ragSuggestions.lenient.push(row);
      } else if (row.edit_type.includes('critical')) {
        result.ragSuggestions.critical.push(row);
      }
    } else if (row.edit_type.startsWith('Tone -')) {
      result.toneChanges.push(row);
    } else {
      // This is the comma-separated edit types (like "Grammar, Clarity, Internal Consistency")
      result.editTypes.push(row);
    }
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
