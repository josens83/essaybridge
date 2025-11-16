import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Payment from './pages/Payment';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Essays from './pages/Essays';
import EssayEditor from './pages/EssayEditor';
import EssayReview from './pages/EssayReview';
import Community from './pages/Community';
import PostDetail from './pages/PostDetail';
import Consulting from './pages/Consulting';
import Profile from './pages/Profile';
import Search from './pages/Search';
import TutorDashboard from './pages/TutorDashboard';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:id" element={<PostDetail />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/essays"
          element={
            <ProtectedRoute>
              <Essays />
            </ProtectedRoute>
          }
        />
        <Route
          path="/essays/new"
          element={
            <ProtectedRoute>
              <EssayEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/essays/edit/:id"
          element={
            <ProtectedRoute>
              <EssayEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/essays/:id"
          element={
            <ProtectedRoute>
              <EssayReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consulting"
          element={
            <ProtectedRoute>
              <Consulting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor"
          element={
            <ProtectedRoute>
              <TutorDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
