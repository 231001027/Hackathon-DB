/**
 * Supabase Team Members Service
 * Handles team member operations
 * 
 * @module services/supabase/members.service
 */

import { supabase } from '@/config/supabase';

/**
 * Add team member
 */
export async function addTeamMember(input: any): Promise<{ member: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .insert([input])
      .select()
      .single();

    if (error) {
      return { member: null, error: error.message };
    }

    return { member: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add team member';
    return { member: null, error: message };
  }
}

/**
 * Get team members
 */
export async function getTeamMembers(teamId: string): Promise<{ members: any[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select()
      .eq('team_id', teamId)
      .order('created_at', { ascending: true });

    if (error) {
      return { members: null, error: error.message };
    }

    return { members: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team members';
    return { members: null, error: message };
  }
}

/**
 * Get team member by ID
 */
export async function getTeamMemberById(memberId: string): Promise<{ member: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select()
      .eq('id', memberId)
      .single();

    if (error) {
      return { member: null, error: error.message };
    }

    return { member: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team member';
    return { member: null, error: message };
  }
}

/**
 * Update team member
 */
export async function updateTeamMember(memberId: string, updates: any): Promise<{ member: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', memberId)
      .select()
      .single();

    if (error) {
      return { member: null, error: error.message };
    }

    return { member: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update team member';
    return { member: null, error: message };
  }
}

/**
 * Remove team member
 */
export async function removeTeamMember(memberId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to remove team member';
    return { error: message };
  }
}

/**
 * Accept team invitation
 */
export async function acceptInvitation(memberId: string): Promise<{ member: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .update({
        status: 'accepted',
        joined_at: new Date().toISOString(),
      })
      .eq('id', memberId)
      .select()
      .single();

    if (error) {
      return { member: null, error: error.message };
    }

    return { member: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to accept invitation';
    return { member: null, error: message };
  }
}

/**
 * Reject team invitation
 */
export async function rejectInvitation(memberId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('team_members')
      .update({
        status: 'rejected',
      })
      .eq('id', memberId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reject invitation';
    return { error: message };
  }
}

/**
 * Get member stats
 */
export async function getMemberStats(teamId: string): Promise<{
  totalMembers: number;
  acceptedMembers: number;
  pendingMembers: number;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('status')
      .eq('team_id', teamId);

    if (error) {
      return {
        totalMembers: 0,
        acceptedMembers: 0,
        pendingMembers: 0,
        error: error.message,
      };
    }

    const accepted = data?.filter((m: any) => m.status === 'accepted').length || 0;
    const total = data?.length || 0;

    return {
      totalMembers: total,
      acceptedMembers: accepted,
      pendingMembers: total - accepted,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch member stats';
    return {
      totalMembers: 0,
      acceptedMembers: 0,
      pendingMembers: 0,
      error: message,
    };
  }
}
