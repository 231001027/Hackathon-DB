import { useEffect, useState } from 'react';
import { RefreshCw, Trash2, Download } from 'lucide-react';
import { getActivityLogs, getActivityStats, clearActivityLogs } from '@/services/supabase/logging.service';

interface ActivityLog {
  id: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  user_id?: string;
  details?: any;
  error_message?: string;
  created_at: string;
}

export default function AdminDebugger() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { logs: data, error: logsError } = await getActivityLogs(200);
      if (logsError) {
        setError(logsError);
      } else {
        setLogs(data || []);
      }

      const statsResult = await getActivityStats();
      if (statsResult.error) {
        console.error('Stats error:', statsResult.error);
      } else {
        setStats(statsResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = async () => {
    if (window.confirm('Are you sure you want to clear all activity logs? This cannot be undone.')) {
      try {
        const { error: clearError } = await clearActivityLogs();
        if (clearError) {
          setError(clearError);
        } else {
          setLogs([]);
          alert('Logs cleared successfully');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to clear logs');
      }
    }
  };

  const handleDownloadLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-logs-${new Date().toISOString()}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Activity Debugger</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Monitor all system activities and errors</p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-200">
          Error: {error}
        </div>
      )}

      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Registrations</div>
            <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {stats.totalRegistrations}
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">PDF Uploads</div>
            <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {stats.totalUploads}
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Errors</div>
            <div className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
              {stats.totalErrors}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleDownloadLogs}
          disabled={logs.length === 0}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Download Logs
        </button>
        <button
          onClick={handleClearLogs}
          disabled={logs.length === 0}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          Clear Logs
        </button>
      </div>

      <div className="rounded-lg bg-white shadow dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Entity ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    {loading ? 'Loading logs...' : 'No activity logs found'}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      log.error_message ? 'bg-red-50 dark:bg-red-900/20' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {log.entity_type || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {log.entity_id ? log.entity_id.substring(0, 8) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {log.error_message ? (
                        <span className="text-red-600 dark:text-red-400">{log.error_message}</span>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400">
                          {log.details ? JSON.stringify(log.details).substring(0, 50) : '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg bg-slate-50 p-6 dark:bg-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-white">Total Logs</h3>
        <p className="mt-2 text-2xl font-bold text-blue-600">{logs.length}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Showing last 200 activities. Auto-refreshing every 5 seconds.
        </p>
      </div>
    </div>
  );
}
