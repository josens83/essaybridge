/**
 * ChatInput Component
 * 메시지 입력창 - 텍스트, 파일 첨부, 이모지, 답장 지원
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiX,
  FiImage,
  FiFile,
  FiCornerUpLeft,
  FiMic,
} from 'react-icons/fi';
import { useChat } from '../hooks/useChatContext';
import { mentionPlugin } from '../plugins/MentionPlugin';
import { markdownPlugin } from '../plugins/MarkdownPlugin';
import MentionAutocomplete from '../plugins/MentionAutocomplete';
import VoiceRecorder from './VoiceRecorder';
import type { MentionUser, MarkdownFormat } from '../plugins/types';
import type { VoiceMessage } from '../plugins/VoiceMessagePlugin';

const ChatInput: React.FC = () => {
  const {
    sendMessage,
    isSending,
    setTyping,
    uiState,
    setReplyingTo,
    setEditingMessage,
    editMessage,
  } = useChat();

  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // 멘션 자동완성 상태
  const [showMentionAutocomplete, setShowMentionAutocomplete] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState<(MentionUser | { type: 'special'; name: string })[]>([]);
  const [mentionSearchText, setMentionSearchText] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // 답장/수정 모드 변경 시 포커스
  useEffect(() => {
    if (uiState.replyingTo || uiState.editingMessage) {
      textareaRef.current?.focus();
    }
    if (uiState.editingMessage) {
      setMessage(uiState.editingMessage.content);
    }
  }, [uiState.replyingTo, uiState.editingMessage]);

  // textarea 높이 자동 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [message]);

  // 메시지 전송
  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;

    if (uiState.editingMessage) {
      // 수정 모드
      editMessage(uiState.editingMessage.id, message.trim());
    } else {
      // 새 메시지 전송
      await sendMessage(
        message.trim(),
        attachments.length > 0 ? 'file' : 'text',
        attachments,
        uiState.replyingTo?.id
      );
    }

    setMessage('');
    setAttachments([]);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);

    // textarea 높이 초기화
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // 키보드 이벤트
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 멘션 자동완성이 열려있으면 키보드 이벤트를 가로채지 않음
    if (showMentionAutocomplete) {
      if (['ArrowUp', 'ArrowDown', 'Enter', 'Tab', 'Escape'].includes(e.key)) {
        if (e.key === 'Escape') {
          setShowMentionAutocomplete(false);
        }
        return; // MentionAutocomplete에서 처리
      }
    }

    // Markdown 포맷 키보드 단축키
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

    if (ctrlKey) {
      let format: MarkdownFormat | null = null;

      switch (e.key.toLowerCase()) {
        case 'b':
          format = 'bold';
          break;
        case 'i':
          format = 'italic';
          break;
        case 'u':
          format = 'underline';
          break;
        case 'e':
          format = 'code';
          break;
      }

      if (format && textareaRef.current) {
        e.preventDefault();
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;

        if (start !== end) {
          // 텍스트가 선택된 경우
          const result = markdownPlugin.toggleFormat(message, format, start, end);
          setMessage(result.newText);

          // 선택 영역 복원
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = result.newStart;
              textareaRef.current.selectionEnd = result.newEnd;
              textareaRef.current.focus();
            }
          }, 0);
        }
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 입력 변경
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    setTyping(newValue.length > 0);

    // @ 감지 및 멘션 자동완성
    const cursorPosition = e.target.selectionStart || 0;
    const mentionMatch = mentionPlugin.detectMention(newValue, cursorPosition);

    if (mentionMatch) {
      // 자동완성 표시
      const suggestions = mentionPlugin.getSuggestions(mentionMatch.matchText);
      setMentionSuggestions(suggestions);
      setMentionSearchText(mentionMatch.matchText);

      // 자동완성 위치 계산
      if (textareaRef.current) {
        const rect = textareaRef.current.getBoundingClientRect();
        setMentionPosition({
          top: rect.top - 300, // 위쪽에 표시
          left: rect.left,
        });
      }

      setShowMentionAutocomplete(suggestions.length > 0);
    } else {
      setShowMentionAutocomplete(false);
    }
  };

  // 파일 선택
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    setShowAttachmentMenu(false);
  };

  // 파일 제거
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // 이모지 추가
  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  // 답장/수정 취소
  const cancelReplyOrEdit = () => {
    if (uiState.editingMessage) {
      setEditingMessage(null);
      setMessage('');
    } else {
      setReplyingTo(null);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 드롭존을 완전히 벗어났을 때만 상태 변경
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files]);
    }
  };

  // 멘션 선택
  const handleMentionSelect = (item: MentionUser | { type: 'special'; name: string }) => {
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const result = mentionPlugin.insertMention(message, cursorPosition, item);

    setMessage(result.newText);
    setShowMentionAutocomplete(false);

    // 커서 위치 복원
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = result.newCursorPosition;
        textareaRef.current.selectionEnd = result.newCursorPosition;
        textareaRef.current.focus();
      }
    }, 0);
  };

  // 음성 메시지 녹음 시작
  const handleStartVoiceRecording = () => {
    setIsRecordingVoice(true);
  };

  // 음성 메시지 전송
  const handleSendVoiceMessage = async (voiceMessage: VoiceMessage) => {
    // TODO: 음성 메시지를 서버로 전송하는 로직
    // 현재는 일반 메시지로 처리 (플레이스홀더)
    await sendMessage(
      `🎤 음성 메시지 (${Math.floor(voiceMessage.duration)}초)`,
      'text'
    );
    setIsRecordingVoice(false);
  };

  // 음성 메시지 녹음 취소
  const handleCancelVoiceRecording = () => {
    setIsRecordingVoice(false);
  };

  // 빠른 이모지 목록
  const quickEmojis = ['😊', '😂', '❤️', '👍', '🎉', '🤔', '👏', '🔥', '💯', '✨'];

  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 relative ${
        isDragging ? 'bg-primary-50 dark:bg-primary-900/20' : ''
      }`}
    >
      {/* 드래그 앤 드롭 오버레이 */}
      {isDragging && (
        <div className="absolute inset-0 border-2 border-dashed border-primary-500 rounded-lg bg-primary-50/80 dark:bg-primary-900/40 flex items-center justify-center z-10">
          <div className="text-center">
            <FiPaperclip className="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <p className="text-primary-600 dark:text-primary-400 font-medium">
              파일을 여기에 놓으세요
            </p>
          </div>
        </div>
      )}

      {/* 답장/수정 미리보기 */}
      {(uiState.replyingTo || uiState.editingMessage) && (
        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-start justify-between">
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              {uiState.editingMessage ? (
                <span className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                  메시지 수정
                </span>
              ) : (
                <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                  <FiCornerUpLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {uiState.replyingTo?.senderName}에게 답장
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {uiState.editingMessage?.content || uiState.replyingTo?.content}
            </p>
          </div>
          <button
            onClick={cancelReplyOrEdit}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            <FiX className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      {/* 첨부 파일 미리보기 */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              {file.type.startsWith('image/') ? (
                <FiImage className="w-4 h-4 text-gray-500" />
              ) : (
                <FiFile className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
                {file.name}
              </span>
              <span className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <FiX className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 멘션 자동완성 */}
      {showMentionAutocomplete && (
        <MentionAutocomplete
          suggestions={mentionSuggestions}
          onSelect={handleMentionSelect}
          position={mentionPosition}
          searchText={mentionSearchText}
        />
      )}

      {/* 음성 녹음 중 */}
      {isRecordingVoice ? (
        <VoiceRecorder
          onSend={handleSendVoiceMessage}
          onCancel={handleCancelVoiceRecording}
        />
      ) : (
        <>
          {/* 입력 영역 */}
          <div className="flex items-end gap-2">
        {/* 첨부 버튼 */}
        <div className="relative">
          <button
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <FiPaperclip className="w-5 h-5" />
          </button>

          {showAttachmentMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = 'image/*';
                  }
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <FiImage className="w-4 h-4" /> 이미지
              </button>
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = '.pdf,.doc,.docx,.hwp,.txt';
                  }
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <FiFile className="w-4 h-4" /> 파일
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* 텍스트 입력 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            rows={1}
            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            style={{ maxHeight: '150px' }}
          />
        </div>

        {/* 이모지 버튼 */}
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <FiSmile className="w-5 h-5" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
              <div className="grid grid-cols-5 gap-2">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 음성 메시지 버튼 */}
        <button
          onClick={handleStartVoiceRecording}
          className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          title="음성 메시지"
        >
          <FiMic className="w-5 h-5" />
        </button>

        {/* 전송 버튼 */}
        <button
          onClick={handleSend}
          disabled={isSending || (!message.trim() && attachments.length === 0)}
          className={`p-2.5 rounded-full transition-colors ${
            message.trim() || attachments.length > 0
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
          } disabled:opacity-50`}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>

          {/* 안내 텍스트 */}
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 text-center">
            Enter로 전송, Shift+Enter로 줄바꿈
          </p>
        </>
      )}
    </div>
  );
};

export default ChatInput;
