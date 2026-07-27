/**
 * Supabase Teams Service
 * Handles team operations (create, read, update, delete)
 * 
 * @module services/supabase/teams.service
 */

import { supabase } from '@/config/supabase';

/**
 * Create a new team
 */
export async function createTeam(input: any): Promise<{ team: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert([input])
      .select()
      .single();

    if (error) {
      return { team: null, error: error.message };
    }

    return { team: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create team';
    return { team: null, error: message };
  }
}

/**
 * Get team by ID
 */
export async function getTeamById(teamId: string): Promise<{ team: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select()
      .eq('id', teamId)
      .single();

    if (error) {
      return { team: null, error: error.message };
    }

    return { team: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team';
    return { team: null, error: message };
  }
}

/**
 * Get teams by leader ID
 */
export async function getTeamsByLeader(
  leaderEmail: string
): Promise<{ teams: any[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select()
      .eq('leaderEmail', leaderEmail);

    if (error) {
      return { teams: null, error: error.message };
    }

    return { teams: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch teams';
    return { teams: null, error: message };
  }
}

/**
 * Get all teams
 */
export async function getAllTeams(): Promise<{ teams: any[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select()
      .order('createdAt', { ascending: false });

    if (error) {
      return { teams: null, error: error.message };
    }

    return { teams: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch teams';
    return { teams: null, error: message };
  }
}

/**
 * Update team
 */
export async function updateTeam(teamId: string, updates: any): Promise<{ team: any | null; error: string | null }> {
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

    return { team: data, error: null };
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
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

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
  projectTitle: string,
  abstract: string
): Promise<{ team: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .update({
  selectedProjectId: projectId,
  submissionStatus: 'submitted',
})
      .eq('id', teamId)
      .select()
      .single();

    if (error) {
      return { team: null, error: error.message };
    }

    return { team: data, error: null };
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
    const { data, error } = await supabase
      .from('teams')
      .select('submissionStatus', { count: 'exact' });

    if (error) {
      return { totalTeams: 0, activeTeams: 0, submittedTeams: 0, error: error.message };
    }

    const submitted =
  data?.filter((t: any) => t.submissionStatus === 'submitted').length || 0;
    const total = data?.length || 0;

    return {
      totalTeams: total,
      activeTeams: total - submitted,
      submittedTeams: submitted,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team stats';
    return { totalTeams: 0, activeTeams: 0, submittedTeams: 0, error: message };
  }
}
