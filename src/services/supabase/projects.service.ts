/**
 * Supabase Projects Service
 * Handles project operations
 */

import { supabase } from '@/config/supabase';

export async function getAllProjects(): Promise<{ projects: any[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select()
      .order('created_at', { ascending: false });

    if (error) return { projects: null, error: error.message };
    return { projects: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch projects';
    return { projects: null, error: message };
  }
}

export async function getProjectById(projectId: string): Promise<{ project: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select()
      .eq('id', projectId)
      .single();

    if (error) return { project: null, error: error.message };
    return { project: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch project';
    return { project: null, error: message };
  }
}

export async function getProjectsByDifficulty(difficulty: string): Promise<{ projects: any[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select()
      .eq('difficulty', difficulty);

    if (error) return { projects: null, error: error.message };
    return { projects: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch projects';
    return { projects: null, error: message };
  }
}

export async function searchProjects(query: string): Promise<{ projects: any[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select()
      .or(`title.ilike.%${query}%,abstract.ilike.%${query}%,problem_statement.ilike.%${query}%`);

    if (error) return { projects: null, error: error.message };
    return { projects: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to search projects';
    return { projects: null, error: message };
  }
}

export async function createProject(input: any): Promise<{ project: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([input])
      .select()
      .single();

    if (error) return { project: null, error: error.message };
    return { project: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return { project: null, error: message };
  }
}

export async function getProjectsStats(): Promise<{
  totalProjects: number;
  beginnerProjects: number;
  intermediateProjects: number;
  advancedProjects: number;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('difficulty');

    if (error) {
      return {
        totalProjects: 0,
        beginnerProjects: 0,
        intermediateProjects: 0,
        advancedProjects: 0,
        error: error.message,
      };
    }

    const beginner = data?.filter((p: any) => p.difficulty === 'beginner').length || 0;
    const intermediate = data?.filter((p: any) => p.difficulty === 'intermediate').length || 0;
    const advanced = data?.filter((p: any) => p.difficulty === 'advanced').length || 0;

    return {
      totalProjects: data?.length || 0,
      beginnerProjects: beginner,
      intermediateProjects: intermediate,
      advancedProjects: advanced,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch project stats';
    return {
      totalProjects: 0,
      beginnerProjects: 0,
      intermediateProjects: 0,
      advancedProjects: 0,
      error: message,
    };
  }
}
