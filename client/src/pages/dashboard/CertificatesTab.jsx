import { useEffect, useState } from 'react';
import * as api from '../../api';
import { useApp } from '../../context/AppContext.jsx';
import Loading from '../../components/Loading.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function CertificatesTab({ student }) {
  const { toast, openCertModal } = useApp();
  const [certs, setCerts] = useState(null);

  useEffect(() => {
    api.getCertificates(student.id).then(setCerts).catch((e) => { console.error(e); setCerts([]); });
  }, [student.id]);

  if (certs === null) return <Loading />;
  if (certs.length === 0)
    return <EmptyState title="No certificates verified yet" sub="Certificates are issued once attendance records lock." />;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-up">
      {certs.map((c) => (
        <div key={c.id} className="rounded-2xl border border-gold/40 bg-white dark:bg-navy-light p-6 text-center shadow-lg hover:shadow-2xl transition">
          <div className="seal mx-auto mb-4" style={{ width: 75, height: 75 }}>
            <span className="font-display text-navy text-base font-bold">✓</span>
          </div>
          <h3 className="font-display font-semibold text-base mb-1 text-navy dark:text-parchment">{c.title}</h3>
          <p className="text-xs text-ink/65 dark:text-parchment/65 mb-1.5">{c.event_name}</p>
          <p className="text-[10px] font-mono2 text-ink/40 dark:text-parchment/40 mb-5">{c.id}</p>
          <div className="flex gap-2">
            <button
              onClick={() => openCertModal(c.id)}
              className="flex-1 py-2.5 rounded-lg border border-ink/15 dark:border-parchment/20 text-xs font-semibold hover:border-gold transition"
            >
              View PDF
            </button>
            <button
              onClick={() => toast('Certificate downloaded successfully.', 'success')}
              className="flex-1 py-2.5 rounded-lg bg-navy dark:bg-gold text-parchment dark:text-navy text-xs font-semibold shadow transition"
            >
              Download
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
