import { WordChange } from "./WordChange";

export interface ContentBlock {
    id: string;
    page: string;
    revisedText: string;
    originalText: string;
    wordLevelChanges: WordChange[];
    justification?: string;
    editTypes: string[];
    diffOutput?: string; // HTML string with styled diff output
  }

