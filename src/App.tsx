import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollProgress from './components/motion/ScrollProgress';
import BootScreen from './components/BootScreen';

import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import Dashboard from './pages/admin/Dashboard';
import ProjectsList from './pages/admin/ProjectsList';
import ProjectEditor from './pages/admin/ProjectEditor';
import TechnologiesAdmin from './pages/admin/TechnologiesAdmin';
import SkillsAdmin from './pages/admin/SkillsAdmin';
import ExperienceAdmin from './pages/admin/ExperienceAdmin';
import MessagesAdmin from './pages/admin/MessagesAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';

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
              <AnimatedRoutes />
            </BootScreen>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
