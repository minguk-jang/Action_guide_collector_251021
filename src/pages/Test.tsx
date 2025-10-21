import React, { useState } from 'react';
import { MdCompare, MdPlayArrow, MdRefresh, MdSave } from 'react-icons/md';
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

  const statusConfig = {
    idle: { emoji: '⚪', label: '대기중', color: 'text-gray-500' },
    loading: { emoji: '🔵', label: '로딩중', color: 'text-blue-500' },
    loaded: { emoji: '🟢', label: '성공', color: 'text-green-500' },
    error: { emoji: '🔴', label: '실패', color: 'text-red-500' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-xl text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <MdCompare size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Langfuse Observation 비교</h3>
            <p className="text-indigo-100 text-sm">프롬프트를 비교하고 테스트하세요</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="Langfuse Observation ID 입력..."
            value={observationId}
            onChange={setObservationId}
            className="flex-1"
          />
          <Button
            onClick={handleLoadObservation}
            disabled={status === 'loading'}
            variant="secondary"
          >
            {status === 'loading' ? '로딩 중...' : '불러오기'}
          </Button>
        </div>
        <div className={`mt-4 text-sm font-medium ${statusConfig[status].color}`}>
          <span className="mr-2">{statusConfig[status].emoji}</span>
          상태: {statusConfig[status].label}
        </div>
      </div>

      {status === 'loaded' && (
        <>
          {/* Split View */}
          <div className="grid grid-cols-2 gap-6">
            {/* Original */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-indigo-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                  A
                </div>
                <h3 className="text-xl font-bold text-gray-900">원본 (Original)</h3>
              </div>

              <PromptView prompt={originalPrompt} />
              <ActionGuideView actionGuide={originalParsed} />
              <div className="border-t-2 border-gray-100 pt-6 mt-6">
                <ResponseView response={originalResponse} />
                <MetadataView metadata={originalMetadata} />
              </div>
            </div>

            {/* Modified */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-purple-200">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                  B
                </div>
                <h3 className="text-xl font-bold text-gray-900">수정본 (Modified)</h3>
              </div>

              <PromptView
                prompt={modifiedPrompt}
                editable
                onChange={setModifiedPrompt}
              />
              <ActionGuideView actionGuide={modifiedParsed} />

              <div className="flex gap-2 mb-6">
                <Button
                  onClick={handleExecuteLLM}
                  disabled={isExecuting}
                  variant="primary"
                  className="flex-1"
                >
                  <div className="flex items-center justify-center gap-2">
                    <MdPlayArrow size={20} />
                    {isExecuting ? '실행 중...' : 'LLM 실행'}
                  </div>
                </Button>
                <Button onClick={handleReset} variant="secondary">
                  <MdRefresh size={20} />
                </Button>
              </div>

              <div className="border-t-2 border-gray-100 pt-6">
                <ResponseView response={modifiedResponse} isLoading={isExecuting} />
                <MetadataView metadata={modifiedMetadata} />
              </div>
            </div>
          </div>

          {/* Diff View */}
          {modifiedResponse && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MdCompare size={24} className="text-purple-600" />
                비교 결과
              </h3>
              <DiffView original={originalResponse} modified={modifiedResponse} />
            </div>
          )}

          {/* Actions */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 rounded-2xl shadow-xl">
            <div className="flex gap-3 justify-end">
              <Button
                onClick={handleSaveAsActionGuide}
                variant="secondary"
                disabled={!modifiedParsed.isValid}
                size="lg"
              >
                <div className="flex items-center gap-2">
                  <MdSave size={20} />
                  액션가이드로 저장
                </div>
              </Button>
              <Button onClick={handleExecuteLLM} disabled={isExecuting} variant="secondary" size="lg">
                <div className="flex items-center gap-2">
                  <MdRefresh size={20} />
                  다시 시도
                </div>
              </Button>
            </div>
          </div>
        </>
      )}

      {status === 'idle' && (
        <div className="bg-white/60 backdrop-blur-sm p-20 rounded-2xl border-2 border-dashed border-gray-300 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdCompare size={40} className="text-purple-600" />
          </div>
          <p className="text-gray-600 text-lg mb-2 font-semibold">
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
