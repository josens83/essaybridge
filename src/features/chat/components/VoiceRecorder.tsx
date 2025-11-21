/**
 * VoiceRecorder Component
 * 음성 메시지 녹음 UI
 */

import React, { useState, useEffect } from 'react';
import { FiMic, FiSquare, FiPause, FiPlay, FiX, FiSend } from 'react-icons/fi';
import { voiceMessagePlugin, type VoiceMessage, type RecordingState } from '../plugins/VoiceMessagePlugin';

interface VoiceRecorderProps {
  onSend: (voiceMessage: VoiceMessage) => void;
  onCancel: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend, onCancel }) => {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    duration: 0,
    isPaused: false,
  });
  const [voiceData, setVoiceData] = useState<VoiceMessage | null>(null);

  useEffect(() => {
    // 녹음 시작
    voiceMessagePlugin.startRecording(
      (data) => setVoiceData(data),
      (newState) => setState(newState)
    );

    return () => {
      voiceMessagePlugin.cancelRecording();
    };
  }, []);

  const handleStop = () => {
    voiceMessagePlugin.stopRecording();
  };

  const handlePause = () => {
    if (state.isPaused) {
      voiceMessagePlugin.resumeRecording();
    } else {
      voiceMessagePlugin.pauseRecording();
    }
  };

  const handleSend = () => {
    if (voiceData) {
      onSend(voiceData);
    }
  };

  const handleCancel = () => {
    voiceMessagePlugin.cancelRecording();
    onCancel();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (voiceData) {
    // 녹음 완료 - 미리보기
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
            <FiMic className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              음성 메시지
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatDuration(voiceData.duration)}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {/* 파형 표시 */}
          <div className="flex items-center gap-0.5 h-8">
            {voiceData.waveform.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-primary-400 rounded-full"
                style={{ height: `${value * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
            title="취소"
          >
            <FiX className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            className="p-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white"
            title="전송"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 녹음 중
  return (
    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-500">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
          <FiMic className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {state.isPaused ? '일시정지됨' : '녹음 중...'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {formatDuration(state.duration)}
          </div>
        </div>
      </div>

      <div className="flex-1">
        {/* 실시간 파형 애니메이션 */}
        <div className="flex items-center gap-1 h-8">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 bg-red-500 rounded-full transition-all ${
                state.isPaused ? '' : 'animate-pulse'
              }`}
              style={{
                height: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePause}
          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-700 dark:text-gray-300"
          title={state.isPaused ? '재개' : '일시정지'}
        >
          {state.isPaused ? (
            <FiPlay className="w-5 h-5" />
          ) : (
            <FiPause className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={handleStop}
          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
          title="중지"
        >
          <FiSquare className="w-5 h-5" />
        </button>
        <button
          onClick={handleCancel}
          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-600 dark:text-gray-300"
          title="취소"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;
