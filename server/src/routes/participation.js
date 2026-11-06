import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// GET /api/participation?student_id=CSE001
router.get('/', (req, res) => {
  const id = req.query.student_id || 'CSE001';
  res.json(db.prepare('SELECT * FROM participation WHERE student_id = ? ORDER BY id').all(id));
});

export default router;
