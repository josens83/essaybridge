import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './shared/components';
import Layout from './components/layout/Layout';

// Marketing Feature (Public Pages)
import {
  HomePage as Home,
  PricingPage as Pricing,
  NotFoundPage as NotFound,
  SearchPage as Search
} from './features/marketing';

// Auth Feature
import { LoginPage as Login, RegisterPage as Register } from './features/auth';

// Dashboard Feature
import {
  StudentDashboard as Dashboard,
  AdminDashboard,
  ExpertDashboard,
  ConsultantDashboard,
  TutorDashboardPage as TutorDashboard,
  AnalyticsPage as Analytics
} from './features/dashboard';

// Payment Feature
import {
  PaymentPage as Payment,
  CheckoutPage as Checkout,
  PaymentSuccessPage as PaymentSuccess,
  PaymentHistoryPage as PaymentHistory
} from './features/payment';

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

// Chat Feature
import { ChatPage as Chat, GlobalChatProvider } from './features/chat';

// Community Feature
import { CommunityPage as Community, PostDetailPage as PostDetail } from './features/community';

// Profile Feature
import { ProfilePage as Profile } from './features/profile';

// Legal Feature
import {
  FAQPage as FAQ,
  TermsPage as Terms,
  PrivacyPage as Privacy,
  GuidePage as Guide,
  NoticePage as Notice
} from './features/legal';

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
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
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
            <GlobalChatProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </GlobalChatProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
