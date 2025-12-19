/**
 * ImageLightbox Component
 * 이미지를 전체 화면으로 보여주는 라이트박스
 */

import React, { useEffect, useCallback } from 'react';
import { FiX, FiDownload, FiZoomIn, FiZoomOut, FiRotateCw } from 'react-icons/fi';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string;
  fileName?: string;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  imageUrl,
  fileName = 'image',
  onClose,
}) => {
  const [scale, setScale] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  // ESC 키로 닫기
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // 컴포넌트가 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setScale(1);
      setRotation(0);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [isOpen, imageUrl]);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
      {/* 상단 툴바 */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <span className="text-white text-sm truncate max-w-[50%]">{fileName}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            title="축소"
          >
            <FiZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white text-sm min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            title="확대"
          >
            <FiZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            title="회전"
          >
            <FiRotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            title="다운로드"
          >
            <FiDownload className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors ml-2"
            title="닫기 (ESC)"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 이미지 컨테이너 */}
      <div
        className="w-full h-full flex items-center justify-center p-16 cursor-zoom-out"
        onClick={onClose}
      >
        <img
          src={imageUrl}
          alt={fileName}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default ImageLightbox;
