import type { TeamMember, Team, SubmissionStatus } from '@/types';

export const STORAGE_KEYS = {
  teams: 'sh_teams',
  user: 'sh_user',
  theme: 'sh_theme',
  notifications: 'sh_notifications_enabled',
} as const;

export const MAX_TEAM_MEMBERS = 4;

export const ADMIN_CREDENTIALS = {
  email: 'admin@smarthackathon.com',
  password: 'admin123',
  name: 'Admin',
} as const;

export const ADMIN_USER = {
  role: 'admin' as const,
  email: 'admin@smarthackathon.com',
  name: 'Administrator',
};

export const DEPARTMENTS = [
  // B.Tech / B.E. — Core Engineering
  'B.E. / B.Tech - Aeronautical Engineering',
  'B.E. / B.Tech - Automobile Engineering',
  'B.E. / B.Tech - Biomedical Engineering',
  'B.E. / B.Tech - Biotechnology',
  'B.E. / B.Tech - Chemical Engineering',
  'B.E. / B.Tech - Civil Engineering',
  'B.E. / B.Tech - Computer Science and Engineering',
  'B.E. / B.Tech - Computer Science and Engineering (AI & ML)',
  'B.E. / B.Tech - Computer Science and Engineering (Cyber Security)',
  'B.E. / B.Tech - Computer Science and Engineering (Data Science)',
  'B.E. / B.Tech - Computer Science and Engineering (IoT)',
  'B.E. / B.Tech - Electrical and Electronics Engineering',
  'B.E. / B.Tech - Electronics and Communication Engineering',
  'B.E. / B.Tech - Electronics and Instrumentation Engineering',
  'B.E. / B.Tech - Information Technology',
  'B.E. / B.Tech - Mechanical Engineering',
  'B.E. / B.Tech - Mechatronics Engineering',
  'B.E. / B.Tech - Mining Engineering',
  'B.E. / B.Tech - Naval Architecture and Offshore Engineering',
  'B.E. / B.Tech - Petroleum Engineering',
  'B.E. / B.Tech - Production Engineering',
  'B.E. / B.Tech - Robotics and Automation',
  'B.E. / B.Tech - Textile Technology',
  // Allied & Emerging
  'B.E. / B.Tech - Agricultural Engineering',
  'B.E. / B.Tech - Artificial Intelligence and Data Science',
  'B.E. / B.Tech - Fashion Technology',
  'B.E. / B.Tech - Food Technology',
  'B.E. / B.Tech - Industrial Engineering',
  'B.E. / B.Tech - Leather Technology',
  'B.E. / B.Tech - Medical Electronics',
  'B.E. / B.Tech - Polymer Technology',
  'B.E. / B.Tech - Printing Technology',
  // Other
  'Other',
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year'];

// Validation helpers ----------------------------------------------------

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidMobile(mobile: string): boolean {
  return /^[0-9]{10}$/.test(mobile.trim());
}

export function passwordStrength(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score] };
}

// Storage helpers -------------------------------------------------------

export function loadTeams(): Team[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.teams);
    return raw ? (JSON.parse(raw) as Team[]) : [];
  } catch {
    return [];
  }
}

export function saveTeams(teams: Team[]): void {
  localStorage.setItem(STORAGE_KEYS.teams, JSON.stringify(teams));
}

export function loadUser<T>(): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: unknown): void {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEYS.user);
}

export function loadTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(STORAGE_KEYS.theme);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function saveTheme(mode: 'light' | 'dark'): void {
  localStorage.setItem(STORAGE_KEYS.theme, mode);
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

// Domain helpers --------------------------------------------------------

export function findTeamByEmail(teams: Team[], email: string): { team: Team; isLeader: boolean } | null {
  const e = email.trim().toLowerCase();
  const team = teams.find((t) => t.leaderEmail.toLowerCase() === e);
  if (team) return { team, isLeader: true };
  const asMember = teams.find((t) => t.members.some((m) => m.email.toLowerCase() === e));
  if (asMember) return { team: asMember, isLeader: false };
  return null;
}

export function isDuplicateEmail(teams: Team[], email: string, excludeTeamId?: string): boolean {
  const e = email.trim().toLowerCase();
  return teams.some(
    (t) =>
      t.id !== excludeTeamId &&
      (t.leaderEmail.toLowerCase() === e ||
        t.members.some((m) => m.email.toLowerCase() === e)),
  );
}

export function teamMemberCount(team: Team): number {
  return 1 + team.members.length;
}

export function statusLabel(status: SubmissionStatus): string {
  switch (status) {
    case 'submitted':
      return 'Submitted';
    case 'in_progress':
      return 'In Progress';
    default:
      return 'Not Started';
  }
}

export function teamProgress(team: Team): number {
  if (team.submissionStatus === 'submitted') return 100;
  if (team.submissionStatus === 'in_progress') return 60;
  if (team.members.length > 0) return 35;
  return 20;
}

export function emptyMember(): TeamMember {
  return { name: '', email: '', department: '', year: '' };
}
