export const initialsOf = (name) =>
  name.split(' ').map((n) => n[0]).join('').substring(0, 2);

export const isMember = (project, student) =>
  project.team.some((m) => m.toLowerCase().includes(student.name.toLowerCase()));

export const scrollToEvents = () =>
  document.getElementById('events-anchor')?.scrollIntoView({ behavior: 'smooth' });

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function buildTranscript(student, participation, projects, certs) {
  const line = '='.repeat(50);
  const dash = '-'.repeat(50);
  let r = `${line}\n          MERIDIAN COLLEGE STUDENT LEDGER\n${line}\n\n`;
  r += `STUDENT DETAILS:\n`;
  r += `Name:       ${student.name}\n`;
  r += `ID:         ${student.id}\n`;
  r += `Department: ${student.dept}\n`;
  r += `Academic:   ${student.year} (Section ${student.section})\n`;
  r += `Email:      ${student.email}\n`;
  r += `Phone:      ${student.phone}\n\n`;

  r += `${dash}\nPARTICIPATION RECORDS (${participation.length}):\n${dash}\n`;
  participation.forEach((p, i) => {
    r += `${i + 1}. Event: ${p.event_name}\n`;
    r += `   Type:  ${p.type} | Role: ${p.role}\n`;
    r += `   Date:  ${p.date} | Status: ${p.status}\n`;
    if (p.achievement) r += `   Award: ${p.achievement}\n`;
    r += `\n`;
  });

  r += `${dash}\nPROJECTS WORKSPACE (${projects.length}):\n${dash}\n`;
  projects.forEach((p, i) => {
    r += `${i + 1}. Title: ${p.title} (${p.status})\n`;
    r += `   Desc:  ${p.desc}\n`;
    r += `   Guide: ${p.guide}\n`;
    r += `   Team:  ${p.team.join(', ')}\n`;
    r += `   Tech:  ${p.tech.join(', ')}\n`;
    r += `\n`;
  });

  r += `${dash}\nVERIFIED CERTIFICATES (${certs.length}):\n${dash}\n`;
  certs.forEach((c, i) => {
    r += `${i + 1}. Title: ${c.title}\n`;
    r += `   Event: ${c.event_name}\n`;
    r += `   ID:    ${c.id} | Date: ${c.date}\n`;
    r += `\n`;
  });

  r += `${line}\n`;
  r += `Generated automatically on ${new Date().toLocaleDateString()}\n`;
  r += `Verification Key Registry online: ${window.location.origin}/\n`;
  r += `${line}\n`;
  return r;
}
