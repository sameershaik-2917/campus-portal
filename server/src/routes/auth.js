import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';

const router = Router();
const DEMO_MODE = process.env.DEMO_MODE !== 'false';

const publicStudent = (row) => {
  const { password, ...rest } = row; // never send the password hash
  return rest;
};

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { student_id, password } = req.body || {};
  if (!student_id || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' });
  }

  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(student_id);
  if (student && bcrypt.compareSync(password, student.password)) {
    return res.json({ success: true, student: publicStudent(student) });
  }

  // Demo mode (same behaviour as the original project): any login works
  if (DEMO_MODE) {
    const demo = db.prepare('SELECT * FROM students WHERE id = ?').get('CSE001');
    return res.json({
      success: true,
      student: publicStudent(demo),
      note: 'Demo mode auto-fallback to Rahul Sharma',
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid Credentials' });
});

export default router;
