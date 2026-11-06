import { useApp } from '../context/AppContext.jsx';

const COLORS = {
  success: 'bg-teal text-white border-l-4 border-white/40',
  info: 'bg-navy text-parchment border-l-4 border-gold',
  error: 'bg-coral text-white border-l-4 border-white/40',
};

export default function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast px-5 py-3.5 rounded-xl text-sm font-semibold shadow-2xl flex items-center gap-3 backdrop-blur-md ${COLORS[t.type] || COLORS.info}`}
        >
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
