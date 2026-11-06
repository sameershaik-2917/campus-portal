import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// GET /api/participants?event_name=...
router.get('/', (req, res) => {
  const eventName = req.query.event_name;
  if (!eventName) return res.json([]);

  const rows = db
    .prepare(
      `SELECT s.name, s.id, s.dept, s.year, p.status
       FROM participation p
       JOIN students s ON p.student_id = s.id
       WHERE p.event_name = ?
       ORDER BY p.id`
    )
    .all(eventName);

  res.json(rows);
});

export default router;
