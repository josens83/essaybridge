/**
 * NewChatModal Component
 * 새 채팅방 생성 모달
 */

import React, { useState } from 'react';
import { FiX, FiSearch, FiFileText, FiUsers, FiHeadphones } from 'react-icons/fi';
import { mockParticipants } from '../api/chat.mock';
import type { ChatRoomType, ChatParticipant } from '../types';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (type: ChatRoomType, participantId: string) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose, onCreateRoom }) => {
  const [selectedType, setSelectedType] = useState<ChatRoomType>('essay_review');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

  if (!isOpen) return null;

  // 타입별로 사용 가능한 참여자 필터링
  const availableParticipants = Object.values(mockParticipants).filter(p => {
    if (p.userId === 'student1') return false; // 자신 제외

    if (selectedType === 'essay_review') {
      return p.role === 'expert';
    }
    if (selectedType === 'consulting') {
      return p.role === 'consultant';
    }
    if (selectedType === 'support') {
      return p.role === 'admin';
    }
    return false;
  }).filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chatTypes = [
    {
      type: 'essay_review' as ChatRoomType,
      label: '논술 첨삭',
      icon: FiFileText,
      description: '전문가에게 논술 첨삭을 받으세요',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    },
    {
      type: 'consulting' as ChatRoomType,
      label: '입시 컨설팅',
      icon: FiUsers,
      description: '입시 전문가와 상담하세요',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    },
    {
      type: 'support' as ChatRoomType,
      label: '고객 지원',
      icon: FiHeadphones,
      description: '서비스 관련 문의를 하세요',
      color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    },
  ];

  const handleCreate = () => {
    if (selectedParticipant) {
      onCreateRoom(selectedType, selectedParticipant);
      onClose();
      setSelectedParticipant(null);
      setSearchTerm('');
    }
  };

  // 상태 색상
  const getStatusColor = (status: ChatParticipant['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            새 대화 시작
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* 채팅 타입 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              대화 유형
            </label>
            <div className="space-y-2">
              {chatTypes.map(({ type, label, icon: Icon, description, color }) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setSelectedParticipant(null);
                  }}
                  className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                    selectedType === type
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 참여자 검색 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {selectedType === 'essay_review' ? '전문가 선택' :
               selectedType === 'consulting' ? '상담사 선택' : '상담원 선택'}
            </label>
            <div className="relative mb-3">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름으로 검색..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>

            {/* 참여자 목록 */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableParticipants.length === 0 ? (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                  {searchTerm ? '검색 결과가 없습니다' : '선택 가능한 사용자가 없습니다'}
                </p>
              ) : (
                availableParticipants.map((participant) => (
                  <button
                    key={participant.userId}
                    onClick={() => setSelectedParticipant(participant.userId)}
                    className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                      selectedParticipant === participant.userId
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          {participant.profileImage ? (
                            <img
                              src={participant.profileImage}
                              alt={participant.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                              {participant.name[0]}
                            </div>
                          )}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(participant.status)}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {participant.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {participant.status === 'online' ? '온라인' :
                           participant.status === 'away' ? '자리비움' : '오프라인'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleCreate}
              disabled={!selectedParticipant}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              대화 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
