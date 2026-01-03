import pdf from 'pdf-parse';
import { Fact, FactSource } from '@/types/fact';
import { getCanonicalField } from '../fieldMapping';
import { normalizeValue } from '../normalization';

export interface PDFParseResult {
  facts: Fact[];
  pageCount: number;
}

/**
 * Extracts key-value pairs from text using common patterns
 */
function extractKeyValuePairs(text: string, page: number, fileName: string): Fact[] {
  const facts: Fact[] = [];
  
  // Common patterns for key-value extraction
  const patterns = [
    // Pattern: "Key: Value" or "Key : Value"
    /^(.+?)\s*:\s*(.+)$/gm,
    // Pattern: "Key = Value"
    /^(.+?)\s*=\s*(.+)$/gm,
    // Pattern: "Key|Value" (pipe-delimited)
    /^(.+?)\s*\|\s*(.+)$/gm,
  ];
  
  const extractedPairs = new Set<string>();
  
  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    
    for (const match of matches) {
      const key = match[1]?.trim();
      const value = match[2]?.trim();
      
      // Skip if key or value is empty, too long, or too short
      if (!key || !value || key.length > 100 || value.length > 500 || key.length < 2) {
        continue;
      }
      
      // Skip if this pair was already extracted
      const pairKey = `${key}:${value}`;
      if (extractedPairs.has(pairKey)) {
        continue;
      }
      extractedPairs.add(pairKey);
      
      // Skip keys that look like headers or section titles
      if (/^(page|section|chapter|appendix|table|figure|note)/i.test(key)) {
        continue;
      }
      
      const canonicalField = getCanonicalField(key);
      const normalizedValue = normalizeValue(value, canonicalField);
      
      const source: FactSource = {
        fileName,
        fileType: 'pdf',
        location: `page ${page}`,
        confidence: 0.9, // Slightly lower confidence for PDF extraction
      };
      
      facts.push({
        field: key,
        canonicalField,
        value,
        normalizedValue,
        sources: [source],
      });
    }
  }
  
  return facts;
}

/**
 * Parses a PDF file and extracts facts
 */
export async function parsePDF(
  fileBuffer: Buffer,
  fileName: string
): Promise<PDFParseResult> {
  try {
    const data = await pdf(fileBuffer);
    const facts: Fact[] = [];
    
    // Extract facts from the full text
    const textByPage = data.text.split('\f'); // Form feed character separates pages
    
    for (let pageIndex = 0; pageIndex < textByPage.length; pageIndex++) {
      const pageText = textByPage[pageIndex];
      const pageFacts = extractKeyValuePairs(pageText, pageIndex + 1, fileName);
      facts.push(...pageFacts);
    }
    
    return {
      facts,
      pageCount: data.numpages,
    };
  } catch (error) {
    throw new Error(`PDF parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

