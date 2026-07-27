/**
 * Supabase Teams Service
 * Handles team operations (create, read, update, delete)
 *
 * @module services/supabase/teams.service
 */

import { supabase } from '@/config/supabase';
import type { Team, TeamMember, SubmissionStatus } from '@/types';

/**
 * Postgres folds unquoted identifiers to lowercase, so live columns are often
 * `teamname` / `leaderemail` even when SQL was written as camelCase.
 * Accept both shapes when reading.
 */
export function normalizeTeam(row: Record<string, any>): Team {
  const membersRaw = row.members ?? '[]';
  let members: TeamMember[] = [];
  if (typeof membersRaw === 'string') {
    try {
      const parsed = JSON.parse(membersRaw);
      members = Array.isArray(parsed) ? parsed : [];
    } catch {
      members = [];
    }
  } else if (Array.isArray(membersRaw)) {
    members = membersRaw;
  }

  const status = (row.submissionStatus ?? row.submissionstatus ?? 'not_started') as SubmissionStatus;

  return {
    id: String(row.id),
    teamName: row.teamName ?? row.teamname ?? '',
    leaderName: row.leaderName ?? row.leadername ?? '',
    leaderEmail: row.leaderEmail ?? row.leaderemail ?? '',
    password: row.password ?? '',
    college: row.college ?? '',
    department: row.department ?? '',
    year: String(row.year ?? ''),
    mobile: row.mobile ?? '',
    members,
    membersComplete: Boolean(row.membersComplete ?? row.memberscomplete ?? false),
    selectedProjectId: row.selectedProjectId ?? row.selectedprojectid ?? undefined,
    pdfName: row.pdfName ?? row.pdfname ?? null,
    submissionStatus: status,
    submissionDate: row.submissionDate ?? row.submissiondate ?? null,
    createdAt: row.createdAt ?? row.createdat ?? new Date().toISOString(),
  };
}

/** Payload matching the app's camelCase schema (quoted columns). */
function toCamelPayload(team: Team): Record<string, unknown> {
  return {
    id: team.id,
    teamName: team.teamName,
    leaderName: team.leaderName,
    leaderEmail: team.leaderEmail,
    password: team.password,
    college: team.college,
    department: team.department,
    year: String(team.year),
    mobile: team.mobile || '',
    members: team.members || [],
    membersComplete: Boolean(team.membersComplete),
    pdfName: team.pdfName,
    submissionStatus: team.submissionStatus,
    submissionDate: team.submissionDate,
    selectedProjectId: team.selectedProjectId ?? null,
    createdAt: team.createdAt,
  };
}

/** Payload for DBs where unquoted camelCase became lowercase. */
function toLowerPayload(team: Team): Record<string, unknown> {
  return {
    id: team.id,
    teamname: team.teamName,
    leadername: team.leaderName,
    leaderemail: team.leaderEmail,
    password: team.password,
    college: team.college,
    department: team.department,
    year: String(team.year),
    mobile: team.mobile || '',
    members: team.members || [],
    memberscomplete: Boolean(team.membersComplete),
    pdfname: team.pdfName,
    submissionstatus: team.submissionStatus,
    submissiondate: team.submissionDate,
    selectedprojectid: team.selectedProjectId ?? null,
    createdat: team.createdAt,
  };
}

/**
 * Create a new team (tries camelCase then lowercase column names).
 */
