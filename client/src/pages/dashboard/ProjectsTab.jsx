import { useEffect, useState } from 'react';
import * as api from '../../api';
import { useApp } from '../../context/AppContext.jsx';
import { isMember } from '../../utils/helpers.js';
import Loading from '../../components/Loading.jsx';
import StatusPill from '../../components/StatusPill.jsx';

const FIELD =
  'focus-ring w-full mt-1 px-3 py-2 rounded-lg bg-parchment/50 dark:bg-navy border border-ink/15 dark:border-parchment/15';
const LABEL = 'uppercase tracking-wide text-ink/55 dark:text-parchment/55';

export default function ProjectsTab({ student }) {
  const { toast, projectFilter, setProjectFilter, setProjectModal } = useApp();
  const [projects, setProjects] = useState(null);
  const [form, setForm] = useState({ title: '', desc: '', tech: '', team: student.name });

  const load = () => api.getProjects().then(setProjects).catch((e) => { console.error(e); setProjects([]); });
  useEffect(() => { load(); }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await api.addProject({
        title: form.title.trim(),
        desc: form.desc.trim(),
        tech: form.tech.trim(),
        team: form.team.trim(),
      });
      if (data.success) {
        toast('Project deployed successfully!', 'success');
        setForm({ title: '', desc: '', tech: '', team: student.name });
        load();
      } else {
        toast(data.message || 'Submission failed', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (projects === null) return <Loading />;

  const shown = projectFilter === 'my' ? projects.filter((p) => isMember(p, student)) : projects;
  const toggleClass = (active) =>
    `px-3 py-1.5 rounded-md ${active ? 'bg-navy dark:bg-gold text-parchment dark:text-navy shadow-sm' : 'text-ink/60 dark:text-parchment/60'} transition`;

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start fade-up">
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between border-b border-ink/10 dark:border-parchment/10 pb-2">
          <h2 className="text-xl font-display font-semibold">Active Repository</h2>
          <div className="flex gap-2 bg-parchment-dim dark:bg-navy p-1 rounded-lg text-xs font-semibold">
            <button onClick={() => setProjectFilter('all')} className={toggleClass(projectFilter === 'all')}>All Repositories</button>
            <button onClick={() => setProjectFilter('my')} className={toggleClass(projectFilter === 'my')}>My Projects</button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {shown.length === 0 ? (
            <div className="col-span-2 py-10 text-center text-ink/50 dark:text-parchment/50">
              <p className="text-2xl mb-2">📁</p>
              <p>No projects found in this view.</p>
            </div>
          ) : (
            shown.map((p) => (
              <div key={p.id} className="glass-card rounded-2xl p-6 shadow-xl border border-ink/10 dark:border-parchment/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <h3 className="font-display font-semibold text-base text-navy dark:text-parchment">{p.title}</h3>
                    <StatusPill status={p.status} />
                  </div>
                  <p className="text-xs text-ink/65 dark:text-parchment/65 mb-4 leading-relaxed line-clamp-3">{p.desc}</p>
                  <p className="text-[10px] text-ink/55 dark:text-parchment/55 mb-1.5 font-mono2"><strong>Guide:</strong> {p.guide}</p>
                  <p className="text-[10px] text-ink/55 dark:text-parchment/55 mb-4 font-mono2"><strong>Team:</strong> {p.team.join(', ')}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.tech.map((t) => (
                      <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-parchment-dim dark:bg-navy border border-ink/5 dark:border-parchment/10 font-mono2">{t}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => setProjectModal(p)}
                    className="w-full py-2 rounded-lg bg-navy/5 dark:bg-white/5 border border-ink/10 dark:border-parchment/15 text-xs font-semibold hover:border-gold hover:text-gold transition"
                  >
                    View Details &amp; Info
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-4 bg-white dark:bg-navy-light border border-ink/10 dark:border-parchment/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-display font-semibold mb-4">Submit New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className={LABEL}>Project Title</label>
            <input required type="text" value={form.title} onChange={set('title')} placeholder="e.g. Smart Irrigation System" className={FIELD} />
          </div>
          <div>
            <label className={LABEL}>Short Description</label>
            <textarea required rows="3" value={form.desc} onChange={set('desc')} placeholder="Explain the key project features..." className={FIELD}></textarea>
          </div>
          <div>
            <label className={LABEL}>Technologies (comma separated)</label>
            <input required type="text" value={form.tech} onChange={set('tech')} placeholder="React, Node.js, SQLite" className={FIELD} />
          </div>
          <div>
            <label className={LABEL}>Team Roster (comma separated)</label>
            <input required type="text" value={form.team} onChange={set('team')} className={FIELD} />
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-navy dark:bg-gold text-parchment dark:text-navy font-bold hover:opacity-90 shadow transition">
            Deploy Project
          </button>
        </form>
      </div>
    </div>
  );
}
