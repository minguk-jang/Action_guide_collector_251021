import React from 'react';

interface ResponseViewProps {
  response: string | null;
  isLoading?: boolean;
}

export const ResponseView: React.FC<ResponseViewProps> = ({
  response,
  isLoading = false,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        💬 LLM 응답
      </h3>
      <div className="w-full min-h-48 p-3 border border-gray-200 rounded-lg bg-white overflow-auto">
        {isLoading ? (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
            실행 중...
          </div>
        ) : response ? (
          <pre className="whitespace-pre-wrap text-sm">{response}</pre>
        ) : (
          <p className="text-gray-400 text-sm">
            [실행 후 표시됨]
          </p>
        )}
      </div>
    </div>
  );
};
