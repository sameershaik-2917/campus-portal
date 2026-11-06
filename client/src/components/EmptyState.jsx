export default function EmptyState({ title, sub }) {
  return (
    <div className="fade-up text-center py-16 rounded-2xl border border-dashed border-ink/15 dark:border-parchment/15">
      <p className="text-4xl mb-4">🗂️</p>
      <p className="font-display font-semibold text-lg mb-1">{title}</p>
      <p className="text-sm text-ink/55 dark:text-parchment/55">{sub}</p>
    </div>
  );
}
