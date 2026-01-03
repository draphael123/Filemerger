'use client';

import { Conflict } from '@/types/fact';
import { useState } from 'react';

interface ConflictsDisplayProps {
  conflicts: Conflict[];
}

export default function ConflictsDisplay({ conflicts }: ConflictsDisplayProps) {
  const [expandedConflicts, setExpandedConflicts] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    setExpandedConflicts(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <svg
          className="h-6 w-6 text-orange-500"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h2 className="text-2xl font-bold text-gray-800">
          Conflicts Detected ({conflicts.length})
        </h2>
      </div>
      
      <p className="text-sm text-gray-600">
        These fields have multiple different values across your files. Please review and resolve manually.
      </p>

      <div className="space-y-3">
        {conflicts.map((conflict, index) => (
          <div
            key={index}
            className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 uppercase">
                  {conflict.canonicalField.replace(/_/g, ' ')}
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  {conflict.values.length} different values found
                </p>
              </div>
              <button
                onClick={() => toggleExpanded(index)}
                className="ml-4 text-orange-500 hover:text-orange-700"
              >
                <svg
                  className={`h-5 w-5 transform transition-transform ${expandedConflicts.has(index) ? 'rotate-180' : ''}`}
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

            {expandedConflicts.has(index) && (
              <div className="mt-4 space-y-3">
                {conflict.values.map((valueData, valueIndex) => (
                  <div
                    key={valueIndex}
                    className="bg-white border border-orange-200 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs text-orange-600 font-medium">
                          Value #{valueIndex + 1}
                        </span>
                        <p className="text-gray-900 font-medium mt-1">{valueData.value}</p>
                        {valueData.normalizedValue !== valueData.value.toLowerCase().trim() && (
                          <p className="text-xs text-gray-500 mt-1">
                            Normalized: {valueData.normalizedValue}
                          </p>
                        )}
                      </div>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        {valueData.sources.length} source{valueData.sources.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {valueData.sources.map((source, sourceIndex) => (
                        <div
                          key={sourceIndex}
                          className="text-xs bg-gray-50 p-2 rounded flex items-center space-x-2"
                        >
                          <span className="font-medium text-gray-700">{source.fileName}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{source.location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