export async function createTeam(input: Team): Promise<{ team: Team | null; error: string | null }> {
  try {
    const camel = toCamelPayload(input);
    let { data, error } = await supabase.from('teams').insert([camel]).select().single();

    // Retry without password if column is missing from older schemas
    if (error && /password/i.test(error.message)) {
      const { password: _pw, ...withoutPassword } = camel;
      ({ data, error } = await supabase.from('teams').insert([withoutPassword]).select().single());
    }

    // Retry with lowercase keys (unquoted Postgres identifiers)
    if (error && /column|schema cache|Could not find/i.test(error.message)) {
      const lower = toLowerPayload(input);
      ({ data, error } = await supabase.from('teams').insert([lower]).select().single());

      if (error && /password/i.test(error.message)) {
        const { password: _pw, ...withoutPassword } = lower;
        ({ data, error } = await supabase.from('teams').insert([withoutPassword]).select().single());
      }
    }

    if (error) {
      return { team: null, error: error.message };
    }

    return { team: data ? normalizeTeam(data) : input, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create team';
    return { team: null, error: message };
  }
}

/**
 * Get team by ID
 */
export async function getTeamById(teamId: string): Promise<{ team: Team | null; error: string | null }> {
  try {
    const { data, error } = await supabase.from('teams').select('*').eq('id', teamId).single();

    if (error) {
      return { team: null, error: error.message };
    }

    return { team: data ? normalizeTeam(data) : null, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team';
    return { team: null, error: message };
  }
}

/**
 * Get teams by leader email
 */
export async function getTeamsByLeader(
  leaderEmail: string
): Promise<{ teams: Team[] | null; error: string | null }> {
  try {
    let { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('leaderEmail', leaderEmail);

    if (error && /column|schema cache|Could not find/i.test(error.message)) {
      ({ data, error } = await supabase.from('teams').select('*').eq('leaderemail', leaderEmail));
    }

    if (error) {
      return { teams: null, error: error.message };
    }

    return { teams: (data || []).map(normalizeTeam), error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch teams';
    return { teams: null, error: message };
  }
}

/**
 * Get all teams (admin source of truth)
 */
export async function getAllTeams(): Promise<{ teams: Team[] | null; error: string | null }> {
  try {
    let { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error && /column|schema cache|Could not find/i.test(error.message)) {
      ({ data, error } = await supabase
        .from('teams')
        .select('*')
        .order('createdat', { ascending: false }));
    }

    // Fall back to unordered select if order column is missing
    if (error) {
      ({ data, error } = await supabase.from('teams').select('*'));
    }

    if (error) {
      return { teams: null, error: error.message };
    }

    const teams = (data || []).map(normalizeTeam);
    teams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { teams, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch teams';
    return { teams: null, error: message };
  }
}

/**
 * Update team
 */
export async function updateTeam(
  teamId: string,
  updates: Partial<Team>
): Promise<{ team: Team | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', teamId)
      .select()
      .single();

    if (error) {
      return { team: null, error: error.message };
    }

    return { team: data ? normalizeTeam(data) : null, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update team';
    return { team: null, error: message };
  }
}

/**
 * Delete team
 */
export async function deleteTeam(teamId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('teams').delete().eq('id', teamId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete team';
    return { error: message };
  }
}

/**
 * Update team project selection
 */
export async function selectProject(
  teamId: string,
  projectId: string,
  _projectTitle: string,
  _abstract: string
): Promise<{ team: Team | null; error: string | null }> {
  try {
    let { data, error } = await supabase
      .from('teams')
      .update({
        selectedProjectId: projectId,
        submissionStatus: 'submitted',
      })
      .eq('id', teamId)
      .select()
      .single();

    if (error && /column|schema cache|Could not find/i.test(error.message)) {
      ({ data, error } = await supabase
        .from('teams')
        .update({
          selectedprojectid: projectId,
          submissionstatus: 'submitted',
        })
        .eq('id', teamId)
        .select()
        .single());
    }

    if (error) {
      return { team: null, error: error.message };
    }

    return { team: data ? normalizeTeam(data) : null, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to select project';
    return { team: null, error: message };
  }
}

/**
 * Get team stats
 */
export async function getTeamStats(): Promise<{
  totalTeams: number;
  activeTeams: number;
  submittedTeams: number;
  error: string | null;
}> {
  try {
    const { teams, error } = await getAllTeams();

    if (error || !teams) {
      return { totalTeams: 0, activeTeams: 0, submittedTeams: 0, error: error };
    }

    const submitted = teams.filter((t) => t.submissionStatus === 'submitted').length;

    return {
      totalTeams: teams.length,
      activeTeams: teams.length - submitted,
      submittedTeams: submitted,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team stats';
    return { totalTeams: 0, activeTeams: 0, submittedTeams: 0, error: message };
  }
}
