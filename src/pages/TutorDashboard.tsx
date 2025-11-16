import { useState } from 'react';
import {
  FiFileText,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit,
  FiMessageSquare,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import type { Essay } from '../types';

interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  targetUniversities: string[];
  totalEssays: number;
  completedReviews: number;
  nextConsultation?: string;
}

interface ConsultationSchedule {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'essays' | 'students' | 'schedule'>('overview');

  // Mock data for tutor
  const tutorStats = {
    totalStudents: 23,
    pendingReviews: 8,
    completedReviews: 142,
    upcomingConsultations: 5,
    monthlyEarnings: 2450000,
    averageRating: 4.8,
  };

  const pendingEssays: Essay[] = [
    {
      id: 'essay1',
      studentId: 'student1',
      title: '서울대 경영학과 지원 동기',
      content: '저는 어릴 적부터 기업가 정신에 관심이 많았습니다...',
      university: '서울대학교',
      department: '경영학과',
      essayType: 'university_specific',
      status: 'submitted',
      wordCount: 1150,
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:30:00Z',
      submittedAt: '2024-01-20T11:00:00Z',
    },
    {
      id: 'essay2',
      studentId: 'student2',
      title: '연세대 컴퓨터공학과 학업 계획',
      content: 'AI 기술의 발전은 우리 사회를 빠르게 변화시키고 있습니다...',
      university: '연세대학교',
      department: '컴퓨터공학과',
      essayType: 'university_specific',
      status: 'submitted',
      wordCount: 1020,
      createdAt: '2024-01-21T14:00:00Z',
      updatedAt: '2024-01-21T14:30:00Z',
      submittedAt: '2024-01-21T15:00:00Z',
    },
  ];

  const students: Student[] = [
    {
      id: 'student1',
      name: '김지은',
      email: 'jieun@example.com',
      grade: 3,
      targetUniversities: ['서울대학교', '연세대학교'],
      totalEssays: 12,
      completedReviews: 10,
      nextConsultation: '2024-01-25T15:00:00Z',
    },
    {
      id: 'student2',
      name: '이민준',
      email: 'minjun@example.com',
      grade: 3,
      targetUniversities: ['고려대학교', 'KAIST'],
      totalEssays: 8,
      completedReviews: 7,
    },
    {
      id: 'student3',
      name: '박서연',
      email: 'seoyeon@example.com',
      grade: 2,
      targetUniversities: ['연세대학교', '성균관대학교'],
      totalEssays: 5,
      completedReviews: 5,
      nextConsultation: '2024-01-26T14:00:00Z',
    },
  ];

  const consultations: ConsultationSchedule[] = [
    {
      id: 'consult1',
      studentId: 'student1',
      studentName: '김지은',
      date: '2024-01-25',
      time: '15:00',
      type: '논술 전략 상담',
      status: 'scheduled',
    },
    {
      id: 'consult2',
      studentId: 'student3',
      studentName: '박서연',
      date: '2024-01-26',
      time: '14:00',
      type: '학과 선택 상담',
      status: 'scheduled',
    },
    {
      id: 'consult3',
      studentId: 'student2',
      studentName: '이민준',
      date: '2024-01-27',
      time: '16:00',
      type: '입시 전략 상담',
      status: 'scheduled',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">튜터 대시보드</h1>
          <p className="text-gray-600">학생 관리 및 첨삭 업무를 효율적으로 처리하세요.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">전체 학생</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{tutorStats.totalStudents}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-600">대기 중인 첨삭</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{tutorStats.pendingReviews}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">완료한 첨삭</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{tutorStats.completedReviews}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiCalendar className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">예정된 상담</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{tutorStats.upcomingConsultations}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">이번 달 수익</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ₩{tutorStats.monthlyEarnings.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-600">평균 평점</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{tutorStats.averageRating}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: '개요', icon: FiFileText },
                { id: 'essays', label: '대기 중인 첨삭', icon: FiEdit },
                { id: 'students', label: '학생 관리', icon: FiUsers },
                { id: 'schedule', label: '상담 일정', icon: FiCalendar },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">최근 활동</h2>
                  <div className="space-y-3">
                    {[
                      {
                        icon: FiCheckCircle,
                        text: '김지은 학생의 논술 첨삭을 완료했습니다.',
                        time: '30분 전',
                        type: 'success',
                      },
                      {
                        icon: FiCalendar,
                        text: '박서연 학생과의 상담이 내일 오후 2시에 예정되어 있습니다.',
                        time: '2시간 전',
                        type: 'info',
                      },
                      {
                        icon: FiAlertCircle,
                        text: '새로운 첨삭 요청 2건이 도착했습니다.',
                        time: '3시간 전',
                        type: 'warning',
                      },
                      {
                        icon: FiMessageSquare,
                        text: '이민준 학생이 메시지를 보냈습니다.',
                        time: '5시간 전',
                        type: 'info',
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <activity.icon
                          className={`w-5 h-5 mt-0.5 ${
                            activity.type === 'success'
                              ? 'text-green-600'
                              : activity.type === 'warning'
                              ? 'text-yellow-600'
                              : 'text-blue-600'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-gray-900">{activity.text}</p>
                          <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Essays Tab */}
            {activeTab === 'essays' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">대기 중인 첨삭</h2>
                {pendingEssays.map((essay) => (
                  <div key={essay.id} className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{essay.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{essay.university}</span>
                          <span>•</span>
                          <span>{essay.department}</span>
                          <span>•</span>
                          <span>제출: {new Date(essay.submittedAt!).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        제출됨
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{essay.content}</p>
                    <div className="flex gap-3">
                      <Link
                        to={`/essays/${essay.id}`}
                        className="btn-primary text-sm"
                      >
                        <FiEdit className="w-4 h-4 inline mr-2" />
                        첨삭 시작
                      </Link>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        상세 보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">담당 학생</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {students.map((student) => (
                    <div key={student.id} className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                        <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                          {student.grade}학년
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">목표 대학</span>
                          <span className="font-medium text-gray-900">
                            {student.targetUniversities.join(', ')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">제출 논술</span>
                          <span className="font-medium text-gray-900">{student.totalEssays}건</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">완료 첨삭</span>
                          <span className="font-medium text-gray-900">{student.completedReviews}건</span>
                        </div>
                        {student.nextConsultation && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">다음 상담</span>
                            <span className="font-medium text-primary-600">
                              {new Date(student.nextConsultation).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                        )}
                      </div>
                      <button className="w-full btn-outline text-sm">
                        학생 상세 정보
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">상담 일정</h2>
                <div className="space-y-3">
                  {consultations.map((consult) => (
                    <div
                      key={consult.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <FiCalendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{consult.studentName}</h3>
                          <p className="text-sm text-gray-600">{consult.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {new Date(consult.date).toLocaleDateString('ko-KR')}
                        </p>
                        <p className="text-sm text-gray-600">{consult.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                          참가
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          변경
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
