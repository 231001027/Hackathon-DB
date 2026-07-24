import { motion } from 'framer-motion';
import { getIcon } from '@/utils/icons';
import { FEATURES } from '@/data';

export default function FeatureCards() {
  return (
    <section id="features" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Features</span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Everything you need to <span className="gradient-text">run a hackathon</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            From team registration to final submission tracking, Smart Ability Hackathon covers the entire lifecycle
            with a premium, intuitive interface.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = getIcon(f.icon);
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}
                whileHover={{ y: -6 }}
                className="glass-card group relative overflow-hidden p-6"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-brand-500/10 to-accent-500/10 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
                    <Icon className="h-6 w-6 text-brand-600 dark:text-brand-300" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
