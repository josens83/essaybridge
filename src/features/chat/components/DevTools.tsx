/**
 * DevTools Component
 * 개발 환경 전용 Feature Toggle 및 플러그인 상태 관리 도구
 */

import React, { useState } from 'react';
import { FiSettings, FiX, FiToggleLeft, FiToggleRight, FiPackage } from 'react-icons/fi';
import { getFeatureToggle, FeatureFlag } from '../core/FeatureToggle';
import { usePlugins } from '../contexts/PluginProvider';

export const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'plugins'>('features');
  const { plugins, pluginManager } = usePlugins();
  const featureToggle = getFeatureToggle();

  // 개발 환경에서만 표시
  if (!import.meta.env.DEV) {
    return null;
  }

  const allFeatures = featureToggle.getAllFeatures();
  const featureEntries = Array.from(allFeatures.entries());

  const toggleFeature = (flag: string) => {
    featureToggle.toggle(flag as FeatureFlag);
    featureToggle.saveToStorage();
    // 강제 리렌더링
    window.location.reload();
  };

  const togglePlugin = async (pluginId: string) => {
    const plugin = pluginManager?.getPlugin(pluginId);
    if (!plugin || !pluginManager) return;

    if (plugin.enabled) {
      await pluginManager.disable(pluginId);
    } else {
      await pluginManager.enable(pluginId);
    }

    // 강제 리렌더링
    window.location.reload();
  };

  const getFeatureCategoryName = (flag: string): string => {
    if (flag.includes('typing') || flag.includes('read') || flag.includes('reaction') || flag.includes('editing') || flag.includes('threading')) {
      return '채팅 기능';
    }
    if (flag.includes('file') || flag.includes('image')) {
      return '파일 공유';
    }
    if (flag.includes('link')) {
      return '링크 기능';
    }
    if (flag.includes('notification')) {
      return '알림';
    }
    if (flag.includes('voice') || flag.includes('video') || flag.includes('screen') || flag.includes('search') || flag.includes('translation')) {
      return '고급 기능';
    }
    return '실험적 기능';
  };

  // 카테고리별로 그룹화
  const groupedFeatures = featureEntries.reduce((acc, [flag, enabled]) => {
    const category = getFeatureCategoryName(flag);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ flag, enabled });
    return acc;
  }, {} as Record<string, Array<{ flag: string; enabled: boolean }>>);

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-200"
        title="개발자 도구 열기"
      >
        <FiSettings className="w-6 h-6" />
      </button>

      {/* DevTools 패널 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiSettings className="w-5 h-5" />
                개발자 도구
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* 탭 */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('features')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'features'
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Feature Toggles
              </button>
              <button
                onClick={() => setActiveTab('plugins')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'plugins'
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Plugins ({plugins.length})
              </button>
            </div>

            {/* 컨텐츠 */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'features' ? (
                <div className="space-y-4">
                  {Object.entries(groupedFeatures).map(([category, features]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {features.map(({ flag, enabled }) => (
                          <div
                            key={flag}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {flag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {flag}
                              </div>
                            </div>
                            <button
                              onClick={() => toggleFeature(flag)}
                              className={`p-2 rounded-lg transition-colors ${
                                enabled
                                  ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                                  : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}
                              title={enabled ? '비활성화' : '활성화'}
                            >
                              {enabled ? (
                                <FiToggleRight className="w-6 h-6" />
                              ) : (
                                <FiToggleLeft className="w-6 h-6" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {plugins.map((plugin) => (
                    <div
                      key={plugin.metadata.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <FiPackage className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {plugin.metadata.name}
                            </h4>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              plugin.status === 'active'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : plugin.status === 'error'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                              {plugin.status}
                            </span>
                          </div>
                          {plugin.metadata.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              {plugin.metadata.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>v{plugin.metadata.version}</span>
                            {plugin.metadata.author && <span>by {plugin.metadata.author}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => togglePlugin(plugin.metadata.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            plugin.enabled
                              ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                              : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                          title={plugin.enabled ? '비활성화' : '활성화'}
                        >
                          {plugin.enabled ? (
                            <FiToggleRight className="w-6 h-6" />
                          ) : (
                            <FiToggleLeft className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  {plugins.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      등록된 플러그인이 없습니다
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              💡 이 도구는 개발 환경에서만 표시됩니다. 변경사항은 페이지 새로고침 후 적용됩니다.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevTools;
