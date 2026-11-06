import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DB_FILE = process.env.DB_FILE
  ? path.resolve(process.env.DB_FILE)
  : path.join(__dirname, '..', 'data', 'campus_portal.db');

fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

export const db = new Database(DB_FILE);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      dept TEXT NOT NULL,
      year TEXT NOT NULL,
      section TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      venue TEXT NOT NULL,
      "desc" TEXT NOT NULL,
      participants_count INTEGER DEFAULT 0,
      tag TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS participation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      event_name TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL,
      achievement TEXT,
      has_cert INTEGER DEFAULT 0,
      FOREIGN KEY (student_id) REFERENCES students(id)
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      "desc" TEXT NOT NULL,
      tech TEXT NOT NULL,   -- comma-separated
      team TEXT NOT NULL,   -- comma-separated
      guide TEXT NOT NULL,
      dept TEXT NOT NULL,
      year TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      event_name TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id)
    );
  `);
}

function seed() {
  const hash = bcrypt.hashSync('password', 10);

  const insertStudent = db.prepare(
    'INSERT INTO students (id, name, dept, year, section, email, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const insertEvent = db.prepare(
    'INSERT INTO events (name, date, venue, "desc", participants_count, tag) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertPart = db.prepare(
    'INSERT INTO participation (student_id, event_name, type, date, role, status, achievement, has_cert) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const insertProject = db.prepare(
    'INSERT INTO projects (title, "desc", tech, team, guide, dept, year, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const insertCert = db.prepare(
    'INSERT INTO certificates (id, student_id, event_name, title, date) VALUES (?, ?, ?, ?, ?)'
  );

  const run = db.transaction(() => {
    // Main demo student
    insertStudent.run('CSE001', 'Rahul Sharma', 'Computer Science & Engineering', '3rd Year', 'A', 'rahul.sharma@meridian.edu', '+91 98765 43210', hash);

    // Other students that appear on the Participants page
    const others = [
      ['CSE014', 'Ananya Rao', 'CSE', '3rd Year'],
      ['ECE022', 'Kiran Patel', 'ECE', '2nd Year'],
      ['CSE031', 'Divya Menon', 'CSE', '3rd Year'],
      ['MEC009', 'Sameer Khan', 'Mechanical', '1st Year'],
      ['CSE045', 'Priya Nambiar', 'CSE', '3rd Year'],
      ['IT012', 'Arjun Bose', 'IT', '3rd Year'],
      ['BBA004', 'Neha Joshi', 'Management', '2nd Year'],
      ['CSE056', 'Rohan Desai', 'CSE', '1st Year'],
    ];
    for (const [id, name, dept, year] of others) {
      const email = name.toLowerCase().replace(/\s+/g, '.') + '@meridian.edu';
      insertStudent.run(id, name, dept, year, 'A', email, '+91 90000 00000', hash);
    }

    const events = [
      ['AI & Machine Learning Workshop', '22 Aug 2026', 'Seminar Hall B', 'Hands-on session covering ML fundamentals and real-world applications.', 120, 'Workshop'],
      ['National Level Hackathon 2026', '05 Sep 2026', 'Innovation Lab', '48-hour hackathon to build solutions for real campus problems.', 86, 'Hackathon'],
      ['Inter-College Coding Championship', '14 Sep 2026', 'Computer Lab 3', 'Competitive programming contest open to all departments.', 64, 'Competition'],
      ['Cultural Fest \u2014 Tarang 2026', '28 Sep 2026', 'Main Auditorium', 'Annual cultural festival with music, dance and drama competitions.', 340, 'Fest'],
    ];
    events.forEach((e) => insertEvent.run(...e));

    const participation = [
      ['CSE001', 'Hackathon 2026', 'Hackathon', '15 Aug 2026', 'Team Member', 'Completed', '2nd Place', 1],
      ['CSE001', 'AI Workshop 2026', 'Workshop', '02 Jul 2026', 'Attendee', 'Completed', null, 1],
      ['CSE001', 'Inter-College Coding Championship', 'Competition', '20 Jun 2026', 'Participant', 'Completed', 'Finalist', 1],
      ['CSE001', 'National Hackathon 2026', 'Hackathon', '05 Sep 2026', 'Team Lead', 'Upcoming', null, 0],
      // Roster entries shown on the Participants page
      ['CSE014', 'AI & Machine Learning Workshop', 'Workshop', '22 Aug 2026', 'Attendee', 'Completed', null, 0],
      ['ECE022', 'AI & Machine Learning Workshop', 'Workshop', '22 Aug 2026', 'Attendee', 'Completed', null, 0],
      ['CSE031', 'AI & Machine Learning Workshop', 'Workshop', '22 Aug 2026', 'Attendee', 'Completed', null, 0],
      ['MEC009', 'AI & Machine Learning Workshop', 'Workshop', '22 Aug 2026', 'Attendee', 'No-show', null, 0],
      ['CSE045', 'National Level Hackathon 2026', 'Hackathon', '05 Sep 2026', 'Team Member', 'Completed', null, 0],
      ['IT012', 'National Level Hackathon 2026', 'Hackathon', '05 Sep 2026', 'Team Member', 'Completed', null, 0],
      ['BBA004', 'Cultural Fest \u2014 Tarang 2026', 'Fest', '28 Sep 2026', 'Participant', 'Registered', null, 0],
      ['CSE056', 'Cultural Fest \u2014 Tarang 2026', 'Fest', '28 Sep 2026', 'Participant', 'Registered', null, 0],
    ];
    participation.forEach((p) => insertPart.run(...p));

    const projects = [
      ['Smart Attendance System', 'Face-recognition based automated attendance tracking for classrooms.', 'React,Node.js,MongoDB', 'Rahul Sharma,Ananya Rao,Kiran Patel', 'Dr. Meera Nair', 'CSE', '2026', 'Completed'],
      ['Campus Energy Monitor', 'IoT dashboard tracking real-time power usage across campus buildings.', 'Python,React,MQTT', 'Rahul Sharma,Divya Menon', 'Prof. Arjun Verma', 'CSE', '2025', 'Completed'],
      ['Campus Marketplace App', 'Peer-to-peer marketplace for students to trade used books and gadgets.', 'Flutter,Firebase', 'Rahul Sharma,Team 4', 'Dr. Sana Iqbal', 'CSE', '2026', 'In Progress'],
    ];
    projects.forEach((p) => insertProject.run(...p));

    const certs = [
      ['CERT-CSE001-2026-014', 'CSE001', 'Hackathon 2026', '2nd Place \u00b7 Team Achievement', '18 Aug 2026'],
      ['CERT-CSE001-2026-009', 'CSE001', 'AI Workshop 2026', 'Certificate of Participation', '03 Jul 2026'],
      ['CERT-CSE001-2026-006', 'CSE001', 'Coding Championship', 'Certificate of Excellence \u00b7 Finalist', '22 Jun 2026'],
    ];
    certs.forEach((c) => insertCert.run(...c));
  });

  run();
}

export function initDb() {
  createTables();
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM students').get();
  if (n === 0) seed();
}
