import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as api from '../api';

export default function Verify() {
  const location = useLocation();
  const [id, setId] = useState(location.state?.prefill || '');
  const [result, setResult] = useState(null); // { data, searched }

  async function runVerify(value) {
    const key = value.trim();
    if (!key) {
      setResult(null);
      return;
    }
    try {
      const data = await api.verifyCertificate(key);
      setResult({ data, searched: key });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (location.state?.autoVerify) runVerify(location.state.prefill || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <div className="max-w-xl mx-auto px-5 py-20 fade-up">
        <div className="text-center mb-8">
          <div className="seal mx-auto mb-5"><span className="text-3xl text-navy">✓</span></div>
          <h1 className="font-display text-3xl font-semibold mb-1">Verify a Certificate</h1>
          <p className="text-sm text-ink/65 dark:text-parchment/65 mt-2">
            Enter a unique certificate ID to verify authenticity against Meridian records.
          </p>
        </div>
        <div className="bg-white dark:bg-navy-light rounded-2xl p-8 shadow-2xl border border-ink/10 dark:border-parchment/15">
          <label className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-parchment/50">Certificate ID Verification Key</label>
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runVerify(id)}
              placeholder="e.g. CERT-CSE001-2026-014"
              className="focus-ring flex-1 px-4 py-3 rounded-lg bg-parchment dark:bg-navy border border-ink/15 dark:border-parchment/15 text-sm font-mono2 transition-all"
            />
            <button
              onClick={() => runVerify(id)}
              className="px-6 py-3 rounded-lg bg-navy dark:bg-gold text-parchment dark:text-navy font-semibold text-sm shadow-md hover:scale-102 active:scale-98 transition"
            >
              Verify Now
            </button>
          </div>

          <div className="mt-6">
            {result?.data.verified && (
              <div className="rounded-xl bg-teal/10 border border-teal/30 p-5 fade-up shadow-lg">
                <p className="text-teal font-bold text-sm mb-1.5 flex items-center gap-1">✓ Certificate Record Verified</p>
                <p className="text-xs text-ink/75 dark:text-parchment/75 leading-relaxed">
                  Confirmed: <strong>{result.data.title}</strong> issued on <strong>{result.data.date}</strong> to student{' '}
                  <strong>{result.data.student_name}</strong> for participation in <strong>{result.data.event_name}</strong>.
                </p>
              </div>
            )}
            {result && !result.data.verified && (
              <div className="rounded-xl bg-coral/10 border border-coral/30 p-5 fade-up shadow-lg">
                <p className="text-coral font-bold text-sm mb-1.5 flex items-center gap-1">✕ Registry Search Failed</p>
                <p className="text-xs text-ink/75 dark:text-parchment/75 leading-relaxed">
                  No matching certificate matches verification key <code>{result.searched}</code>. Please double-check formatting and try again.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
