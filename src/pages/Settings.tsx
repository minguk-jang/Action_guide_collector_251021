import React, { useEffect, useState } from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { useSettingsStore } from '../stores/settingsStore';
import { localStorageService } from '../services/localStorage';
import { downloadJSON } from '../utils/helpers';

export const Settings: React.FC = () => {
  const { settings, loadSettings, updateSettings } = useSettingsStore();
  const [backendEndpoint, setBackendEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'testing' | 'success' | 'error'
  >('idle');

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    setBackendEndpoint(settings.backendEndpoint);
    setApiKey(settings.apiKey);
  }, [settings]);

  const handleSaveSettings = () => {
    updateSettings({
      backendEndpoint,
      apiKey,
    });
    alert('설정이 저장되었습니다');
  };

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    // Mock connection test
    setTimeout(() => {
      setConnectionStatus('success');
      setTimeout(() => setConnectionStatus('idle'), 3000);
    }, 1000);
  };

  const handleExportData = () => {
    const data = localStorageService.exportData();
    downloadJSON(JSON.parse(data), `action-guides-export-${Date.now()}.json`);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonString = event.target?.result as string;
            localStorageService.importData(jsonString);
            alert('데이터를 성공적으로 가져왔습니다');
            window.location.reload();
          } catch (error) {
            alert('데이터 가져오기 실패: ' + (error as Error).message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (
      confirm(
        '모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
      )
    ) {
      localStorageService.clearAll();
      alert('모든 데이터가 삭제되었습니다');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Backend Connection */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">백엔드 연결 설정</h3>

          <div className="space-y-4">
            <Input
              label="API Endpoint"
              value={backendEndpoint}
              onChange={setBackendEndpoint}
              placeholder="https://api.example.com"
            />

            <Input
              label="API Key"
              value={apiKey}
              onChange={setApiKey}
              type="password"
              placeholder="Enter your API key"
            />

            <div className="flex gap-2">
              <Button onClick={handleSaveSettings} variant="primary">
                설정 저장
              </Button>
              <Button
                onClick={handleTestConnection}
                variant="secondary"
                disabled={connectionStatus === 'testing'}
              >
                {connectionStatus === 'testing'
                  ? '테스트 중...'
                  : '연결 테스트'}
              </Button>
            </div>

            {connectionStatus === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                ✓ 연결 성공
              </div>
            )}
            {connectionStatus === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                ✗ 연결 실패
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">데이터 관리</h3>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                데이터 내보내기/가져오기
              </h4>
              <div className="flex gap-2">
                <Button onClick={handleExportData} variant="secondary">
                  📥 로컬 데이터 내보내기 (JSON)
                </Button>
                <Button onClick={handleImportData} variant="secondary">
                  📤 데이터 가져오기
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                모든 액션가이드와 버전을 JSON 파일로 내보내거나 가져올 수
                있습니다.
              </p>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                백엔드 동기화
              </h4>
              <Button variant="primary" disabled>
                🔄 백엔드로 동기화 (준비 중)
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                백엔드 API 연결 후 사용 가능합니다.
              </p>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-red-700 mb-2">
                위험 구역
              </h4>
              <Button onClick={handleClearData} variant="danger">
                🗑️ 모든 데이터 삭제
              </Button>
              <p className="text-sm text-red-600 mt-2">
                ⚠️ 이 작업은 되돌릴 수 없습니다!
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Version History */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">버전 관리 히스토리</h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <div className="font-medium">v1.0.0</div>
                <div className="text-sm text-gray-500">2024-10-21</div>
              </div>
              <div className="text-sm text-gray-600">초기 릴리스</div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            버전 히스토리 기능은 추후 구현될 예정입니다.
          </p>
        </div>
      </Card>

      {/* App Info */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">애플리케이션 정보</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">버전:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">빌드 날짜:</span>
              <span className="font-medium">2024-10-21</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">환경:</span>
              <span className="font-medium">Development</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
