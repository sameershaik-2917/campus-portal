import { Router } from 'express';
import { db } from '../db.js';

export const certificatesRouter = Router();
export const verifyRouter = Router();

// GET /api/certificates?student_id=CSE001
certificatesRouter.get('/', (req, res) => {
  const id = req.query.student_id || 'CSE001';
  res.json(db.prepare('SELECT * FROM certificates WHERE student_id = ?').all(id));
});

// GET /api/verify?id=CERT-CSE001-2026-014
verifyRouter.get('/', (req, res) => {
  const certId = String(req.query.id || '').trim();
  if (!certId) {
    return res.json({ verified: false, message: 'Missing certificate ID' });
  }

  const cert = db
    .prepare(
      `SELECT c.*, s.name AS student_name
       FROM certificates c
       JOIN students s ON c.student_id = s.id
       WHERE c.id = ?`
    )
    .get(certId);

  if (!cert) {
    return res.json({ verified: false, message: 'Certificate not found' });
  }

  res.json({
    verified: true,
    id: cert.id,
    student_name: cert.student_name,
    event_name: cert.event_name,
    title: cert.title,
    date: cert.date,
  });
});
