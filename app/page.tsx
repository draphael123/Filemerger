'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import FactsDisplay from '@/components/FactsDisplay';
import ConflictsDisplay from '@/components/ConflictsDisplay';
import ExportButtons from '@/components/ExportButtons';
import { MergeResult } from '@/types/fact';

export default function Home() {
  const [result, setResult] = useState<MergeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesUpload = async (files: File[]) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process files');
      }

      const data: MergeResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-indigo-900 mb-2">
            Fountain File Merger
          </h1>
          <p className="text-lg text-gray-600">
            Merge CSV and PDF files with intelligent deduplication
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <FileUploader onUpload={handleFilesUpload} disabled={loading} />
          
          {loading && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Processing files...</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">Error: {error}</p>
            </div>
          )}
        </div>

        {result && (
          <>
            <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-indigo-600 font-medium">Files Processed</p>
                  <p className="text-2xl font-bold text-indigo-900">{result.totalFilesProcessed}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Facts Extracted</p>
                  <p className="text-2xl font-bold text-green-900">{result.totalFactsExtracted}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Facts Merged</p>
                  <p className="text-2xl font-bold text-blue-900">{result.totalFactsMerged}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-orange-600 font-medium">Conflicts Found</p>
                  <p className="text-2xl font-bold text-orange-900">{result.conflicts.length}</p>
                </div>
              </div>

              <ExportButtons result={result} />
            </div>

            {result.conflicts.length > 0 && (
              <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
                <ConflictsDisplay conflicts={result.conflicts} />
              </div>
            )}

            <div className="bg-white rounded-lg shadow-xl p-6">
              <FactsDisplay facts={result.mergedFacts} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

