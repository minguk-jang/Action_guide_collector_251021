import React from 'react';

interface PromptViewProps {
  prompt: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export const PromptView: React.FC<PromptViewProps> = ({
  prompt,
  editable = false,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        📝 Prompt
      </h3>
      {editable ? (
        <textarea
          value={prompt}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          placeholder="Enter prompt..."
        />
      ) : (
        <div className="w-full h-64 p-3 border border-gray-200 rounded-lg font-mono text-sm overflow-auto bg-gray-50">
          <pre className="whitespace-pre-wrap">{prompt}</pre>
        </div>
      )}
    </div>
  );
};
