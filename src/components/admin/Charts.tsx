import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface BarChartProps {
  data: { label: string; value: number }[];
  icon?: LucideIcon;
  color?: string;
  height?: number;
}

// Lightweight CSS bar chart — no chart library needed.
export function BarChart({ data, icon: Icon, color = 'from-brand-500 to-accent-500', height = 180 }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-3" style={{ height }}>
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 30);
        return (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 items-end justify-center">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: h }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                className={`w-full max-w-[42px] rounded-t-lg bg-gradient-to-t ${color} shadow-lg`}
              >
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-700 dark:text-slate-200">
                  {d.value}
                </span>
              </motion.div>
            </div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{d.label}</span>
          </div>
        );
      })}
      {Icon && <Icon className="hidden" />}
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 180 }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={14} className="text-slate-200 dark:text-slate-800" />
          {data.map((d, i) => {
            const dash = (d.value / total) * circumference;
            const seg = (
              <motion.circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={14}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                initial={{ strokeDashoffset: -circumference }}
                whileInView={{ strokeDashoffset: -offset }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: 'easeOut' }}
              />
            );
            offset += dash;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{total}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Total</span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: d.color }} />
            <span className="text-sm text-slate-600 dark:text-slate-300">{d.label}</span>
            <span className="ml-auto text-sm font-semibold text-slate-900 dark:text-white">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
