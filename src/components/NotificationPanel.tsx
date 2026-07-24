import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, BellRing } from 'lucide-react';
import { SAMPLE_NOTIFICATIONS } from '@/data';
import { useClickOutside } from '@/hooks';
import type { AppNotification } from '@/types';

const TONE_DOT: Record<AppNotification['tone'], string> = {
  info: 'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>(SAMPLE_NOTIFICATIONS);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const unread = items.filter((n) => !n.read).length;

  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/60 text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="glass-card absolute right-0 mt-2 w-80 overflow-hidden p-0 sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-brand-600 dark:text-brand-300" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                {unread > 0 && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">{unread} new</span>}
              </div>
              <button onClick={markAll} className="flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300">
                <CheckCheck className="h-3.5 w-3.5" /> Mark all
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-400">No notifications</p>
              ) : (
                items.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 border-b border-slate-100/60 px-4 py-3 transition-colors last:border-0 dark:border-slate-800/60 ${n.read ? '' : 'bg-brand-50/40 dark:bg-brand-900/10'}`}
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TONE_DOT[n.tone]}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{n.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{n.body}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link to="/student/dashboard" onClick={() => setOpen(false)} className="block border-t border-slate-200/60 px-4 py-2.5 text-center text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50 dark:border-slate-700/60 dark:text-brand-300 dark:hover:bg-brand-900/20">
              View all activity
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
