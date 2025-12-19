import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
          <br />
          주소를 다시 확인해 주세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-outline flex items-center justify-center"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            이전 페이지
          </button>
          <Link to="/" className="btn-primary flex items-center justify-center">
            <FiHome className="w-5 h-5 mr-2" />
            홈으로 가기
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <Link
            to="/essays"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">논술 첨삭</h3>
            <p className="text-sm text-gray-600">전문가의 논술 첨삭 서비스</p>
          </Link>

          <Link
            to="/courses"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">온라인 강의</h3>
            <p className="text-sm text-gray-600">대학별 맞춤 강의</p>
          </Link>

          <Link
            to="/community"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">커뮤니티</h3>
            <p className="text-sm text-gray-600">합격 후기 및 정보 공유</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
