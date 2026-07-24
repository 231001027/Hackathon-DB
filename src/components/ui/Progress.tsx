import { motion } from 'framer-motion';

export default function Progress({
  value,
  className = '',
  showLabel = false,
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${clamped}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-500 via-accent-500 to-sky-500"
          />
        </div>
        {showLabel && (
          <span className="ml-3 text-xs font-semibold text-slate-600 dark:text-slate-300">{clamped}%</span>
        )}
      </div>
    </div>
  );
}
