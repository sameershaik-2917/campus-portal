import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useApp } from '../context/AppContext.jsx';
import { scrollToEvents } from '../utils/helpers.js';

export default function Home() {
  const navigate = useNavigate();
  const { student, toast, requireLogin, onProfileIconClick, setDashTab } = useApp();
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');

  const loadEvents = () => api.getEvents().then(setEvents).catch(console.error);

  useEffect(() => {
    loadEvents();
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  async function registerForEvent(name, tag) {
    if (!student) {
      toast('Sign in to register for ' + name + '.', 'info');
      navigate('/login');
      return;
    }
    try {
      const data = await api.registerEvent(student.id, name, tag);
      if (data.success) {
        toast(data.message || 'Successfully registered!', 'success');
        setDashTab('participation');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleGlobalSearch(value) {
    if (!value.trim()) return;
    toast(`Searching ledger for "${value}"...`, 'info');
    const q = value.toLowerCase();
    if (q.includes('cert') || q.includes('id') || q.includes('verify')) {
      navigate('/verify', { state: { prefill: value } });
    } else if (q.includes('work') || q.includes('hack') || q.includes('event')) {
      scrollToEvents();
    } else if (q.includes('project') || q.includes('code')) {
      requireLogin('projects');
    } else {
      navigate('/participants');
    }
  }

  return (
    <section>
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-20 grid md:grid-cols-12 gap-12 items-center">
        <div className="fade-up md:col-span-7">
          <p className="uppercase tracking-[0.25em] text-xs text-gold dark:text-gold-light font-bold mb-4">One record. Every milestone.</p>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.08] mb-5 tracking-tight">
            Your entire college journey,<br /> in a single place.
          </h1>
          <p className="text-ink/70 dark:text-parchment/70 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
            Every event, project, award, and certificate you earn at Meridian — tracked, verified, and always within reach.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onProfileIconClick}
              className="px-6 py-3.5 rounded-full bg-navy dark:bg-gold text-parchment dark:text-navy font-semibold text-sm shadow-lg hover:shadow-gold/25 hover:-translate-y-0.5 transition-all"
            >
              Go to my dashboard
            </button>
            <button
              onClick={scrollToEvents}
              className="px-6 py-3.5 rounded-full border border-ink/20 dark:border-parchment/25 font-semibold text-sm hover:border-gold hover:-translate-y-0.5 transition-all"
            >
              Browse events
            </button>
          </div>
          <div className="flex gap-8 mt-12 font-mono2 text-sm border-t border-ink/10 dark:border-parchment/10 pt-8">
            <div><p className="text-3xl font-semibold text-navy dark:text-gold font-display">4,200+</p><p className="text-ink/50 dark:text-parchment/50 text-xs mt-1">Students</p></div>
            <div><p className="text-3xl font-semibold text-navy dark:text-gold font-display">310+</p><p className="text-ink/50 dark:text-parchment/50 text-xs mt-1">Events / year</p></div>
            <div><p className="text-3xl font-semibold text-navy dark:text-gold font-display">9,800+</p><p className="text-ink/50 dark:text-parchment/50 text-xs mt-1">Certificates issued</p></div>
          </div>
        </div>

        <div className="md:col-span-5 flex justify-center">
          <div className="record-stack">
            <div className="record-card c1 bg-navy text-parchment border border-gold/20 shadow-2xl">
              <p className="text-[9px] tracking-widest uppercase text-gold/80 mb-6 font-semibold">Student ID Card</p>
              <p className="font-display text-xl mb-1">Rahul Sharma</p>
              <p className="font-mono2 text-xs text-parchment/60 mb-8">CSE001 · 3rd Year</p>
              <div className="w-8 h-8 rounded-full bg-gold/80 flex items-center justify-center font-bold text-navy text-xs">RS</div>
            </div>
            <div className="record-card c2 bg-white dark:bg-navy-light text-ink dark:text-parchment border border-ink/10 dark:border-parchment/15 shadow-2xl">
              <p className="text-[9px] tracking-widest uppercase text-navy/60 dark:text-parchment/60 mb-6 font-semibold">Award Certificate</p>
              <p className="font-display text-xl mb-1">2nd Place Winner</p>
              <p className="font-mono2 text-xs text-ink/50 dark:text-parchment/50 mb-8">Hackathon 2026</p>
              <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center text-[10px] text-gold font-bold">★</div>
            </div>
            <div className="record-card c3 bg-gold text-navy shadow-2xl">
              <p className="text-[9px] tracking-widest uppercase text-navy/70 mb-6 font-semibold">Verified Event Pass</p>
              <p className="font-display text-xl mb-1">AI Workshop</p>
              <p className="font-mono2 text-xs text-navy/70 mb-8">22 Aug · Seminar Hall B</p>
              <div className="w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center text-xs font-bold">✓</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 -mt-4 mb-14">
        <div className="flex items-center gap-3 bg-white dark:bg-navy-light rounded-full px-5 py-3.5 shadow-xl shadow-ink/5 border border-ink/10 dark:border-parchment/10 focus-within:border-gold transition-all duration-300">
          <span className="text-ink/40 dark:text-parchment/40 text-lg">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGlobalSearch(query)}
            placeholder="Search events, projects, participants or certificates…"
            className="flex-1 bg-transparent text-sm placeholder:text-ink/40 dark:placeholder:text-parchment/40 focus:outline-none"
          />
          <button
            onClick={() => handleGlobalSearch(query)}
            className="text-xs font-semibold px-5 py-2.5 rounded-full bg-navy dark:bg-gold text-parchment dark:text-navy hover:scale-102 active:scale-98 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* ANNOUNCEMENTS */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-14">
        <div className="rounded-2xl bg-gradient-to-r from-navy via-navy-light to-slate2 text-parchment px-6 py-4 flex flex-wrap items-center gap-4 shadow-lg border border-gold/10">
          <span className="px-3 py-1 rounded-full bg-gold text-navy text-[10px] font-extrabold uppercase tracking-widest">Notice Board</span>
          <p className="text-sm text-parchment/90 flex-1">
            Registrations for <strong>National Level Hackathon 2026</strong> close on <strong>2 Sep</strong> — team size up to 4.
          </p>
        </div>
      </div>

      {/* FEATURED EVENTS */}
      <div id="events-anchor" className="max-w-7xl mx-auto px-5 sm:px-8 mb-16 scroll-mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-gold dark:text-gold-light font-bold mb-1">Featured</p>
            <h2 className="font-display text-3xl font-semibold">Upcoming Campus Events</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="event-card group rounded-2xl overflow-hidden border border-ink/10 dark:border-parchment/15 bg-white dark:bg-navy-light hover:-translate-y-1.5 transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl"
            >
              <div className="h-32 relative overflow-hidden bg-gradient-to-br from-navy via-navy-light to-slate2 flex items-end p-4 border-b border-ink/5">
                <div className="banner-shine absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/15 to-transparent"></div>
                <span className="text-[9px] uppercase tracking-widest bg-gold text-navy font-bold px-3 py-1.5 rounded-full relative shadow-md">{ev.tag}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display font-semibold text-[16px] mb-2 leading-snug group-hover:text-gold transition-colors">{ev.name}</h3>
                <p className="text-[11px] font-mono2 text-ink/55 dark:text-parchment/55 mb-3 flex items-center gap-1">📅 {ev.date} · 📍 {ev.venue}</p>
                <p className="text-xs text-ink/65 dark:text-parchment/65 mb-4 flex-1 leading-relaxed">{ev.desc}</p>
                <p className="text-[11px] font-semibold text-gold dark:text-gold-light mb-4">👥 {ev.participants_count} registered</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/participants', { state: { event: ev.name } })}
                    className="flex-1 py-2.5 rounded-lg border border-ink/15 dark:border-parchment/20 text-xs font-semibold hover:border-gold transition"
                  >
                    Roster
                  </button>
                  <button
                    onClick={() => registerForEvent(ev.name, ev.tag)}
                    className="flex-1 py-2.5 rounded-lg bg-navy dark:bg-gold text-parchment dark:text-navy text-xs font-bold hover:opacity-90 shadow transition"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT PROJECTS */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-gold dark:text-gold-light font-bold mb-1">Showcase</p>
            <h2 className="font-display text-3xl font-semibold">Recent Student Projects</h2>
          </div>
          <button onClick={() => requireLogin('projects')} className="text-sm font-semibold hover:text-gold flex items-center gap-1 transition">
            View all <span className="text-xs">→</span>
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((p) => (
            <div key={p.id} className="glass-card rounded-2xl p-6 shadow-xl border border-ink/10 dark:border-parchment/10">
              <p className="text-[10px] uppercase tracking-widest text-gold dark:text-gold-light font-bold mb-2 flex items-center gap-1">⚡ {p.status}</p>
              <h3 className="font-display font-semibold text-lg mb-2 text-navy dark:text-parchment">{p.title}</h3>
              <p className="text-xs text-ink/65 dark:text-parchment/65 mb-4 leading-relaxed">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {p.tech.map((t) => (
                  <span key={t} className="text-[9px] px-2.5 py-1 rounded-full bg-parchment-dim dark:bg-navy border border-ink/10 dark:border-parchment/15 font-mono2 text-ink/80 dark:text-parchment/80">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-ink/10 dark:border-parchment/10 mt-10 bg-parchment/30 dark:bg-navy-dark/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 flex flex-col sm:flex-row justify-between gap-6 text-sm text-ink/60 dark:text-parchment/60">
          <div>
            <p className="font-display text-xl text-ink dark:text-parchment font-semibold mb-1">Meridian College</p>
            <p className="max-w-sm mt-2">Campus Participation Portal — a unified digital vault verifying every student's legacy.</p>
          </div>
          <div className="flex gap-8 items-center">
            <a onClick={() => navigate('/verify')} className="cursor-pointer hover:text-gold font-medium">Verify a Certificate</a>
            <a onClick={() => navigate('/about')} className="cursor-pointer hover:text-gold font-medium">About Portal</a>
          </div>
        </div>
      </footer>
    </section>
  );
}
