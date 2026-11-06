import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as api from '../api';
import StatusPill from '../components/StatusPill.jsx';

const toPill = (status) =>
  status === 'Participated' ? 'Completed' : status === 'Registered' ? 'Upcoming' : 'Completed';

export default function Participants() {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(location.state?.event || '');
  const [list, setList] = useState([]);

  useEffect(() => {
    api.getEvents().then((ev) => {
      setEvents(ev);
      setSelected((s) => s || ev[0]?.name || '');
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.getParticipants(selected).then(setList).catch(console.error);
  }, [selected]);

  return (
    <section>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <p className="uppercase tracking-[0.2em] text-xs text-gold dark:text-gold-light font-bold mb-1">Global Directory</p>
        <h1 className="font-display text-4xl font-semibold mb-6">Event Participation Records</h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white dark:bg-navy-light p-4 rounded-xl border border-ink/10 dark:border-parchment/10 shadow-lg">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-parchment/50">Filter Event:</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="focus-ring px-4 py-2.5 rounded-lg bg-parchment dark:bg-navy border border-ink/15 dark:border-parchment/15 text-sm font-semibold"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.name}>{ev.name}</option>
              ))}
            </select>
          </div>
          <span className="text-sm font-mono2 font-semibold text-gold dark:text-gold-light">Verified Records: {list.length}</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-ink/10 dark:border-parchment/10 shadow-xl bg-white dark:bg-navy-light">
          <table className="w-full text-sm text-left">
            <thead className="bg-navy text-parchment text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold">Student ID</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Academic Year</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5 dark:divide-parchment/10 font-medium">
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-parchment-dim/50 dark:hover:bg-navy/40 transition duration-150">
                  <td className="px-6 py-4 font-semibold text-navy dark:text-parchment">{p.name}</td>
                  <td className="px-6 py-4 font-mono2 text-xs text-ink/50 dark:text-parchment/50">{p.id}</td>
                  <td className="px-6 py-4 text-ink/70 dark:text-parchment/70">{p.dept}</td>
                  <td className="px-6 py-4 text-ink/70 dark:text-parchment/70">{p.year}</td>
                  <td className="px-6 py-4 text-right"><StatusPill status={toPill(p.status)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
