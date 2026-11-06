// All calls to the Express backend live here.
// In dev, Vite proxies /api to http://localhost:5000 (see vite.config.js).
const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  return res.json();
}

const post = (path, body) =>
  request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const login = (student_id, password) => post('/auth/login', { student_id, password });
export const getEvents = () => request('/events');
export const registerEvent = (student_id, event_name, tag) =>
  post('/events/register', { student_id, event_name, tag });
export const getStats = (studentId) => request(`/stats?student_id=${encodeURIComponent(studentId)}`);
export const getParticipation = (studentId) =>
  request(`/participation?student_id=${encodeURIComponent(studentId)}`);
export const getProjects = () => request('/projects');
export const addProject = (project) => post('/projects', project);
export const getCertificates = (studentId) =>
  request(`/certificates?student_id=${encodeURIComponent(studentId)}`);
export const verifyCertificate = (id) => request(`/verify?id=${encodeURIComponent(id)}`);
export const getParticipants = (eventName) =>
  request(`/participants?event_name=${encodeURIComponent(eventName)}`);
