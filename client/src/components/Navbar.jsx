import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { initialsOf, scrollToEvents } from '../utils/helpers.js';

export default function Navbar() {
  const navigate = useNavigate();
  const { student, dark, toggleTheme, requireLogin, onProfileIconClick } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Home', action: () => navigate('/') },
    { label: 'Events', action: () => { navigate('/'); setTimeout(scrollToEvents, 50); } },
    { label: 'Projects', action: () => requireLogin('projects') },
    { label: 'Participants', action: () => navigate('/participants') },
    { label: 'Certificates', action: () => requireLogin('certificates') },
    { label: 'About', action: () => navigate('/about') },
  ];

  const go = (action) => () => {
    setMenuOpen(false);
    action();
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-parchment/85 dark:bg-navy/85 border-b border-ink/10 dark:border-parchment/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={go(() => navigate('/'))}>
          <div className="w-9 h-9 rounded-full bg-navy dark:bg-gold flex items-center justify-center shadow-md">
            <span className="font-display text-gold dark:text-navy text-lg font-semibold">M</span>
          </div>
          <div className="leading-tight">
            <p className="font-display font-semibold text-[15px] sm:text-base tracking-wide">Meridian College</p>
            <p className="text-[9px] tracking-widest uppercase text-gold dark:text-gold-light font-semibold hidden sm:block">
              Campus Participation Portal
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-7 text-sm font-medium">
          {links.map((l) => (
            <a key={l.label} onClick={go(l.action)} className="nav-link hover:text-gold-dark dark:hover:text-gold cursor-pointer transition">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-ink/15 dark:border-parchment/20 hover:border-gold transition-all"
            title="Toggle theme"
          >
            <span>{dark ? '☀️' : '🌙'}</span>
          </button>
          <button
            onClick={go(onProfileIconClick)}
            className="w-9 h-9 rounded-full bg-navy dark:bg-gold text-parchment dark:text-navy flex items-center justify-center font-semibold text-sm shadow-md hover:scale-105 transition-all"
            title="Account"
          >
            <span>{student ? initialsOf(student.name) : '👤'}</span>
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center border border-ink/15 dark:border-parchment/20"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-ink/10 dark:border-parchment/10 px-5 pb-4 pt-2 flex flex-col gap-3 text-sm font-medium bg-parchment dark:bg-navy">
          {links.map((l) => (
            <a key={l.label} onClick={go(l.action)} className="cursor-pointer py-1.5 hover:text-gold">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
