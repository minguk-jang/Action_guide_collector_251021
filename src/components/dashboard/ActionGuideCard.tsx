import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { Card } from '../common/Card';
import type { ActionGuide } from '../../types/actionGuide';
import { formatDate } from '../../utils/helpers';

interface ActionGuideCardProps {
  guide: ActionGuide;
  onEdit: (guide: ActionGuide) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  draft: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  draft: '초안',
  active: '활성',
  archived: '보관',
};

export const ActionGuideCard: React.FC<ActionGuideCardProps> = ({
  guide,
  onEdit,
  onDelete,
}) => {
  return (
    <Card hoverable>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {guide.name}
            </h3>
            <p className="text-sm text-gray-600">{guide.description}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              statusColors[guide.status]
            }`}
          >
            {statusLabels[guide.status]}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>버전: {guide.version}</span>
          <span>수정: {formatDate(guide.updatedAt)}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(guide);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
          >
            <MdEdit size={16} />
            수정
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('정말 삭제하시겠습니까?')) {
                onDelete(guide.id);
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
          >
            <MdDelete size={16} />
            삭제
          </button>
        </div>
      </div>
    </Card>
  );
};
