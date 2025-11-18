import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiSend, FiAlertCircle } from 'react-icons/fi';
import { universities, departments } from '../../../data/sampleData';
import type { Essay, EssayType } from '../../../types';

const EssayEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    university: '',
    department: '',
    essayType: 'university_specific' as EssayType,
    content: '',
  });

  const [wordCount, setWordCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Auto-save every 30 seconds
    const autoSave = setInterval(() => {
      if (formData.content || formData.title) {
        handleSave(true);
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [formData]);

  useEffect(() => {
    // Count words (Korean characters + spaces)
    const count = formData.content.replace(/\s/g, '').length;
    setWordCount(count);
  }, [formData.content]);

  useEffect(() => {
    // Load existing essay if editing
    if (isEditing) {
      // In real app, fetch essay data
      const mockEssay: Essay = {
        id: id || '',
        studentId: 'student1',
        title: '서울대 2024학년도 모의논술',
        content: '제시문 (가)에서는...',
        university: '서울대학교',
        department: '경영학과',
        essayType: 'university_specific',
        status: 'draft',
        wordCount: 856,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setFormData({
        title: mockEssay.title,
        university: mockEssay.university,
        department: mockEssay.department,
        essayType: mockEssay.essayType,
        content: mockEssay.content,
      });
    }
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (autoSave = false) => {
    if (!autoSave) setSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!autoSave) {
      setSaving(false);
      alert('임시 저장되었습니다.');
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.university || !formData.department || !formData.content) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (wordCount < 500) {
      alert('논술은 최소 500자 이상 작성해주세요.');
      return;
    }

    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitting(false);
    alert('첨삭 신청이 완료되었습니다! 48시간 내에 첨삭 결과를 확인하실 수 있습니다.');
    navigate('/essays');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isEditing ? '논술 수정' : '새 논술 작성'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">전문가의 첨삭을 받을 논술을 작성해주세요.</p>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6 flex items-start transition-colors">
          <FiAlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-semibold mb-1">첨삭 신청 전 확인사항</p>
            <ul className="list-disc list-inside space-y-1">
              <li>논술은 최소 500자 이상 작성해주세요.</li>
              <li>제출 후 수정이 불가능하니 신중하게 작성해주세요.</li>
              <li>첨삭 결과는 48시간 내에 제공됩니다.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors">
          {/* Form Fields */}
          <div className="p-6 space-y-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                논술 제목 *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="예: 서울대 2024학년도 인문계열 논술"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  대학 *
                </label>
                <select
                  id="university"
                  name="university"
                  required
                  value={formData.university}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">대학 선택</option>
                  {universities.map((univ) => (
                    <option key={univ} value={univ}>
                      {univ}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  학과 *
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">학과 선택</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="essayType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                논술 유형 *
              </label>
              <select
                id="essayType"
                name="essayType"
                required
                value={formData.essayType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="university_specific">대학별 논술</option>
                <option value="general">일반 논술</option>
                <option value="interview_prep">면접 준비</option>
              </select>
            </div>
          </div>

          {/* Editor */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                논술 내용 *
              </label>
              <div className="flex items-center space-x-4">
                <span
                  className={`text-sm font-medium ${
                    wordCount < 500
                      ? 'text-red-600 dark:text-red-400'
                      : wordCount > 2000
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {wordCount.toLocaleString()}자
                  {wordCount < 500 && ` (최소 500자)`}
                  {wordCount > 2000 && ` (권장 2000자 이하)`}
                </span>
              </div>
            </div>

            <textarea
              id="content"
              name="content"
              rows={20}
              required
              value={formData.content}
              onChange={handleChange}
              placeholder="논술 내용을 작성해주세요. 제시문과 문제가 있다면 함께 작성해주시면 더 정확한 첨삭이 가능합니다."
              className="input-field font-mono text-sm leading-relaxed"
            />

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              💡 Tip: 30초마다 자동 저장됩니다. 제시문과 논제를 함께 작성하면 더 정확한 첨삭을 받을 수
              있습니다.
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors">
            <button
              type="button"
              onClick={() => navigate('/essays')}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              취소
            </button>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={saving}
                className="btn-outline flex items-center disabled:opacity-50"
              >
                <FiSave className="w-5 h-5 mr-2" />
                {saving ? '저장 중...' : '임시 저장'}
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || wordCount < 500}
                className="btn-primary flex items-center disabled:opacity-50"
              >
                <FiSend className="w-5 h-5 mr-2" />
                {submitting ? '제출 중...' : '첨삭 신청'}
              </button>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">논술 작성 가이드</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">✅ 좋은 예시</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>제시문과 논제를 함께 제공</li>
                <li>논리적이고 체계적인 구성</li>
                <li>적절한 문단 구분</li>
                <li>근거와 예시 제시</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">❌ 피해야 할 점</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>제시문 없이 답안만 작성</li>
                <li>지나치게 짧거나 긴 글</li>
                <li>문단 구분 없는 글</li>
                <li>맞춤법 오류가 많은 글</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssayEditor;
