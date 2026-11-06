import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import * as api from '../api';
import { useApp } from '../context/AppContext.jsx';
import { buildTranscript, downloadTextFile, initialsOf, isMember } from '../utils/helpers.js';
import ParticipationTab from './dashboard/ParticipationTab.jsx';
import ProjectsTab from './dashboard/ProjectsTab.jsx';
import AchievementsTab from './dashboard/AchievementsTab.jsx';
import CertificatesTab from './dashboard/CertificatesTab.jsx';

const TABS = [
  { key: 'participation', label: 'My Participation' },
  { key: 'projects', label: 'Projects Workspace' },
  { key: 'achievements', label: 'Milestone Timeline' },
  { key: 'certificates', label: 'Verified Certificates' },
];

const STAT_TAB = {
  Events: 'participation',
  Workshops: 'participation',
  Competitions: 'participation',
  Projects: 'projects',
  Certificates: 'certificates',
  Achievements: 'achievements',
};

export default function Dashboard() {
  const { student, dashTab, setDashTab, confirmLogout, toast } = useApp();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (!student) return;
    api.getStats(student.id).then(setStats).catch(console.error);
  }, [student]);

  if (!student) return <Navigate to="/login" replace />;

  async function downloadTranscript() {
    toast('Generating student transcript...', 'info');
    try {
      const [participation, allProjects, certs] = await Promise.all([
        api.getParticipation(student.id),
        api.getProjects(),
        api.getCertificates(student.id),
      ]);
      const mine = allProjects.filter((p) => isMember(p, student));
      downloadTextFile(`Meridian_Ledger_${student.id}.txt`, buildTranscript(student, participation, mine, certs));
      toast('Transcript downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to generate report.', 'error');
    }
  }

  return (
    <section>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {/* Profile Header */}
        <div className="rounded-2xl bg-navy text-parchment p-8 sm:p-10 flex flex-col sm:flex-row gap-6 sm:items-center justify-between mb-10 fade-up relative overflow-hidden shadow-2xl border border-gold/15">
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-gold/10 pointer-events-none"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center font-display text-navy text-2xl font-bold shrink-0 shadow-lg border border-white/20">
              <span>{initialsOf(student.name)}</span>
            </div>
            <div>
              <p className="text-gold text-xs uppercase tracking-widest font-extrabold mb-1">Authenticated Account</p>
              <h1 className="font-display text-3xl font-semibold mb-1">{student.name}</h1>
              <p className="text-parchment/70 text-sm font-mono2">
                {student.id} · {student.dept} · {student.year} · Section {student.section}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 sm:items-center relative z-10 text-sm border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-8">
            <div>
              <p className="text-parchment/50 text-[11px] uppercase tracking-wider font-semibold mb-0.5">Email Contact</p>
              <p>{student.email}</p>
            </div>
            <div>
              <p className="text-parchment/50 text-[11px] uppercase tracking-wider font-semibold mb-0.5">Mobile Contact</p>
              <p className="font-mono2">{student.phone}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0 relative z-10 sm:self-start">
            <button onClick={downloadTranscript} className="px-5 py-2.5 rounded-full bg-gold text-navy text-xs font-bold hover:scale-102 active:scale-98 transition shadow-md">
              Download Transcript
            </button>
            <button onClick={confirmLogout} className="px-5 py-2.5 rounded-full border border-parchment/30 text-xs font-semibold hover:border-gold hover:text-gold hover:scale-102 active:scale-98 transition">
              Log out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-10">
          {stats.map((s) => (
            <div
              key={s.label}
              onClick={() => STAT_TAB[s.label] && setDashTab(STAT_TAB[s.label])}
              className="cursor-pointer rounded-2xl bg-white dark:bg-navy-light border border-ink/10 dark:border-parchment/10 p-5 text-center shadow-lg hover:border-gold/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <p className="text-2xl mb-1.5">{s.icon}</p>
              <p className="font-display text-3xl font-bold text-navy dark:text-parchment">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-ink/50 dark:text-parchment/50 font-bold mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-ink/10 dark:border-parchment/10 mb-8 overflow-x-auto text-sm font-semibold">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setDashTab(t.key)}
              className={`tab-btn py-3 border-b-2 border-transparent whitespace-nowrap ${dashTab === t.key ? 'active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div>
          {dashTab === 'participation' && <ParticipationTab student={student} />}
          {dashTab === 'projects' && <ProjectsTab student={student} />}
          {dashTab === 'achievements' && <AchievementsTab />}
          {dashTab === 'certificates' && <CertificatesTab student={student} />}
        </div>
      </div>
    </section>
  );
}
