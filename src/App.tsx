import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Suspense, lazy, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollProgress from './components/motion/ScrollProgress';
import BootScreen from './components/BootScreen';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Experience = lazy(() => import('./pages/Experience'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Resume = lazy(() => import('./pages/Resume'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProjectsList = lazy(() => import('./pages/admin/ProjectsList'));
const ProjectEditor = lazy(() => import('./pages/admin/ProjectEditor'));
const TechnologiesAdmin = lazy(() => import('./pages/admin/TechnologiesAdmin'));
const SkillsAdmin = lazy(() => import('./pages/admin/SkillsAdmin'));
const ExperienceAdmin = lazy(() => import('./pages/admin/ExperienceAdmin'));
const MessagesAdmin = lazy(() => import('./pages/admin/MessagesAdmin'));
const SettingsAdmin = lazy(() => import('./pages/admin/SettingsAdmin'));

function RouteSpinner() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[color:var(--color-border-strong)] border-t-[color:var(--color-accent)] rounded-full animate-spin" />
    </div>
  );
}

function PublicShell({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<PublicShell><Home /></PublicShell>} />
          <Route path="/about" element={<PublicShell><About /></PublicShell>} />
          <Route path="/projects" element={<PublicShell><Projects /></PublicShell>} />
          <Route path="/projects/:slug" element={<PublicShell><ProjectDetail /></PublicShell>} />
          <Route path="/experience" element={<PublicShell><Experience /></PublicShell>} />
          <Route path="/contact" element={<PublicShell><Contact /></PublicShell>} />
          <Route path="/resume" element={<PublicShell><Resume /></PublicShell>} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><ProjectsList /></ProtectedRoute>} />
          <Route path="/admin/projects/new" element={<ProtectedRoute><ProjectEditor /></ProtectedRoute>} />
          <Route path="/admin/projects/:id/edit" element={<ProtectedRoute><ProjectEditor /></ProtectedRoute>} />
          <Route path="/admin/technologies" element={<ProtectedRoute><TechnologiesAdmin /></ProtectedRoute>} />
          <Route path="/admin/skills" element={<ProtectedRoute><SkillsAdmin /></ProtectedRoute>} />
          <Route path="/admin/experience" element={<ProtectedRoute><ExperienceAdmin /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute><MessagesAdmin /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><SettingsAdmin /></ProtectedRoute>} />

          <Route path="*" element={<PublicShell><NotFound /></PublicShell>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <BootScreen>
              <ScrollProgress />
              <Suspense fallback={<RouteSpinner />}>
                <AnimatedRoutes />
              </Suspense>
            </BootScreen>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
