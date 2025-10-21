import React, { useState, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';
import { Button } from '../components/common/Button';
import { ActionGuideCard } from '../components/dashboard/ActionGuideCard';
import { ActionGuideModal } from '../components/dashboard/ActionGuideModal';
import { useActionGuideStore } from '../stores/actionGuideStore';
import type { ActionGuide } from '../types/actionGuide';

export const Dashboard: React.FC = () => {
  const { guides, loadGuides, addGuide, updateGuide, deleteGuide } =
    useActionGuideStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<ActionGuide | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  const handleEdit = (guide: ActionGuide) => {
    setSelectedGuide(guide);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedGuide(null);
    setIsModalOpen(true);
  };

  const handleSave = (guideData: Partial<ActionGuide>) => {
    if (selectedGuide) {
      updateGuide(selectedGuide.id, guideData);
    } else {
      addGuide(guideData as Omit<ActionGuide, 'id' | 'createdAt' | 'updatedAt'>);
    }
  };

  const filteredGuides = guides.filter(
    (guide) =>
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header Actions */}
      <div className="mb-6 flex gap-4 items-center">
        <input
          type="text"
          placeholder="액션가이드 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={handleAdd}>
          <div className="flex items-center gap-2">
            <MdAdd size={20} />
            새 액션가이드
          </div>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-600">전체</div>
          <div className="text-2xl font-bold text-gray-900">{guides.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-600">활성</div>
          <div className="text-2xl font-bold text-green-600">
            {guides.filter((g) => g.status === 'active').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-600">초안</div>
          <div className="text-2xl font-bold text-yellow-600">
            {guides.filter((g) => g.status === 'draft').length}
          </div>
        </div>
      </div>

      {/* Action Guides Grid */}
      {filteredGuides.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? '검색 결과가 없습니다'
              : '아직 액션가이드가 없습니다'}
          </p>
          {!searchTerm && (
            <Button onClick={handleAdd}>첫 액션가이드 만들기</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuides.map((guide) => (
            <ActionGuideCard
              key={guide.id}
              guide={guide}
              onEdit={handleEdit}
              onDelete={deleteGuide}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <ActionGuideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        guide={selectedGuide}
      />
    </div>
  );
};
