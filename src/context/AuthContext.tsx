import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthUser, Team, TeamMember } from '@/types';
import {
  ADMIN_CREDENTIALS,
  STORAGE_KEYS,
  loadTeams,
  saveTeams,
  loadUser,
  saveUser,
  clearUser,
  findTeamByEmail,
  uid,
} from '@/utils';
import { seedTeams } from '@/data/seed';

interface AuthContextValue {
  user: AuthUser | null;
  teams: Team[];
  loginStudent: (email: string, password: string) => { ok: boolean; message: string };
  loginAdmin: (email: string, password: string) => { ok: boolean; message: string };
  registerTeam: (data: Omit<Team, 'id' | 'pdfName' | 'submissionStatus' | 'submissionDate' | 'createdAt' | 'membersComplete' | 'selectedProjectId'>) => {
    ok: boolean;
    message: string;
    team?: Team;
  };
  registerMemberToTeam: (teamId: string, member: TeamMember) => void;
  updateTeamMembers: (teamId: string, members: Team['members']) => void;
  selectProject: (teamId: string, projectId: string) => void;
  uploadPdf: (fileName: string) => void;
  logout: () => void;
  deleteTeam: (teamId: string) => void;
  refreshTeams: () => void;
  resetToSeedData: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadUser<AuthUser>());
  const [teams, setTeams] = useState<Team[]>(() => {
    const existing = loadTeams();
    // Check if existing data has the old structure (members without department/year)
    const hasOldStructure = existing.some(team => 
      team.members.some(member => !member.department || !member.year)
    );
    
    if (existing.length > 0 && !hasOldStructure) {
      console.log('🔍 Debug: Using existing teams from localStorage');
      return existing;
    }
    
    console.log('🔍 Debug: Loading fresh seed data');
    const seeded = seedTeams();
    saveTeams(seeded);
    return seeded;
  });

  useEffect(() => {
    saveTeams(teams);
  }, [teams]);

  const loginStudent: AuthContextValue['loginStudent'] = (email, password) => {
    console.log('🔍 Debug: Attempting login for:', email);
    console.log('🔍 Debug: Available teams:', teams.length);
    console.log('🔍 Debug: Teams data:', teams.map(t => ({ 
      id: t.id, 
      name: t.teamName, 
      leaderEmail: t.leaderEmail,
      memberEmails: t.members.map(m => m.email)
    })));
    
    const found = findTeamByEmail(teams, email);
    console.log('🔍 Debug: findTeamByEmail result:', found);
    
    if (!found) return { ok: false, message: 'No account found with that email.' };
    if (found.team.password !== password)
      return { ok: false, message: 'Incorrect password. Please try again.' };
    const authUser: AuthUser = {
      role: 'student',
      email: email.trim().toLowerCase(),
      name: found.isLeader ? found.team.leaderName : found.team.members.find((m) => m.email.toLowerCase() === email.trim().toLowerCase())?.name ?? 'Team Member',
      teamId: found.team.id,
      isLeader: found.isLeader,
    };
    console.log('🔍 Debug: Created authUser:', authUser);
    setUser(authUser);
    saveUser(authUser);
    return { ok: true, message: 'Login successful!' };
  };

  const loginAdmin: AuthContextValue['loginAdmin'] = (email, password) => {
    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const authUser: AuthUser = {
        role: 'admin',
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        isLeader: false,
      };
      setUser(authUser);
      saveUser(authUser);
      return { ok: true, message: 'Welcome back, Admin!' };
    }
    return { ok: false, message: 'Invalid admin credentials.' };
  };

  const registerTeam: AuthContextValue['registerTeam'] = (data) => {
    const exists = teams.some(
      (t) => t.teamName.trim().toLowerCase() === data.teamName.trim().toLowerCase(),
    );
    if (exists) return { ok: false, message: 'A team with this name already exists.' };

    const team: Team = {
      ...data,
      id: uid('team'),
      pdfName: null,
      membersComplete: false,
      submissionStatus: 'not_started',
      submissionDate: null,
      createdAt: new Date().toISOString(),
    };
    setTeams((prev) => [team, ...prev]);
    return { ok: true, message: 'Team registered successfully!', team };
  };

  const updateTeamMembers: AuthContextValue['updateTeamMembers'] = (teamId, members) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId ? { ...t, members, membersComplete: true } : t,
      ),
    );
  };

  const selectProject: AuthContextValue['selectProject'] = (teamId, projectId) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId ? { ...t, selectedProjectId: projectId } : t,
      ),
    );
  };

  const registerMemberToTeam: AuthContextValue['registerMemberToTeam'] = (teamId, member) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, members: [...t.members, member] }
          : t,
      ),
    );
  };

  const uploadPdf: AuthContextValue['uploadPdf'] = (fileName) => {
    if (!user || user.role !== 'student' || !user.teamId) return;
    setTeams((prev) =>
      prev.map((t) =>
        t.id === user.teamId
          ? {
              ...t,
              pdfName: fileName,
              submissionStatus: 'submitted',
              submissionDate: new Date().toISOString(),
            }
          : t,
      ),
    );
  };

  const deleteTeam: AuthContextValue['deleteTeam'] = (teamId) => {
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
  };

  const logout = () => {
    setUser(null);
    clearUser();
  };

  const refreshTeams = () => setTeams(loadTeams());

  // Debug function to clear localStorage and reset to seed data
  const resetToSeedData = () => {
    localStorage.removeItem(STORAGE_KEYS.teams);
    localStorage.removeItem(STORAGE_KEYS.user);
    const seeded = seedTeams();
    setTeams(seeded);
    saveTeams(seeded);
    setUser(null);
    console.log('🔄 Reset to seed data complete');
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, teams, loginStudent, loginAdmin, registerTeam, registerMemberToTeam, updateTeamMembers, selectProject, uploadPdf, logout, deleteTeam, refreshTeams, resetToSeedData }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, teams],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
