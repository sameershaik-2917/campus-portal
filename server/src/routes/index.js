import { Router } from 'express';
import auth from './auth.js';
import stats from './stats.js';
import events from './events.js';
import participation from './participation.js';
import projects from './projects.js';
import { certificatesRouter, verifyRouter } from './certificates.js';
import participants from './participants.js';

const api = Router();

api.get('/health', (req, res) => res.json({ ok: true }));
api.use('/auth', auth);
api.use('/stats', stats);
api.use('/events', events);
api.use('/participation', participation);
api.use('/projects', projects);
api.use('/certificates', certificatesRouter);
api.use('/verify', verifyRouter);
api.use('/participants', participants);

export default api;
