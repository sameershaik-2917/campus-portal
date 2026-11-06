import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useApp } from '../context/AppContext.jsx';

const INPUT =
  'focus-ring w-full mt-2 px-4 py-3 rounded-lg bg-parchment/50 dark:bg-navy border border-ink/15 dark:border-parchment/15 text-sm transition-all';

export default function Login() {
  const navigate = useNavigate();
  const { loginStudent, toast } = useApp();
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const data = await api.login(id.trim(), pass);
      if (data.success) {
        loginStudent(data.student);
        toast('Welcome back, ' + data.student.name + '!', 'success');
        navigate('/dashboard');
      } else {
        toast(data.message || 'Login failed', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Server connection failed.', 'error');
    }
  }

  return (
    <section>
      <div className="max-w-md mx-auto px-5 py-20 fade-up">
        <div className="text-center mb-8">
          <div className="seal mx-auto mb-5">
            <span className="font-display text-navy text-2xl font-semibold">M</span>
          </div>
          <h1 className="font-display text-3xl font-semibold mb-1">Student Sign In</h1>
          <p className="text-sm text-ink/65 dark:text-parchment/65 mt-2">
            Access your participation records, project workspace &amp; certificates.
          </p>
        </div>
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-navy-light rounded-2xl p-8 shadow-2xl border border-ink/10 dark:border-parchment/15 space-y-5"
        >
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-parchment/50">Student / College ID</label>
            <input required type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. CSE001" className={INPUT} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-parchment/50">Password</label>
            <input required type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" className={INPUT} />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-lg bg-navy dark:bg-gold text-parchment dark:text-navy font-semibold text-sm hover:opacity-95 shadow-md hover:scale-101 active:scale-99 transition-all"
          >
            Sign in
          </button>
          <p className="text-[10px] text-center text-ink/45 dark:text-parchment/45 font-mono2">
            Demo mode — any ID &amp; password will sign you in.
          </p>
        </form>
        <p className="text-center text-xs text-ink/50 dark:text-parchment/50 mt-6">
          Are you an organizer or admin?{' '}
          <span className="underline cursor-pointer hover:text-gold" onClick={() => toast('Admin portal available separately.', 'info')}>
            Admin sign in
          </span>
        </p>
      </div>
    </section>
  );
}
