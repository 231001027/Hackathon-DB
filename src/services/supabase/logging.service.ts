/**
 * Supabase Activity Logging Service
 * Tracks all user actions for debugging and auditing
 */

import { supabase } from '@/config/supabase';

export interface ActivityLog {
  id?: string;
  action: string;
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Log an activity
 */
export async function logActivity(
  log: ActivityLog
): Promise<{ error: string | null }> {
  try {
    const { uid } = await import('@/utils');

    const { error } = await supabase
      .from('activity_logs')
      .insert({
        id: log.id || uid('log'),
        action: log.action,
        description: log.description || '',
        metadata: log.metadata || {},
      });

    if (error) {
      console.error('❌ Failed to log activity:', error);
      return { error: error.message };
    }

    console.log(`✅ Activity logged: ${log.action}`);
    return { error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to log activity';

    console.error('❌ Logging error:', message);
    return { error: message };
  }
}

/**
 * Get recent activity logs
 */
export async function getActivityLogs(limit = 100) {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { logs: null, error: error.message };
    }

    return { logs: data, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch activity logs';

    return { logs: null, error: message };
  }
}

/**
 * Get activity logs by action
 */
export async function getActivityLogsByAction(
  action: string,
  limit = 50
) {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('action', action)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { logs: null, error: error.message };
    }

    return { logs: data, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch activity logs';

    return { logs: null, error: message };
  }
}

/**
 * Get activity logs by user
 */
export async function getActivityLogsByUser(
  userId: string,
  limit = 50
) {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { logs: null, error: error.message };
    }

    return { logs: data, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch activity logs';

    return { logs: null, error: message };
  }
}

/**
 * Clear activity logs
 */
export async function clearActivityLogs() {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to clear activity logs';

    return { error: message };
  }
}

/**
 * Activity statistics
 */
export async function getActivityStats() {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('action');

    if (error) {
      return {
        totalRegistrations: 0,
        totalErrors: 0,
        totalUploads: 0,
        error: error.message,
      };
    }

    return {
      totalRegistrations:
        data?.filter((x: any) => x.action === 'team_registered').length ?? 0,
      totalErrors:
        data?.filter((x: any) => x.action.includes('error')).length ?? 0,
      totalUploads:
        data?.filter((x: any) => x.action === 'pdf_uploaded').length ?? 0,
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch activity stats';

    return {
      totalRegistrations: 0,
      totalErrors: 0,
      totalUploads: 0,
      error: message,
    };
  }
}