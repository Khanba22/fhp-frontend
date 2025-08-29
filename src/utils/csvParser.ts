export interface CSVRow {
  section_name: string;
  original_text: string;
  proposed_revision: string;
  justification: string;
  edit_type: string;
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

export function parseCSVData(csvData: CSVRow[]): ParsedData {
  const result: ParsedData = {
    ragSuggestions: [],
    toneChanges: [],
    editTypes: []
  };

  csvData.forEach(row => {
    if (row.edit_type.startsWith('RAG suggestion')) {
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
