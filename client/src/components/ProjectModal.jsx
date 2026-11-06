import { useApp } from '../context/AppContext.jsx';

const STATUS_CLASS = {
  Completed: 'bg-teal/15 text-teal',
  'In Progress': 'bg-slate2/15 text-slate2 dark:text-parchment',
};

export default function ProjectModal() {
  const { projectModal: proj, setProjectModal, student } = useApp();
  if (!proj) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 backdrop-blur-md px-4">
      <div className="bg-parchment dark:bg-navy-light rounded-2xl max-w-lg w-full p-8 relative border border-gold/50 shadow-2xl transition-all">
        <button
          onClick={() => setProjectModal(null)}
          className="absolute top-4 right-4 text-ink/40 dark:text-parchment/40 hover:text-gold transition text-lg"
        >
          ✕
        </button>
        <div className="border-b border-ink/10 dark:border-parchment/15 pb-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                STATUS_CLASS[proj.status] || 'bg-gold/20 text-gold-dark dark:text-gold-light'
              }`}
            >
              {proj.status}
            </span>
            <span className="text-xs font-mono2 text-ink/50 dark:text-parchment/50">
              {proj.dept} · {proj.year}
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-navy dark:text-parchment">{proj.title}</h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-parchment/50 mb-1">Description</h4>
            <p className="text-ink/80 dark:text-parchment/80">{proj.desc}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-parchment/50 mb-1">Project Guide</h4>
            <p className="font-semibold text-navy dark:text-parchment">{proj.guide}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-parchment/50 mb-1.5">Team &amp; Collaborators</h4>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {proj.team.map((member) => {
                const isCurrent = student && member.toLowerCase().includes(student.name.toLowerCase());
                return (
                  <span
                    key={member}
                    className={`px-3 py-1 rounded-full border ${
                      isCurrent
                        ? 'bg-gold/15 border-gold text-gold-dark dark:text-gold font-bold shadow-sm'
                        : 'bg-ink/5 dark:bg-white/5 border-ink/10 dark:border-white/10 text-ink/75 dark:text-parchment/75'
                    }`}
                  >
                    {member}
                  </span>
                );
              })}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-parchment/50 mb-1.5">Technologies</h4>
            <div className="flex flex-wrap gap-1.5">
              {proj.tech.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-parchment-dim dark:bg-navy border border-ink/10 dark:border-parchment/15 font-mono2 text-ink/80 dark:text-parchment/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
