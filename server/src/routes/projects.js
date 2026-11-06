import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

const splitList = (s) => String(s || '').split(',').map((t) => t.trim()).filter(Boolean);

// GET /api/projects  (tech and team are returned as arrays)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY id').all();
  res.json(rows.map((p) => ({ ...p, tech: splitList(p.tech), team: splitList(p.team) })));
});

// POST /api/projects
router.post('/', (req, res) => {
  const {
    title,
    desc,
    tech = '',
    team = '',
    guide = 'Dr. Meera Nair',
    dept = 'CSE',
    year = '2026',
    status = 'Completed',
  } = req.body || {};

  if (!title || !desc) {
    return res.status(400).json({ success: false, message: 'Missing title or description' });
  }

  db.prepare(
    'INSERT INTO projects (title, "desc", tech, team, guide, dept, year, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(title, desc, tech, team, guide, dept, year, status);

  res.json({ success: true, message: 'Project added successfully!' });
});

export default router;
