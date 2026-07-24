import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: 'brand' | 'accent' | 'sky' | 'emerald' | 'amber' | 'rose';
  trend?: string;
  to?: string;
}

const TONES: Record<string, { bg: string; text: string; ring: string }> = {
  brand: { bg: 'from-brand-500/15 to-brand-500/5', text: 'text-brand-600 dark:text-brand-300', ring: 'ring-brand-500/20' },
  accent: { bg: 'from-accent-500/15 to-accent-500/5', text: 'text-accent-600 dark:text-accent-300', ring: 'ring-accent-500/20' },
  sky: { bg: 'from-sky-500/15 to-sky-500/5', text: 'text-sky-600 dark:text-sky-300', ring: 'ring-sky-500/20' },
  emerald: { bg: 'from-emerald-500/15 to-emerald-500/5', text: 'text-emerald-600 dark:text-emerald-300', ring: 'ring-emerald-500/20' },
  amber: { bg: 'from-amber-500/15 to-amber-500/5', text: 'text-amber-600 dark:text-amber-300', ring: 'ring-amber-500/20' },
  rose: { bg: 'from-rose-500/15 to-rose-500/5', text: 'text-rose-600 dark:text-rose-300', ring: 'ring-rose-500/20' },
};

export default function StatCard({ label, value, icon: Icon, tone = 'brand', trend, to }: StatCardProps) {
  const t = TONES[tone];
  const inner = (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card group relative overflow-hidden p-5"
    >
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${t.bg} blur-2xl`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">{value.toLocaleString()}</p>
          {trend && (
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" /> {trend}
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${t.bg} ring-1 ${t.ring}`}>
          <Icon className={`h-6 w-6 ${t.text}`} />
        </div>
      </div>
    </motion.div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}
