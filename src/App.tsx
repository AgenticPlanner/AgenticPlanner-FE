import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const TaskPage = lazy(() => import('./pages/TaskPage'));
const ItineraryPage = lazy(() => import('./pages/ItineraryPage'));
const PlanPage = lazy(() => import('./pages/PlanPage'));

const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function App() {
  return (
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
            <TaskPage />
          </Suspense>
        }
      />
      <Route
        path="/itinerary"
        element={
          <Suspense fallback={<Spinner />}>
            <ItineraryPage />
          </Suspense>
        }
      />
      <Route
        path="/plan"
        element={
          <Suspense fallback={<Spinner />}>
            <PlanPage />
          </Suspense>
        }
      />
    </Routes>
  );
}