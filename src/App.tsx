import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { PlanProvider } from './contexts/PlanContext';
import { ProtectedRoute } from './components/common';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const TaskPage = lazy(() => import('./pages/TaskPage'));
const ItineraryPage = lazy(() => import('./pages/ItineraryPage'));
const PlanPage = lazy(() => import('./pages/PlanPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));

const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <PlanProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth"
          element={
            <Suspense fallback={<Spinner />}>
              <AuthPage />
            </Suspense>
          }
        />
        <Route
          path="/tasks"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/itinerary"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                <ItineraryPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/plan"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                <PlanPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/chat"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
      </Routes>
        </PlanProvider>
      </ChatProvider>
    </AuthProvider>
  );
}