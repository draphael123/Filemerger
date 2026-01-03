'use client';

import { MergeResult, Fact } from '@/types/fact';

interface ExportButtonsProps {
  result: MergeResult;
}

export default function ExportButtons({ result }: ExportButtonsProps) {
  const exportAsText = () => {
    const lines = result.mergedFacts.map(fact => {
      const sources = fact.sources.map(s => `${s.fileName}:${s.location}`).join(', ');
      return `${fact.canonicalField.replace(/_/g, ' ').toUpperCase()}: ${fact.value} [Sources: ${sources}]`;
    });
    
    const text = lines.join('\n');
    downloadFile(text, 'merged-facts.txt', 'text/plain');
  };

  const exportAsCSV = () => {
    const headers = ['Field', 'Canonical Field', 'Value', 'Normalized Value', 'Sources'];
    const rows = result.mergedFacts.map(fact => [
      fact.field,
      fact.canonicalField,
      fact.value,
      fact.normalizedValue,
      fact.sources.map(s => `${s.fileName}:${s.location}`).join('; '),
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    
    downloadFile(csv, 'merged-facts.csv', 'text/csv');
  };

  const exportAsJSON = () => {
    const json = JSON.stringify(result, null, 2);
    downloadFile(json, 'merged-facts.json', 'application/json');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={exportAsText}
        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>Export as TXT</span>
      </button>

      <button
        onClick={exportAsCSV}
        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>Export as CSV</span>
      </button>

      <button
        onClick={exportAsJSON}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
        </svg>
        <span>Export as JSON</span>
      </button>
    </div>
  );
}

