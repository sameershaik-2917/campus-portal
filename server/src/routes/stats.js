import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

const count = (sql, ...params) => db.prepare(sql).get(...params).n;

// GET /api/stats?student_id=CSE001
router.get('/', (req, res) => {
  const id = req.query.student_id || 'CSE001';
  const student = db.prepare('SELECT name FROM students WHERE id = ?').get(id);

  const events = count('SELECT COUNT(*) AS n FROM participation WHERE student_id = ?', id);
  const projects = student
    ? count('SELECT COUNT(*) AS n FROM projects WHERE team LIKE ?', `%${student.name}%`)
    : 0;
  const workshops = count("SELECT COUNT(*) AS n FROM participation WHERE student_id = ? AND type = 'Workshop'", id);
  const competitions = count("SELECT COUNT(*) AS n FROM participation WHERE student_id = ? AND type = 'Competition'", id);
  const certificates = count('SELECT COUNT(*) AS n FROM certificates WHERE student_id = ?', id);
  const achievements = count('SELECT COUNT(*) AS n FROM participation WHERE student_id = ? AND achievement IS NOT NULL', id);

  res.json([
    { label: 'Events', value: events, icon: '\u{1F39F}\uFE0F' },
    { label: 'Projects', value: projects, icon: '\u{1F4BB}' },
    { label: 'Workshops', value: workshops, icon: '\u{1F9EA}' },
    { label: 'Competitions', value: competitions, icon: '\u{1F3C1}' },
    { label: 'Certificates', value: certificates, icon: '\u{1F4DC}' },
    { label: 'Achievements', value: achievements, icon: '\u{1F3C6}' },
  ]);
});

export default router;
