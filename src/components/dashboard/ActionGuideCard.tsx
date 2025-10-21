import React from 'react';
import { MdEdit, MdDelete, MdCode } from 'react-icons/md';
import { Card } from '../common/Card';
import type { ActionGuide } from '../../types/actionGuide';
import { formatDate } from '../../utils/helpers';

interface ActionGuideCardProps {
  guide: ActionGuide;
  onEdit: (guide: ActionGuide) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  draft: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
  active: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
  archived: 'bg-gradient-to-r from-gray-400 to-slate-500 text-white',
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
      <div className="p-6">
        {/* Header with Icon */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <MdCode size={28} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 truncate">
                {guide.name}
              </h3>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm flex-shrink-0 ${
                  statusColors[guide.status]
                }`}
              >
                {statusLabels[guide.status]}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{guide.description}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-purple-600">v{guide.version}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>수정: {formatDate(guide.updatedAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(guide);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-200 border border-blue-200 hover:border-purple-300 shadow-sm hover:shadow"
          >
            <MdEdit size={18} />
            수정
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('정말 삭제하시겠습니까?')) {
                onDelete(guide.id);
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 border border-red-200 hover:border-red-300 shadow-sm hover:shadow"
          >
            <MdDelete size={18} />
          </button>
        </div>
      </div>
    </Card>
  );
};
