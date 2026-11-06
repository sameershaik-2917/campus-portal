import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Toasts from './components/Toasts.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';
import CertModal from './components/CertModal.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Participants from './pages/Participants.jsx';
import Verify from './pages/Verify.jsx';
import About from './pages/About.jsx';

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <>
      <Navbar />
      <div className="h-16" />

      <div key={pathname} className="fade-up">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/participants" element={<Participants />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Toasts />
      <ConfirmModal />
      <CertModal />
      <ProjectModal />
    </>
  );
}
