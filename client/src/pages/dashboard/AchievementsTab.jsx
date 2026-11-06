const TIMELINE = [
  {
    year: '2026',
    border: 'border-gold/40',
    items: [
      { icon: '🏆', title: '2nd Place — College Hackathon 2026', when: 'Aug 2026' },
      { icon: '📜', title: 'AI & ML Workshop Certificate', when: 'Jul 2026' },
      { icon: '💻', title: 'Smart Attendance System — Project Completed', when: 'Jun 2026' },
    ],
  },
  {
    year: '2025',
    border: 'border-gold/20',
    items: [{ icon: '🏆', title: '1st Place — Campus Energy Monitor, Innovation Expo', when: 'Oct 2025' }],
  },
];

export default function AchievementsTab() {
  return (
    <div className="fade-up space-y-8 max-w-2xl">
      {TIMELINE.map((group) => (
        <div key={group.year}>
          <p className="font-display text-2xl font-bold mb-4 text-gold dark:text-gold-light">{group.year}</p>
          <div className={`space-y-4 border-l-2 ${group.border} pl-6`}>
            {group.items.map((it) => (
              <div key={it.title} className="flex items-start gap-4">
                <span className="text-xl bg-gold/10 p-2 rounded-lg leading-none">{it.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{it.title}</p>
                  <p className="text-xs text-ink/50 dark:text-parchment/50 mt-0.5">{it.when}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
