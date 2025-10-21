import React, { useState, useEffect } from 'react';
import { MdAdd, MdSearch, MdFolder, MdCheckCircle, MdDrafts } from 'react-icons/md';
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
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="액션가이드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm hover:border-purple-300"
          />
        </div>
        <Button onClick={handleAdd} size="lg">
          <div className="flex items-center gap-2">
            <MdAdd size={24} />
            새 액션가이드
          </div>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <MdFolder size={24} />
            </div>
            <div className="text-4xl font-bold">{guides.length}</div>
          </div>
          <div className="text-blue-100 font-medium">전체 액션가이드</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <MdCheckCircle size={24} />
            </div>
            <div className="text-4xl font-bold">
              {guides.filter((g) => g.status === 'active').length}
            </div>
          </div>
          <div className="text-green-100 font-medium">활성 상태</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <MdDrafts size={24} />
            </div>
            <div className="text-4xl font-bold">
              {guides.filter((g) => g.status === 'draft').length}
            </div>
          </div>
          <div className="text-yellow-100 font-medium">초안</div>
        </div>
      </div>

      {/* Action Guides Grid */}
      {filteredGuides.length === 0 ? (
        <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdFolder size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-6">
            {searchTerm
              ? '검색 결과가 없습니다'
              : '아직 액션가이드가 없습니다'}
          </p>
          {!searchTerm && (
            <Button onClick={handleAdd} size="lg">
              <div className="flex items-center gap-2">
                <MdAdd size={20} />
                첫 액션가이드 만들기
              </div>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
