export interface FactSource {
  fileName: string;
  fileType: 'csv' | 'pdf';
  location: string; // row number for CSV, page number for PDF
  confidence: number; // 0-1, always 1 for exact extraction
}

export interface Fact {
  field: string; // Original field name as found in source
  canonicalField: string; // Normalized field name (e.g., "phone_number")
  value: string; // Original value as found in source
  normalizedValue: string; // Normalized value for comparison
  sources: FactSource[];
}

export interface Conflict {
  canonicalField: string;
  values: Array<{
    value: string;
    normalizedValue: string;
    sources: FactSource[];
  }>;
}

export interface MergeResult {
  mergedFacts: Fact[];
  conflicts: Conflict[];
  totalFilesProcessed: number;
  totalFactsExtracted: number;
  totalFactsMerged: number;
}

export type FieldCategory = 'name' | 'address' | 'id' | 'email' | 'phone' | 'date' | 'currency' | 'generic';

