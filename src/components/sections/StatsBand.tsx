import { motion } from 'framer-motion';
import { ClipboardList, Trophy, Calendar } from 'lucide-react';

const STATS = [
  { icon: ClipboardList, value: '11',          label: 'Problem Statements', sub: 'Real-World Challenges' },
  { icon: Trophy,        value: '₹1,00,000',   label: 'Total Prize Value',  sub: 'Winning Teams' },
  { icon: Calendar,      value: '01 Aug 2026', label: 'Innovation Date',     sub: 'Mark Your Calendar' },
];

export default function StatsBand() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-accent-600 to-sky-500 p-8 shadow-glow sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-hero-mesh opacity-30" />
          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <p className="mt-3 font-display text-2xl font-extrabold text-white sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-white/90">{s.label}</p>
                <p className="mt-0.5 text-xs text-white/60">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
