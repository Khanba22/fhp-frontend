export interface WordChange {
    original: string;
    corrected: string;
    type: 'grammar' | 'technical' | 'clarity' | 'formatting' | 'other';
  }