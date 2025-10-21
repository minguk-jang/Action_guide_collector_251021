import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { PromptView } from '../components/test/PromptView';
import { ActionGuideView } from '../components/test/ActionGuideView';
import { ResponseView } from '../components/test/ResponseView';
import { MetadataView } from '../components/test/MetadataView';
import { DiffView } from '../components/test/DiffView';
import { parseActionGuide } from '../utils/actionGuideParser';
import { useActionGuideStore } from '../stores/actionGuideStore';

// Mock Langfuse data
const MOCK_LANGFUSE_DATA = {
  prompt: `You are an AI assistant that helps users navigate web applications.

Task: Click the login button on the homepage.

<action_guide>
{
  "name": "Login Flow",
  "version": "1.0.0",
  "steps": [
    {
      "id": "step1",
      "action": "navigate",
      "target": "https://example.com"
    },
    {
      "id": "step2",
      "action": "click",
      "selector": "#login-button"
    }
  ]
}
</action_guide>

Please execute this action guide.`,
  response: `I'll help you execute the login flow.

Step 1: Navigating to https://example.com
✓ Success

Step 2: Clicking the login button
✓ Success

The action guide has been executed successfully. The user is now on the login page.`,
  model: 'gpt-4-turbo',
  tokens: 1234,
  latency: 2.3,
};

export const Test: React.FC = () => {
  const { addGuide } = useActionGuideStore();
  const [observationId, setObservationId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>(
    'idle'
  );

  // Original (from Langfuse)
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [originalResponse, setOriginalResponse] = useState('');
  const [originalMetadata, setOriginalMetadata] = useState<{
    model: string;
    tokens: number;
    latency: number;
  } | null>(null);

  // Modified
  const [modifiedPrompt, setModifiedPrompt] = useState('');
  const [modifiedResponse, setModifiedResponse] = useState<string | null>(null);
  const [modifiedMetadata, setModifiedMetadata] = useState<{
    model: string;
    tokens: number;
    latency: number;
  } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleLoadObservation = () => {
    if (!observationId.trim()) {
      alert('Observation ID를 입력해주세요');
      return;
    }

    setStatus('loading');

    // Mock API call - 실제로는 Langfuse API 호출
    setTimeout(() => {
      setOriginalPrompt(MOCK_LANGFUSE_DATA.prompt);
      setOriginalResponse(MOCK_LANGFUSE_DATA.response);
      setOriginalMetadata({
        model: MOCK_LANGFUSE_DATA.model,
        tokens: MOCK_LANGFUSE_DATA.tokens,
        latency: MOCK_LANGFUSE_DATA.latency,
      });
      setModifiedPrompt(MOCK_LANGFUSE_DATA.prompt);
      setModifiedResponse(null);
      setModifiedMetadata(null);
      setStatus('loaded');
    }, 1000);
  };

  const handleExecuteLLM = () => {
    setIsExecuting(true);
    setModifiedResponse(null);

    // Mock LLM execution - 실제로는 LLM API 호출
    setTimeout(() => {
      setModifiedResponse(
        `[Modified Prompt Response]\n\nI'll execute the updated action guide.\n\nStep 1: ✓\nStep 2: ✓\n\nExecution completed successfully with modified prompt.`
      );
      setModifiedMetadata({
        model: 'gpt-4-turbo',
        tokens: 1156,
        latency: 2.1,
      });
      setIsExecuting(false);
    }, 2000);
  };

  const handleReset = () => {
    setModifiedPrompt(originalPrompt);
    setModifiedResponse(null);
    setModifiedMetadata(null);
  };

  const handleSaveAsActionGuide = () => {
    const parsed = parseActionGuide(modifiedPrompt);
    if (!parsed.isValid || !parsed.parsed) {
      alert('유효한 액션가이드가 없습니다');
      return;
    }

    addGuide({
      name: parsed.parsed.name || 'Untitled',
      version: parsed.parsed.version || '1.0.0',
      description: `Langfuse ${observationId}에서 가져옴`,
      status: 'draft',
      data: parsed.parsed,
    });

    alert('액션가이드가 대시보드에 저장되었습니다!');
  };

  const originalParsed = parseActionGuide(originalPrompt);
  const modifiedParsed = parseActionGuide(modifiedPrompt);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">
          테스트 - Langfuse Observation 비교
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Langfuse Observation ID 입력..."
            value={observationId}
            onChange={setObservationId}
            className="flex-1"
          />
          <Button onClick={handleLoadObservation} disabled={status === 'loading'}>
            {status === 'loading' ? '로딩 중...' : '불러오기'}
          </Button>
        </div>
        <div className="mt-2 text-sm">
          상태:{' '}
          {status === 'idle' && '⚪ 대기중'}
          {status === 'loading' && '🔵 로딩중'}
          {status === 'loaded' && '🟢 성공'}
          {status === 'error' && '🔴 실패'}
        </div>
      </div>

      {status === 'loaded' && (
        <>
          {/* Split View */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Original */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                원본 (Original)
              </h3>

              <PromptView prompt={originalPrompt} />
              <ActionGuideView actionGuide={originalParsed} />
              <div className="border-t pt-4 mt-4">
                <ResponseView response={originalResponse} />
                <MetadataView metadata={originalMetadata} />
              </div>
            </div>

            {/* Modified */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                수정본 (Modified)
              </h3>

              <PromptView
                prompt={modifiedPrompt}
                editable
                onChange={setModifiedPrompt}
              />
              <ActionGuideView actionGuide={modifiedParsed} />

              <div className="flex gap-2 mb-4">
                <Button
                  onClick={handleExecuteLLM}
                  disabled={isExecuting}
                  variant="primary"
                >
                  {isExecuting ? '실행 중...' : 'LLM 실행'}
                </Button>
                <Button onClick={handleReset} variant="secondary">
                  초기화
                </Button>
              </div>

              <div className="border-t pt-4">
                <ResponseView response={modifiedResponse} isLoading={isExecuting} />
                <MetadataView metadata={modifiedMetadata} />
              </div>
            </div>
          </div>

          {/* Diff View */}
          {modifiedResponse && (
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold mb-4">비교 결과</h3>
              <DiffView original={originalResponse} modified={modifiedResponse} />
            </div>
          )}

          {/* Actions */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex gap-2 justify-end">
              <Button
                onClick={handleSaveAsActionGuide}
                variant="success"
                disabled={!modifiedParsed.isValid}
              >
                📋 액션가이드로 저장
              </Button>
              <Button onClick={handleExecuteLLM} disabled={isExecuting}>
                🔄 다시 시도
              </Button>
            </div>
          </div>
        </>
      )}

      {status === 'idle' && (
        <div className="bg-white p-12 rounded-lg shadow border border-gray-200 text-center">
          <p className="text-gray-500 mb-4">
            Langfuse Observation ID를 입력하고 '불러오기'를 클릭하세요
          </p>
          <p className="text-sm text-gray-400">
            (현재는 목업 데이터가 로드됩니다)
          </p>
        </div>
      )}
    </div>
  );
};
