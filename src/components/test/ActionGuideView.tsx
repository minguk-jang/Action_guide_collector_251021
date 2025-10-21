import React, { useState } from 'react';
import type { ParsedActionGuide } from '../../types/test';
import { MdExpandMore, MdExpandLess, MdCheckCircle, MdError } from 'react-icons/md';

interface ActionGuideViewProps {
  actionGuide: ParsedActionGuide;
}

export const ActionGuideView: React.FC<ActionGuideViewProps> = ({
  actionGuide,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const renderJSON = (obj: any, indent = 0): React.ReactNode => {
    if (obj === null || obj === undefined) {
      return <span className="text-gray-500">null</span>;
    }

    if (typeof obj !== 'object') {
      const color =
        typeof obj === 'string'
          ? 'text-green-600'
          : typeof obj === 'number'
          ? 'text-blue-600'
          : typeof obj === 'boolean'
          ? 'text-purple-600'
          : 'text-gray-600';
      return (
        <span className={color}>
          {typeof obj === 'string' ? `"${obj}"` : String(obj)}
        </span>
      );
    }

    const isArray = Array.isArray(obj);
    const entries = isArray ? obj : Object.entries(obj);

    return (
      <div style={{ marginLeft: indent > 0 ? '1rem' : 0 }}>
        <span className="text-gray-600">{isArray ? '[' : '{'}</span>
        {isArray ? (
          entries.map((item: any, index: number) => (
            <div key={index} className="ml-4">
              <span className="text-gray-500">{index}: </span>
              {renderJSON(item, indent + 1)}
              {index < entries.length - 1 && ','}
            </div>
          ))
        ) : (
          entries.map(([key, value]: [string, any], index: number) => (
            <div key={key} className="ml-4">
              <span className="text-blue-700">"{key}"</span>
              <span className="text-gray-600">: </span>
              {renderJSON(value, indent + 1)}
              {index < entries.length - 1 && ','}
            </div>
          ))
        )}
        <span className="text-gray-600">{isArray ? ']' : '}'}</span>
      </div>
    );
  };

  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          🔍 파싱된 Action Guide
          {actionGuide.isValid ? (
            <MdCheckCircle className="text-green-500" size={16} />
          ) : (
            <MdError className="text-red-500" size={16} />
          )}
        </h3>
        {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
      </div>

      {isExpanded && (
        <>
          {actionGuide.errors.length > 0 && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {actionGuide.errors.map((error, index) => (
                <div key={index}>⚠️ {error}</div>
              ))}
            </div>
          )}

          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 overflow-auto max-h-64">
            {actionGuide.parsed ? (
              <div className="font-mono text-xs">
                {renderJSON(actionGuide.parsed)}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                {actionGuide.raw || 'No action guide found'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
