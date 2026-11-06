import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

const today = () =>
  new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

// GET /api/events
router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM events ORDER BY id').all());
});

// POST /api/events/register
router.post('/register', (req, res) => {
  const { student_id = 'CSE001', event_name, tag = 'Workshop' } = req.body || {};
  if (!event_name) {
    return res.status(400).json({ success: false, message: 'Missing event name' });
  }

  const existing = db
    .prepare('SELECT id FROM participation WHERE student_id = ? AND event_name = ?')
    .get(student_id, event_name);
  if (existing) {
    return res.json({ success: true, message: 'Already registered' });
  }

  const register = db.transaction(() => {
    db.prepare(
      `INSERT INTO participation (student_id, event_name, type, date, role, status, achievement, has_cert)
       VALUES (?, ?, ?, ?, 'Participant', 'Upcoming', NULL, 0)`
    ).run(student_id, event_name, tag, today());
    db.prepare('UPDATE events SET participants_count = participants_count + 1 WHERE name = ?').run(event_name);
  });

  try {
    register();
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: 'Unknown student' });
  }
  res.json({ success: true, message: 'Successfully registered!' });
});

export default router;
