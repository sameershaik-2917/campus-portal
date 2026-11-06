import { useApp } from '../context/AppContext.jsx';

export default function ConfirmModal() {
  const { confirm, closeConfirm } = useApp();
  if (!confirm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 backdrop-blur-sm px-4">
      <div className="bg-parchment dark:bg-navy-light rounded-2xl max-w-sm w-full p-7 border border-ink/10 dark:border-parchment/10 shadow-2xl">
        <p className="text-sm font-medium mb-6">{confirm.text}</p>
        <div className="flex gap-3">
          <button
            onClick={closeConfirm}
            className="flex-1 py-2.5 rounded-lg border border-ink/20 dark:border-parchment/25 text-sm font-semibold hover:bg-ink/5 dark:hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirm.onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-coral text-white text-sm font-semibold shadow hover:opacity-90 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
