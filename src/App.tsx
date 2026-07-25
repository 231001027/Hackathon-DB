import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import ProtectedRoute from '@/routes/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CardSkeleton } from '@/components/ui/Skeleton';

// Lazy-load pages for code-splitting and to show the page-transition skeletons.
const PublicLayout = lazy(() => import('@/layouts/PublicLayout'));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const StudentDashboard = lazy(() => import('@/pages/StudentDashboard'));
const TeamDetailsPage = lazy(() => import('@/pages/TeamDetailsPage'));
const TeamMembersSetupPage = lazy(() => import('@/pages/TeamMembersSetupPage'));
const MemberRegisterPage = lazy(() => import('@/pages/MemberRegisterPage'));
const TeamLeaderRegisterPage = lazy(() => import('@/pages/TeamLeaderRegisterPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminTeams = lazy(() => import('@/pages/admin/AdminTeams'));
const AdminSubmissions = lazy(() => import('@/pages/admin/AdminSubmissions'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminDebugger = lazy(() => import('@/pages/admin/AdminDebugger'));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/features', element: <LandingPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register-team-leader', element: <TeamLeaderRegisterPage /> },
      { path: '/member-register', element: <MemberRegisterPage /> },
      { path: '/student-login', element: <LoginPage mode="student" /> },
      { path: '/admin-login', element: <LoginPage mode="admin" /> },
    ],
  },
  {
    path: '/student/dashboard',
    element: (
      <ProtectedRoute role="student">
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/student/setup-members',
    element: (
      <ProtectedRoute role="student">
        <TeamMembersSetupPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/team-details',
    element: (
      <ProtectedRoute role="student">
        <TeamDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'teams', element: <AdminTeams /> },
      { path: 'submissions', element: <AdminSubmissions /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'settings', element: <AdminSettings /> },
      { path: 'debugger', element: <AdminDebugger /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Suspense fallback={<PageFallback />}>
              <RouterProvider router={router} />
            </Suspense>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
