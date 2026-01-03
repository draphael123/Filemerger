'use client';

import { Fact } from '@/types/fact';
import { useState } from 'react';

interface FactsDisplayProps {
  facts: Fact[];
}

export default function FactsDisplay({ facts }: FactsDisplayProps) {
  const [expandedFacts, setExpandedFacts] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpanded = (index: number) => {
    setExpandedFacts(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const filteredFacts = facts.filter(fact => 
    fact.canonicalField.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fact.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Merged Facts ({filteredFacts.length})
        </h2>
        <input
          type="text"
          placeholder="Search facts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredFacts.map((fact, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-indigo-600 uppercase">
                    {fact.canonicalField.replace(/_/g, ' ')}
                  </span>
                  {fact.sources.length > 1 && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                      {fact.sources.length} sources
                    </span>
                  )}
                </div>
                <p className="mt-1 text-gray-900 font-medium">{fact.value}</p>
                {fact.normalizedValue !== fact.value.toLowerCase().trim() && (
                  <p className="mt-1 text-xs text-gray-500">
                    Normalized: {fact.normalizedValue}
                  </p>
                )}
              </div>
              <button
                onClick={() => toggleExpanded(index)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className={`h-5 w-5 transform transition-transform ${expandedFacts.has(index) ? 'rotate-180' : ''}`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>

            {expandedFacts.has(index) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sources:</h4>
                <div className="space-y-2">
                  {fact.sources.map((source, sourceIndex) => (
                    <div
                      key={sourceIndex}
                      className="text-sm bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">{source.fileName}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600 uppercase text-xs">{source.fileType}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{source.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFacts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No facts found matching your search.</p>
        </div>
      )}
    </div>
  );
}

