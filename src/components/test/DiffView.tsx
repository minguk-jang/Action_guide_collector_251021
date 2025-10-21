import React, { useState } from 'react';
import * as Diff from 'diff';

interface DiffViewProps {
  original: string;
  modified: string;
}

export const DiffView: React.FC<DiffViewProps> = ({ original, modified }) => {
  const [viewMode, setViewMode] = useState<'text' | 'json'>('text');

  const formatJSON = (str: string) => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  };

  const getTextDiff = () => {
    return Diff.diffLines(original, modified);
  };

  const getJSONDiff = () => {
    const originalFormatted = formatJSON(original);
    const modifiedFormatted = formatJSON(modified);
    return Diff.diffLines(originalFormatted, modifiedFormatted);
  };

  const diff = viewMode === 'text' ? getTextDiff() : getJSONDiff();

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">비교 결과:</span>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('text')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'text'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            텍스트 Diff
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'json'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            JSON Diff
          </button>
        </div>
      </div>

      <div className="p-4 bg-white overflow-auto max-h-96">
        <div className="font-mono text-sm">
          {diff.map((part, index) => {
            const bgColor = part.added
              ? 'bg-green-100'
              : part.removed
              ? 'bg-red-100'
              : 'bg-transparent';
            const textColor = part.added
              ? 'text-green-800'
              : part.removed
              ? 'text-red-800'
              : 'text-gray-800';
            const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';

            return (
              <div key={index} className={`${bgColor} ${textColor}`}>
                {part.value.split('\n').map((line, lineIndex) => (
                  <div key={lineIndex}>
                    {line && (
                      <>
                        <span className="select-none opacity-50">{prefix}</span>
                        {line}
                      </>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
