import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';

// Public Pages
import Home from './pages/Home';
import Pricing from './pages/Pricing';

// Auth Feature
import { LoginPage as Login, RegisterPage as Register } from './features/auth';

// Dashboard Feature
import {
  StudentDashboard as Dashboard,
  AdminDashboard,
  ExpertDashboard,
  ConsultantDashboard
} from './features/dashboard';

// Payment Feature
import {
  PaymentPage as Payment,
  CheckoutPage as Checkout
} from './features/payment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentHistory from './pages/PaymentHistory';

// Courses Feature
import { CoursesPage as Courses, CourseDetailPage as CourseDetail } from './features/courses';

// Essays Feature
import {
  EssaysPage as Essays,
  EssayEditorPage as EssayEditor,
  EssayReviewPage as EssayReview
} from './features/essays';

// Consulting Feature
import { ConsultingPage as Consulting } from './features/consulting';

// Other Pages
import Community from './pages/Community';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Search from './pages/Search';
import TutorDashboard from './pages/TutorDashboard';
import Analytics from './pages/Analytics';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Guide from './pages/Guide';
import Notice from './pages/Notice';
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
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/notice" element={<Notice />} />

        {/* Protected Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/history"
          element={
            <ProtectedRoute>
              <PaymentHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
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
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expert"
          element={
            <ProtectedRoute>
              <ExpertDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultant"
          element={
            <ProtectedRoute>
              <ConsultantDashboard />
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
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
