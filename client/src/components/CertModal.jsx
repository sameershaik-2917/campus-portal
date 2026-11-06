import { useApp } from '../context/AppContext.jsx';

export default function CertModal() {
  const { certModal, setCertModal, goVerifyFromModal, toast } = useApp();
  if (!certModal) return null;
  const { data, cells } = certModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 backdrop-blur-md px-4">
      <div className="bg-parchment dark:bg-navy-light rounded-2xl max-w-lg w-full p-8 relative border border-gold/50 shadow-2xl transition-all">
        <button
          onClick={() => setCertModal(null)}
          className="absolute top-4 right-4 text-ink/40 dark:text-parchment/40 hover:text-gold transition text-lg"
        >
          ✕
        </button>
        <div
          className="text-center border-2 border-gold/50 rounded-xl p-8 bg-parchment-dim dark:bg-navy"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(201,162,39,0.08), transparent 60%)' }}
        >
          <p className="font-display text-lg mb-1 tracking-wide">Meridian College</p>
          <p className="text-[9px] uppercase tracking-[0.3em] text-ink/50 dark:text-parchment/50 mb-6 font-bold">
            Certificate of Achievement
          </p>
          <div className="seal mx-auto mb-5" style={{ width: 90, height: 90 }}>
            <span className="font-display text-navy font-bold text-xl">✓</span>
          </div>
          <p className="text-xs text-ink/60 dark:text-parchment/60 mb-1">This certifies that</p>
          <p className="font-display text-2xl font-semibold mb-1 text-navy dark:text-parchment">{data.student_name}</p>
          <p className="text-sm text-ink/70 dark:text-parchment/70 mb-5 italic">
            {data.title} — {data.event_name}
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-ink/5 dark:border-parchment/5">
            <div className="qr-grid">
              {cells.map((transparent, i) => (
                <div key={i} className="qr-cell" style={transparent ? { background: 'transparent' } : undefined} />
              ))}
            </div>
            <div className="text-left text-xs font-mono2 text-ink/50 dark:text-parchment/50 space-y-1">
              <p>ID: {data.id}</p>
              <p>Date: {data.date}</p>
              <p className="text-[9px] text-teal-light font-bold">✓ VERIFIED BY MERIDIAN</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => toast('Downloading high-resolution certificate...', 'success')}
            className="flex-1 py-3 rounded-lg bg-navy dark:bg-gold text-parchment dark:text-navy text-sm font-semibold shadow hover:opacity-90 transition"
          >
            Download PDF
          </button>
          <button
            onClick={goVerifyFromModal}
            className="flex-1 py-3 rounded-lg border border-ink/20 dark:border-parchment/25 text-sm font-semibold hover:border-gold hover:text-gold transition"
          >
            Verify Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
