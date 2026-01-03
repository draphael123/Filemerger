import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import { Fact, MergeResult } from '@/types/fact';
import { parseCSV } from '@/lib/parsers/csvParser';
import { parsePDF } from '@/lib/parsers/pdfParser';
import { deduplicateFacts, sortFacts } from '@/lib/deduplication';

// Disable body parser to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
  },
};

/**
 * Parses multipart form data and extracts files
 */
async function parseForm(req: NextApiRequest): Promise<File[]> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 100 * 1024 * 1024, // 100MB per file
      maxFiles: 1000, // Support up to 1000 files
      multiples: true,
    });
    
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      
      const fileArray: File[] = [];
      
      // Handle both single and multiple files
      if (files.files) {
        if (Array.isArray(files.files)) {
          fileArray.push(...files.files);
        } else {
          fileArray.push(files.files);
        }
      }
      
      resolve(fileArray);
    });
  });
}

/**
 * Processes a single file and extracts facts
 */
async function processFile(file: File): Promise<Fact[]> {
  const fileName = file.originalFilename || 'unknown';
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  
  try {
    if (fileExtension === 'csv') {
      const content = await fs.readFile(file.filepath, 'utf-8');
      const result = await parseCSV(content, fileName);
      return result.facts;
    } else if (fileExtension === 'pdf') {
      const buffer = await fs.readFile(file.filepath);
      const result = await parsePDF(buffer, fileName);
      return result.facts;
    } else {
      console.warn(`Unsupported file type: ${fileExtension} for file ${fileName}`);
      return [];
    }
  } catch (error) {
    console.error(`Error processing file ${fileName}:`, error);
    return [];
  } finally {
    // Clean up temporary file
    try {
      await fs.unlink(file.filepath);
    } catch (error) {
      console.error(`Error deleting temp file ${file.filepath}:`, error);
    }
  }
}

/**
 * Main API handler for file merging
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MergeResult | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Parse uploaded files
    const files = await parseForm(req);
    
    if (files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Process all files and extract facts
    const allFacts: Fact[] = [];
    let totalFactsExtracted = 0;
    
    for (const file of files) {
      const facts = await processFile(file);
      allFacts.push(...facts);
      totalFactsExtracted += facts.length;
    }
    
    // Deduplicate facts and detect conflicts
    const { mergedFacts, conflicts } = deduplicateFacts(allFacts);
    
    // Sort for consistent output
    const sortedFacts = sortFacts(mergedFacts);
    
    // Prepare response
    const result: MergeResult = {
      mergedFacts: sortedFacts,
      conflicts,
      totalFilesProcessed: files.length,
      totalFactsExtracted,
      totalFactsMerged: sortedFacts.length,
    };
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error processing files:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}

