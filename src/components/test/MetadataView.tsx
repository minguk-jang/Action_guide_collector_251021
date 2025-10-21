import React from 'react';

interface MetadataViewProps {
  metadata: {
    model: string;
    tokens: number;
    latency: number;
  } | null;
}

export const MetadataView: React.FC<MetadataViewProps> = ({ metadata }) => {
  if (!metadata) {
    return (
      <div className="text-sm text-gray-500">
        📊 메타데이터: -
      </div>
    );
  }

  return (
    <div className="text-sm space-y-1">
      <div className="font-medium text-gray-700">📊 메타데이터</div>
      <div className="text-gray-600">Model: {metadata.model}</div>
      <div className="text-gray-600">Tokens: {metadata.tokens.toLocaleString()}</div>
      <div className="text-gray-600">Latency: {metadata.latency.toFixed(2)}s</div>
    </div>
  );
};
