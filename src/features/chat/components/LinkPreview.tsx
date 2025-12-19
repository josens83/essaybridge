/**
 * LinkPreview Component
 * 메시지 내 URL을 감지하고 프리뷰 카드를 표시
 */
/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import { FiExternalLink, FiGlobe } from 'react-icons/fi';

interface LinkPreviewProps {
  url: string;
  isOwnMessage?: boolean;
}

interface PreviewData {
  title: string;
  description: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

// URL에서 도메인 추출
const getDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

// 간단한 프리뷰 데이터 생성 (실제로는 서버에서 OG태그 파싱)
const generateMockPreview = (url: string): PreviewData => {
  const domain = getDomain(url);

  // 알려진 사이트들의 mock 데이터
  const knownSites: Record<string, PreviewData> = {
    'github.com': {
      title: 'GitHub - 소프트웨어 개발 플랫폼',
      description: '전 세계 개발자들이 협업하는 소프트웨어 개발 플랫폼',
      siteName: 'GitHub',
      image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    },
    'naver.com': {
      title: 'NAVER',
      description: '네이버 메인에서 다양한 정보와 유용한 컨텐츠를 만나보세요',
      siteName: '네이버',
    },
    'google.com': {
      title: 'Google',
      description: '세계 최대 검색 엔진',
      siteName: 'Google',
    },
    'youtube.com': {
      title: 'YouTube',
      description: '동영상 공유 플랫폼',
      siteName: 'YouTube',
      image: 'https://www.youtube.com/img/desktop/yt_1200.png',
    },
  };

  // 알려진 사이트인 경우 해당 데이터 반환
  for (const [site, data] of Object.entries(knownSites)) {
    if (domain.includes(site)) {
      return data;
    }
  }

  // 기본 프리뷰
  return {
    title: domain,
    description: url,
    siteName: domain,
  };
};

const LinkPreview: React.FC<LinkPreviewProps> = ({ url, isOwnMessage = false }) => {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      setIsLoading(true);
      setError(false);

      try {
        // 실제로는 서버 API를 호출하여 OG 태그를 파싱
        // 여기서는 mock 데이터 사용
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = generateMockPreview(url);
        setPreview(data);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (isLoading) {
    return (
      <div className={`mt-2 p-3 rounded-lg animate-pulse ${
        isOwnMessage ? 'bg-primary-500/20' : 'bg-gray-100 dark:bg-gray-600'
      }`}>
        <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
      </div>
    );
  }

  if (error || !preview) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block mt-2 rounded-lg overflow-hidden border transition-colors ${
        isOwnMessage
          ? 'border-primary-400/30 hover:border-primary-400/50 bg-primary-500/10'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700/50'
      }`}
    >
      {/* 이미지 (있는 경우) */}
      {preview.image && (
        <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 overflow-hidden">
          <img
            src={preview.image}
            alt={preview.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* 컨텐츠 */}
      <div className="p-3">
        {/* 사이트명 */}
        <div className="flex items-center gap-1.5 mb-1">
          <FiGlobe className={`w-3 h-3 ${
            isOwnMessage ? 'text-primary-200' : 'text-gray-400 dark:text-gray-500'
          }`} />
          <span className={`text-xs ${
            isOwnMessage ? 'text-primary-200' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {preview.siteName || getDomain(url)}
          </span>
        </div>

        {/* 제목 */}
        <h4 className={`text-sm font-medium line-clamp-2 mb-1 ${
          isOwnMessage ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          {preview.title}
        </h4>

        {/* 설명 */}
        {preview.description && (
          <p className={`text-xs line-clamp-2 ${
            isOwnMessage ? 'text-primary-100' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {preview.description}
          </p>
        )}

        {/* 외부 링크 아이콘 */}
        <div className={`flex items-center gap-1 mt-2 text-xs ${
          isOwnMessage ? 'text-primary-200' : 'text-gray-500 dark:text-gray-400'
        }`}>
          <FiExternalLink className="w-3 h-3" />
          <span className="truncate">{getDomain(url)}</span>
        </div>
      </div>
    </a>
  );
};

// URL 감지 유틸리티
export const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

// 텍스트를 URL과 일반 텍스트로 분리
export const parseTextWithUrls = (text: string): Array<{ type: 'text' | 'url'; content: string }> => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts: Array<{ type: 'text' | 'url'; content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    // URL 이전 텍스트
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      });
    }
    // URL
    parts.push({
      type: 'url',
      content: match[0],
    });
    lastIndex = match.index + match[0].length;
  }

  // 마지막 텍스트
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }

  return parts;
};

export default LinkPreview;
