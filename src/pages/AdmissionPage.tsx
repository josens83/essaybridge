/**
 * AdmissionPage
 * 입시 데이터베이스 메인 페이지
 */

import React, { useState } from 'react';
import { useUniversities, useUniversityStatistics } from '../features/admission/hooks/useUniversities';
import { useQuestions } from '../features/admission/hooks/useQuestions';

type TabType = 'universities' | 'admissions' | 'questions';

export const AdmissionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('universities');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  // 대학 데이터
  const { universities, loading: universitiesLoading } = useUniversities({
    tier: selectedTier !== 'all' ? (selectedTier as any) : undefined,
  });

  const { statistics } = useUniversityStatistics();

  // 논술 문제 데이터
  const { questions, loading: questionsLoading } = useQuestions({});

  return (
    <div className="admission-page">
      {/* 헤더 */}
      <div className="page-header">
        <h1 className="page-title">입시 데이터베이스</h1>
        <p className="page-subtitle">
          전국 주요 대학의 입시 정보와 논술 문제를 한눈에
        </p>
      </div>

      {/* 통계 카드 */}
      {statistics && (
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-value">{statistics.totalUniversities}</div>
            <div className="stat-label">등록 대학</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statistics.byTier.SKY || 0}</div>
            <div className="stat-label">SKY 대학</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{questions.length}</div>
            <div className="stat-label">논술 문제</div>
          </div>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'universities' ? 'active' : ''}`}
          onClick={() => setActiveTab('universities')}
        >
          대학 탐색
        </button>
        <button
          className={`tab-button ${activeTab === 'admissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('admissions')}
        >
          입시요강
        </button>
        <button
          className={`tab-button ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          논술 문제
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="tab-content">
        {/* 대학 탐색 탭 */}
        {activeTab === 'universities' && (
          <div className="universities-tab">
            <div className="filter-section">
              <label htmlFor="tier-filter">대학 등급:</label>
              <select
                id="tier-filter"
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="SKY">SKY</option>
                <option value="top15">상위 15개 대학</option>
                <option value="in_seoul">서울 소재</option>
                <option value="regional_flagship">지역 거점국립대</option>
              </select>
            </div>

            {universitiesLoading ? (
              <div className="loading">대학 정보를 불러오는 중...</div>
            ) : (
              <div className="universities-grid">
                {universities.map((university) => (
                  <div key={university.id} className="university-card">
                    <h3 className="university-name">{university.name}</h3>
                    {university.nameEng && (
                      <p className="university-name-eng">{university.nameEng}</p>
                    )}
                    <div className="university-badges">
                      {university.tier && (
                        <span className="badge badge-tier">{university.tier}</span>
                      )}
                      {university.type && (
                        <span className="badge badge-type">{university.type}</span>
                      )}
                      {university.region && (
                        <span className="badge badge-region">{university.region}</span>
                      )}
                    </div>
                    {university.established && (
                      <p className="university-info">설립: {university.established}년</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!universitiesLoading && universities.length === 0 && (
              <div className="empty-state">해당하는 대학이 없습니다.</div>
            )}
          </div>
        )}

        {/* 입시요강 탭 */}
        {activeTab === 'admissions' && (
          <div className="admissions-tab">
            <div className="coming-soon">
              <h3>입시요강 기능</h3>
              <p>입시요강 상세 정보는 곧 제공될 예정입니다.</p>
              <p className="note">
                현재 {universities.length}개 대학의 기본 정보가 등록되어 있습니다.
              </p>
            </div>
          </div>
        )}

        {/* 논술 문제 탭 */}
        {activeTab === 'questions' && (
          <div className="questions-tab">
            {questionsLoading ? (
              <div className="loading">논술 문제를 불러오는 중...</div>
            ) : questions.length > 0 ? (
              <div className="questions-grid">
                {questions.map((question) => (
                  <div key={question.id} className="question-card">
                    <div className="question-header">
                      <h4>{question.academicYear}학년도</h4>
                      <span className="difficulty-badge">
                        {question.difficulty}
                      </span>
                    </div>
                    <p className="question-info">
                      시험일: {new Date(question.examDate).toLocaleDateString('ko-KR')}
                    </p>
                    <p className="question-info">
                      품질점수: {question.qualityScore}/100
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="coming-soon">
                <h3>논술 문제 데이터베이스</h3>
                <p>논술 문제 데이터는 곧 제공될 예정입니다.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .admission-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #7f8c8d;
          margin: 0;
        }

        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .stat-value {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1rem;
          opacity: 0.9;
        }

        .tab-navigation {
          display: flex;
          gap: 0.5rem;
          border-bottom: 2px solid #e0e0e0;
          margin-bottom: 2rem;
        }

        .tab-button {
          padding: 1rem 2rem;
          border: none;
          background: none;
          font-size: 1rem;
          font-weight: 600;
          color: #7f8c8d;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }

        .tab-button:hover {
          color: #4a90e2;
        }

        .tab-button.active {
          color: #4a90e2;
          border-bottom-color: #4a90e2;
        }

        .tab-content {
          min-height: 400px;
        }

        .filter-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .filter-section label {
          font-weight: 600;
          color: #2c3e50;
        }

        .filter-section select {
          padding: 0.5rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 1rem;
          background: white;
        }

        .loading,
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #7f8c8d;
          font-size: 1.1rem;
        }

        .universities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .university-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s;
        }

        .university-card:hover {
          border-color: #4a90e2;
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15);
          transform: translateY(-2px);
        }

        .university-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .university-name-eng {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin: 0 0 1rem 0;
        }

        .university-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .badge {
          padding: 0.3rem 0.8rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .badge-tier {
          background: #e3f2fd;
          color: #1976d2;
        }

        .badge-type {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .badge-region {
          background: #fff3e0;
          color: #e65100;
        }

        .university-info {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin: 0.3rem 0;
        }

        .coming-soon {
          text-align: center;
          padding: 4rem 2rem;
        }

        .coming-soon h3 {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .coming-soon p {
          font-size: 1.1rem;
          color: #7f8c8d;
          margin-bottom: 0.5rem;
        }

        .coming-soon .note {
          margin-top: 2rem;
          padding: 1rem;
          background: #e3f2fd;
          border-radius: 8px;
          color: #1976d2;
        }

        .questions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .question-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s;
        }

        .question-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
          transform: translateY(-2px);
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .question-header h4 {
          font-size: 1.2rem;
          color: #2c3e50;
          margin: 0;
        }

        .difficulty-badge {
          padding: 0.3rem 0.8rem;
          background: #ffc107;
          color: white;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .question-info {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default AdmissionPage;
