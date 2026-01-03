import Papa from 'papaparse';
import { Fact, FactSource } from '@/types/fact';
import { getCanonicalField } from '../fieldMapping';
import { normalizeValue } from '../normalization';

export interface CSVParseResult {
  facts: Fact[];
  rowCount: number;
}

/**
 * Parses a CSV file and extracts facts
 */
export async function parseCSV(
  fileContent: string,
  fileName: string
): Promise<CSVParseResult> {
  return new Promise((resolve, reject) => {
    const facts: Fact[] = [];
    let rowCount = 0;
    
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep everything as strings
      complete: (results) => {
        try {
          const data = results.data as Record<string, string>[];
          
          for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            const row = data[rowIndex];
            rowCount++;
            
            // Extract each field as a fact
            for (const [field, value] of Object.entries(row)) {
              // Skip empty values
              if (!value || value.trim() === '') {
                continue;
              }
              
              const canonicalField = getCanonicalField(field);
              const normalizedValue = normalizeValue(value, canonicalField);
              
              const source: FactSource = {
                fileName,
                fileType: 'csv',
                location: `row ${rowIndex + 2}`, // +2 because row 1 is header, and 0-indexed
                confidence: 1.0,
              };
              
              facts.push({
                field,
                canonicalField,
                value,
                normalizedValue,
                sources: [source],
              });
            }
          }
          
          resolve({ facts, rowCount });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
}

