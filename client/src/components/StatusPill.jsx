const MAP = {
  Completed: 'bg-teal/15 text-teal',
  Upcoming: 'bg-gold/20 text-gold-dark dark:text-gold-light',
  'In Progress': 'bg-slate2/15 text-slate2 dark:text-parchment',
};

export default function StatusPill({ status }) {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${MAP[status] || 'bg-ink/10'}`}>
      {status}
    </span>
  );
}
