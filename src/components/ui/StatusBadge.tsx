import type { SubmissionStatus } from '@/types';
import { statusLabel } from '@/utils';
import { CheckCircle2, Clock, CircleDot } from 'lucide-react';

const MAP: Record<SubmissionStatus, { classes: string; icon: typeof CheckCircle2 }> = {
  submitted: { classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300', icon: CheckCircle2 },
  in_progress: { classes: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300', icon: Clock },
  not_started: { classes: 'bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300', icon: CircleDot },
};

export default function StatusBadge({ status, size = 'md' }: { status: SubmissionStatus; size?: 'sm' | 'md' }) {
  const { classes, icon: Icon } = MAP[status];
  const sizing = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${classes} ${sizing}`}>
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {statusLabel(status)}
    </span>
  );
}
