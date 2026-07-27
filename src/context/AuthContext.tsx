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
import { supabase } from '@/config/supabase';
import { createTeam, getTeamsByLeader, updateTeam } from '@/services/supabase/teams.service';
import { addTeamMember, getTeamMembers } from '@/services/supabase/members.service';
import { logActivity } from '@/services/supabase/logging.service';

// Logger utility for debugging
const logger = {
  info: (msg: string, data?: any) => {
    console.log(`✅ [AuthContext] ${msg}`, data || '');
  },
  error: (msg: string, err?: any) => {
    console.error(`❌ [AuthContext] ${msg}`, err || '');
    // Also log to Supabase for persistence
    logActivity({
      action: 'auth_context_error',
      error_message: `${msg}: ${err instanceof Error ? err.message : String(err)}`,
      details: { error: err },
    }).catch(() => {
      // Silent fail if logging service is not available
    });
  },
  debug: (msg: string, data?: any) => {
    console.log(`🔍 [AuthContext] ${msg}`, data || '');
  },
};

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
    try {
      logger.info('registerTeam called with data:', data);
      
      const exists = teams.some(
        (t) => t.teamName.trim().toLowerCase() === data.teamName.trim().toLowerCase(),
      );
      if (exists) {
        const msg = 'A team with this name already exists.';
        logger.error('Team name already exists:', data.teamName);
        return { ok: false, message: msg };
      }

      // Log activity
      logger.info('Attempting to register team:', data.teamName);

      // Create a local team object for immediate UI feedback
      const localTeam: Team = {
        ...data,
        id: uid('team'),
        pdfName: null,
        membersComplete: false,
        submissionStatus: 'not_started',
        submissionDate: null,
        createdAt: new Date().toISOString(),
      };

      logger.info('Created localTeam object:', localTeam.id);

      // Update local state immediately
      setTeams((prev) => [localTeam, ...prev]);
      logger.info('Team added to local state:', localTeam.id);

      // Also try to save to Supabase (fire-and-forget for now)
      // This ensures data is persisted even if there are delays
      const supabaseTeam = {
        id: localTeam.id,
        teamName: localTeam.teamName,
        leaderName: localTeam.leaderName,
        leaderEmail: localTeam.leaderEmail,
        password: localTeam.password,
        college: localTeam.college,
        department: localTeam.department,
        year: String(localTeam.year),
        mobile: localTeam.mobile || '',
        members: JSON.stringify(localTeam.members || []),
        membersComplete: localTeam.membersComplete,
        pdfName: localTeam.pdfName,
        submissionStatus: localTeam.submissionStatus,
        submissionDate: localTeam.submissionDate,
        createdAt: localTeam.createdAt,
      };

      logger.info('Attempting Supabase insert...');
      logger.debug('Supabase team object:', supabaseTeam);
      supabase
        .from('teams')
        .insert([supabaseTeam])
        .then(({ data, error }) => {
          if (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            logger.error('❌ Failed to save team to Supabase:', errorMsg);
            logger.error('Full error details:', error);
            logger.debug('Attempted to insert:', supabaseTeam);
            // Log to activity_logs for debugging
            supabase.from('activity_logs').insert([{
              id: uid('log'),
              action: 'team_registration_error',
              description: `Failed to register team ${localTeam.teamName}: ${errorMsg}`,
              metadata: { teamId: localTeam.id, error: errorMsg },
            }]);
          } else {
            logger.info('✅ Team successfully saved to Supabase:', localTeam.id, data);
            // Log successful registration
            supabase.from('activity_logs').insert([{
              id: uid('log'),
              action: 'team_registered',
              description: `Team ${localTeam.teamName} registered`,
              metadata: { teamId: localTeam.id, teamName: localTeam.teamName },
            }]);
          }
        })
        .catch((err) => {
          const errorMsg = err instanceof Error ? err.message : String(err);
          logger.error('Supabase connection error:', errorMsg);
        });

      logger.info('Returning success response');
      return { ok: true, message: 'Team registered successfully!', team: localTeam };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error('registerTeam error:', message);
      return { ok: false, message };
    }
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
    try {
      logger.info('Attempting to add member to team:', { teamId, memberEmail: member.email });
      
      // Update local state immediately
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId
            ? { ...t, members: [...t.members, member] }
            : t,
        ),
      );
      logger.info('Member added to local state:', member.email);

      // Verify team exists in Supabase before adding member
      supabase
        .from('teams')
        .select('id')
        .eq('id', teamId)
        .single()
        .then(({ data, error: selectError }) => {
          if (selectError || !data) {
            logger.error('Team not found in Supabase, cannot add member:', teamId);
            return;
          }

          // Team exists, now insert member (fire-and-forget)
          supabase
            .from('team_members')
            .insert([{
              id: uid('member'),
              team_id: teamId,
              name: member.name,
              email: member.email,
              department: member.department,
              year: String(member.year),
            }])
            .then(({ error }) => {
              if (error) {
                logger.error('Failed to save member to Supabase:', error);
                supabase.from('activity_logs').insert([{
                  id: uid('log'),
                  action: 'member_registration_error',
                  description: `Failed to add member ${member.email} to team ${teamId}`,
                  metadata: { teamId, memberEmail: member.email, error: error.message },
                }]);
              } else {
                logger.info('✅ Member successfully saved to Supabase:', member.email);
                supabase.from('activity_logs').insert([{
                  id: uid('log'),
                  action: 'member_added',
                  description: `Member ${member.email} added to team`,
                  metadata: { teamId, memberEmail: member.email },
                }]);
              }
            })
            .catch((err) => {
              logger.error('Supabase connection error:', err);
            });
        })
        .catch((err) => {
          logger.error('Failed to verify team existence:', err);
        });
    } catch (error) {
      logger.error('registerMemberToTeam error:', error);
    }
  };

  const uploadPdf: AuthContextValue['uploadPdf'] = (fileName) => {
    if (!user || user.role !== 'student' || !user.teamId) return;
    
    try {
      logger.info('Attempting to upload PDF:', { fileName, teamId: user.teamId });
      
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
      logger.info('PDF upload updated locally:', fileName);

      // Log to Supabase
      supabase
        .from('activity_logs')
        .insert([{
          id: uid('log'),
          action: 'pdf_uploaded',
          description: `PDF submitted: ${fileName}`,
          metadata: { fileName, teamId: user.teamId },
        }])
        .then(({ error }) => {
          if (error) {
            logger.error('Failed to log PDF upload:', error);
          } else {
            logger.info('✅ PDF upload logged to Supabase');
          }
        });
    } catch (error) {
      logger.error('uploadPdf error:', error);
    }
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
