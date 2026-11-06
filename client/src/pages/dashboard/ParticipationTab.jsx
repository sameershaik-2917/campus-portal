import { useEffect, useState } from 'react';
import * as api from '../../api';
import { useApp } from '../../context/AppContext.jsx';
import Loading from '../../components/Loading.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatusPill from '../../components/StatusPill.jsx';

export default function ParticipationTab({ student }) {
  const { toast, openCertForEvent } = useApp();
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.getParticipation(student.id).then(setItems).catch((e) => { console.error(e); setItems([]); });
  }, [student.id]);

  if (items === null) return <Loading />;
  if (items.length === 0)
    return <EmptyState title="No participation records yet" sub="Register for an event to see it appear here." />;

  return (
    <div className="grid sm:grid-cols-2 gap-6 fade-up">
      {items.map((p) => (
        <div key={p.id} className="glass-card rounded-2xl p-6 shadow-xl border border-ink/10 dark:border-parchment/10">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-navy dark:text-parchment">{p.event_name}</h3>
            <StatusPill status={p.status} />
          </div>
          <p className="text-xs text-ink/65 dark:text-parchment/65 mb-1.5"><strong>Role:</strong> {p.role} · <strong>Type:</strong> {p.type}</p>
          <p className="text-xs text-ink/65 dark:text-parchment/65 mb-4">📅 Registered/Attended: {p.date}</p>
          {p.achievement && (
            <p className="text-xs font-semibold text-gold-dark dark:text-gold-light mb-4 flex items-center gap-1">🏆 Award: {p.achievement}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => toast(`Viewing details for ${p.event_name}...`, 'info')}
              className="flex-1 py-2 rounded-lg border border-ink/15 dark:border-parchment/20 text-xs font-semibold hover:border-gold transition"
            >
              Roster Details
            </button>
            {p.has_cert ? (
              <button
                onClick={() => openCertForEvent(p.event_name)}
                className="flex-1 py-2 rounded-lg bg-navy dark:bg-gold text-parchment dark:text-navy text-xs font-semibold shadow transition"
              >
                Certificate
              </button>
            ) : (
              <button disabled className="flex-1 py-2 rounded-lg bg-ink/5 dark:bg-white/5 text-ink/35 dark:text-parchment/35 text-xs font-semibold cursor-not-allowed">
                Cert Pending
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
