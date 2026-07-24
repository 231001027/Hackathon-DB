/**
 * Supabase Submissions Service
 * Handles submission operations
 */

import { supabase } from '@/config/supabase';

export async function createSubmission(input: any): Promise<{ submission: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([input])
      .select()
      .single();

    if (error) return { submission: null, error: error.message };
    return { submission: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create submission';
    return { submission: null, error: message };
  }
}

export async function getSubmissionsByTeam(teamId: string): Promise<{
  submissions: any[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select()
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) return { submissions: null, error: error.message };
    return { submissions: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch submissions';
    return { submissions: null, error: message };
  }
}

export async function getAllSubmissions(): Promise<{ submissions: any[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select()
      .order('created_at', { ascending: false });

    if (error) return { submissions: null, error: error.message };
    return { submissions: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch submissions';
    return { submissions: null, error: message };
  }
}

export async function getSubmissionById(submissionId: string): Promise<{
  submission: any | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select()
      .eq('id', submissionId)
      .single();

    if (error) return { submission: null, error: error.message };
    return { submission: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch submission';
    return { submission: null, error: message };
  }
}

export async function updateSubmission(submissionId: string, updates: any): Promise<{ submission: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .update(updates)
      .eq('id', submissionId)
      .select()
      .single();

    if (error) return { submission: null, error: error.message };
    return { submission: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update submission';
    return { submission: null, error: message };
  }
}

export async function submitSubmission(submissionId: string): Promise<{
  submission: any | null;
  error: string | null;
}> {
  return updateSubmission(submissionId, { status: 'submitted' });
}

export async function evaluateSubmission(
  submissionId: string,
  score: number,
  feedback: string
): Promise<{ submission: any | null; error: string | null }> {
  return updateSubmission(submissionId, {
    status: 'evaluated',
    score,
    feedback,
  });
}

export async function getSubmissionStats(): Promise<{
  totalSubmissions: number;
  draftSubmissions: number;
  submittedSubmissions: number;
  evaluatedSubmissions: number;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('status');

    if (error) {
      return {
        totalSubmissions: 0,
        draftSubmissions: 0,
        submittedSubmissions: 0,
        evaluatedSubmissions: 0,
        error: error.message,
      };
    }

    const draft = data?.filter((s: any) => s.status === 'draft').length || 0;
    const submitted = data?.filter((s: any) => s.status === 'submitted').length || 0;
    const evaluated = data?.filter((s: any) => s.status === 'evaluated').length || 0;

    return {
      totalSubmissions: data?.length || 0,
      draftSubmissions: draft,
      submittedSubmissions: submitted,
      evaluatedSubmissions: evaluated,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch submission stats';
    return {
      totalSubmissions: 0,
      draftSubmissions: 0,
      submittedSubmissions: 0,
      evaluatedSubmissions: 0,
      error: message,
    };
  }
}
