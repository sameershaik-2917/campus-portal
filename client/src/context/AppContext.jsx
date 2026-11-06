import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const STORAGE_KEY = 'meridian_student';

function loadStudent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AppProvider({ children }) {
  const navigate = useNavigate();

  const [student, setStudent] = useState(loadStudent);
  const [dark, setDark] = useState(false);
  const [dashTab, setDashTab] = useState('participation');
  const [projectFilter, setProjectFilter] = useState('all');
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null); // { text, onConfirm }
  const [certModal, setCertModal] = useState(null); // { data, cells }
  const [projectModal, setProjectModal] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const toggleTheme = () => setDark((d) => !d);

  /* ---------- toasts ---------- */
  function toast(msg, type = 'info') {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2900);
  }

  /* ---------- confirm dialog ---------- */
  const openConfirm = (text, onConfirm) => setConfirm({ text, onConfirm });
  const closeConfirm = () => setConfirm(null);

  /* ---------- auth ---------- */
  function loginStudent(s) {
    setStudent(s);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }

  function confirmLogout() {
    openConfirm('Log out of your Meridian College account?', () => {
      setStudent(null);
      localStorage.removeItem(STORAGE_KEY);
      closeConfirm();
      toast('You have been logged out.', 'info');
      navigate('/');
    });
  }

  function requireLogin(targetTab) {
    if (!student) {
      toast('Please sign in to continue.', 'info');
      navigate('/login');
      return;
    }
    setDashTab(targetTab || 'participation');
    navigate('/dashboard');
  }

  const onProfileIconClick = () => navigate(student ? '/dashboard' : '/login');

  /* ---------- certificate modal ---------- */
  async function openCertModal(certId) {
    try {
      const data = await api.verifyCertificate(certId);
      if (!data.verified) return;
      // decorative QR-style grid (random, like the original)
      const cells = Array.from({ length: 49 }, () => Math.random() > 0.45);
      setCertModal({ data, cells });
    } catch (err) {
      console.error(err);
    }
  }

  async function openCertForEvent(eventName) {
    try {
      const certs = await api.getCertificates(student.id);
      const cert = certs.find(
        (c) => c.event_name === eventName || eventName.includes(c.event_name) || c.event_name.includes(eventName)
      );
      if (!cert) {
        toast('Certificate not yet issued for this event.', 'info');
        return;
      }
      openCertModal(cert.id);
    } catch (err) {
      console.error(err);
    }
  }

  function goVerifyFromModal() {
    const id = certModal?.data?.id || '';
    setCertModal(null);
    navigate('/verify', { state: { prefill: id, autoVerify: true } });
  }

  const value = {
    student, dark, toggleTheme,
    dashTab, setDashTab, projectFilter, setProjectFilter,
    toasts, toast,
    confirm, openConfirm, closeConfirm,
    loginStudent, confirmLogout, requireLogin, onProfileIconClick,
    certModal, setCertModal, openCertModal, openCertForEvent, goVerifyFromModal,
    projectModal, setProjectModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
