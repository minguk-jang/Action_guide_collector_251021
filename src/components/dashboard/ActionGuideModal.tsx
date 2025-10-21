import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { ActionGuide } from '../../types/actionGuide';

interface ActionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guide: Partial<ActionGuide>) => void;
  guide?: ActionGuide | null;
}

export const ActionGuideModal: React.FC<ActionGuideModalProps> = ({
  isOpen,
  onClose,
  onSave,
  guide,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    version: string;
    description: string;
    status: 'draft' | 'active' | 'archived';
    data: string;
  }>({
    name: '',
    version: '1.0.0',
    description: '',
    status: 'draft',
    data: '{\n  \n}',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (guide) {
      setFormData({
        name: guide.name,
        version: guide.version,
        description: guide.description,
        status: guide.status,
        data: JSON.stringify(guide.data, null, 2),
      });
    } else {
      setFormData({
        name: '',
        version: '1.0.0',
        description: '',
        status: 'draft',
        data: '{\n  \n}',
      });
    }
    setErrors({});
  }, [guide, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    if (!formData.version.trim()) {
      newErrors.version = '버전을 입력해주세요';
    }
    try {
      JSON.parse(formData.data);
    } catch {
      newErrors.data = 'JSON 형식이 올바르지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const guideData: Partial<ActionGuide> = {
      name: formData.name,
      version: formData.version,
      description: formData.description,
      status: formData.status,
      data: JSON.parse(formData.data),
    };

    if (guide) {
      onSave({ ...guideData, id: guide.id });
    } else {
      onSave(guideData);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={guide ? '액션가이드 수정' : '새 액션가이드'}
      size="xl"
    >
      <div className="space-y-4">
        <Input
          label="이름"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          placeholder="액션가이드 이름"
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="버전"
            value={formData.version}
            onChange={(value) => setFormData({ ...formData, version: value })}
            placeholder="1.0.0"
            error={errors.version}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'draft' | 'active' | 'archived',
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">초안</option>
              <option value="active">활성</option>
              <option value="archived">보관</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="액션가이드 설명"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            JSON 데이터
          </label>
          <textarea
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            placeholder="{ }"
            rows={12}
            className={`w-full px-3 py-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.data ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.data && (
            <p className="mt-1 text-sm text-red-600">{errors.data}</p>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {guide ? '수정' : '추가'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
