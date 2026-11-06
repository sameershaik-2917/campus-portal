export default function About() {
  return (
    <section>
      <div className="max-w-3xl mx-auto px-5 py-20 fade-up">
        <p className="uppercase tracking-[0.2em] text-xs text-gold dark:text-gold-light font-bold mb-2">Meridian Ecosystem</p>
        <h1 className="font-display text-4xl font-semibold mb-6">Unified Campus Milestones</h1>
        <div className="space-y-6 text-ink/80 dark:text-parchment/80 leading-relaxed text-base">
          <p>
            The Campus Participation Portal replaces scattered spreadsheets, messaging groups, and paper certificates with a single
            authoritative ledger. Every student's journey — from their initial introductory workshop to major hackathons and capstone projects — is digitally cataloged.
          </p>
          <p>
            Students register dynamically, team rosters are populated in real-time, and certificates are automatically generated with custom cryptographic verification keys that any employer or academic institution can verify immediately.
          </p>
          <p className="p-5 rounded-xl border border-gold/20 bg-gold/5 text-gold-dark dark:text-gold font-medium">
            ⭐ This application is a React front end connected live to a Node.js (Express) backend server storing all records securely inside a local SQLite database file.
          </p>
        </div>
      </div>
    </section>
  );
}
