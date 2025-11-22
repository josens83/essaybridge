/**
 * SocialProof 컴포넌트
 * Airbnb/Stripe 스타일의 신뢰 구축 요소
 */

import React, { useEffect, useState } from 'react';

interface StatProps {
  icon: string;
  number: string;
  label: string;
  trend?: string;
  badge?: string;
}

const Stat: React.FC<StatProps> = ({ icon, number, label, trend, badge }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(number.replace(/,/g, ''));

  // 숫자 카운트업 애니메이션
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-number">{formatNumber(count)}</div>
        <div className="stat-label">{label}</div>
        {trend && <div className="stat-trend">{trend}</div>}
        {badge && <span className="stat-badge">{badge}</span>}
      </div>

      <style>{`
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          font-size: 2.5rem;
          line-height: 1;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin-top: 0.25rem;
        }

        .stat-trend {
          font-size: 0.8rem;
          color: #27ae60;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .stat-badge {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

interface ActivityProps {
  user: string;
  action: string;
  time: string;
  avatar?: string;
}

const Activity: React.FC<ActivityProps> = ({ user, action, time, avatar }) => {
  return (
    <div className="activity-item">
      <div className="activity-avatar">
        {avatar ? <img src={avatar} alt={user} /> : <div className="avatar-placeholder">{user[0]}</div>}
      </div>
      <div className="activity-content">
        <div className="activity-text">
          <strong>{user}</strong> {action}
        </div>
        <div className="activity-time">{time}</div>
      </div>

      <style>{`
        .activity-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-avatar {
          flex: 0 0 40px;
          height: 40px;
        }

        .activity-avatar img,
        .avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .avatar-placeholder {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .activity-content {
          flex: 1;
        }

        .activity-text {
          font-size: 0.9rem;
          color: #2c3e50;
        }

        .activity-text strong {
          font-weight: 600;
          color: #4a90e2;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #95a5a6;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

const LiveActivity: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="live-activity">
      <div className="live-header">
        <span className="live-indicator"></span>
        실시간 활동
      </div>
      <div className="activities-list">{children}</div>

      <style>{`
        .live-activity {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .live-header {
          background: #f8f9fa;
          padding: 1rem;
          font-weight: 600;
          color: #2c3e50;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .live-indicator {
          width: 8px;
          height: 8px;
          background: #27ae60;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .activities-list {
          max-height: 300px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

interface TestimonialProps {
  name: string;
  school: string;
  rating: number;
  text: string;
  verified?: boolean;
  avatar?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  name,
  school,
  rating,
  text,
  verified = false,
  avatar
}) => {
  return (
    <div className="testimonial">
      <div className="testimonial-header">
        <div className="testimonial-avatar">
          {avatar ? <img src={avatar} alt={name} /> : <div className="avatar-placeholder">{name[0]}</div>}
        </div>
        <div className="testimonial-info">
          <div className="testimonial-name">
            {name}
            {verified && <span className="verified-badge">✓</span>}
          </div>
          <div className="testimonial-school">{school}</div>
          <div className="testimonial-rating">
            {'⭐'.repeat(rating)}
          </div>
        </div>
      </div>
      <div className="testimonial-text">"{text}"</div>

      <style>{`
        .testimonial {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .testimonial-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .testimonial-avatar {
          flex: 0 0 50px;
        }

        .testimonial-avatar img,
        .testimonial-avatar .avatar-placeholder {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

        .testimonial-info {
          flex: 1;
        }

        .testimonial-name {
          font-weight: 600;
          color: #2c3e50;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .verified-badge {
          background: #4a90e2;
          color: white;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .testimonial-school {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin-top: 0.25rem;
        }

        .testimonial-rating {
          margin-top: 0.5rem;
          font-size: 1rem;
        }

        .testimonial-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #34495e;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export const SocialProof: React.FC = () => {
  // 실제 데이터는 API에서 가져와야 함
  const stats = {
    totalUsers: '12,847',
    aiReviews: '45,392',
    successRate: '87%'
  };

  const recentActivities = [
    { user: '김**', action: 'SKY 대학 합격!', time: '방금 전' },
    { user: '이**', action: '첫 AI 첨삭 완료', time: '2분 전' },
    { user: '박**', action: '전문가 상담 시작', time: '5분 전' },
    { user: '최**', action: '서울대 논술 자료 다운로드', time: '8분 전' },
    { user: '정**', action: '입시 데이터베이스 조회', time: '12분 전' }
  ];

  const testimonials = [
    {
      name: '김서연',
      school: '연세대 경영학과 합격',
      rating: 5,
      text: 'AI 첨삭으로 논술 실력이 눈에 띄게 향상됐어요. 전문가 상담도 정말 도움이 됐습니다!',
      verified: true
    },
    {
      name: '이준호',
      school: '서울대 경제학부 합격',
      rating: 5,
      text: '입시 데이터베이스가 정말 유용했어요. SKY 대학 논술 경향을 한눈에 파악할 수 있었습니다.',
      verified: true
    },
    {
      name: '박지민',
      school: '고려대 심리학과 합격',
      rating: 5,
      text: '전문가 선생님의 1:1 피드백 덕분에 논술 점수가 크게 올랐습니다. 감사합니다!',
      verified: true
    }
  ];

  return (
    <div className="social-proof-container">
      {/* 통계 섹션 */}
      <section className="stats-section">
        <h2 className="section-title">믿을 수 있는 입시 파트너</h2>
        <div className="stats-grid">
          <Stat
            icon="👥"
            number={stats.totalUsers}
            label="누적 사용자"
            trend="+2,341 이번 달"
          />
          <Stat
            icon="📝"
            number={stats.aiReviews}
            label="AI 첨삭 완료"
            trend="+8,234 이번 주"
          />
          <Stat
            icon="🎓"
            number={stats.successRate}
            label="평균 합격률"
            badge="2024 입시 기준"
          />
        </div>
      </section>

      {/* 실시간 활동 섹션 */}
      <section className="activity-section">
        <LiveActivity>
          {recentActivities.map((activity, index) => (
            <Activity key={index} {...activity} />
          ))}
        </LiveActivity>
      </section>

      {/* 고객 후기 섹션 */}
      <section className="testimonials-section">
        <h2 className="section-title">합격생들의 생생한 후기</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </section>

      <style>{`
        .social-proof-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          text-align: center;
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .activity-section {
          margin-bottom: 4rem;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .stats-grid,
          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export { Stat, Activity, LiveActivity, Testimonial };
export default SocialProof;
