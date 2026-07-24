import { motion } from 'framer-motion';
import { getIcon } from '@/utils/icons';
import { TIMELINE } from '@/data';

export default function Timeline() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Timeline</span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            The <span className="gradient-text">hackathon journey</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Five clear stages from registration to crowning the winners.
          </p>
        </div>

        <div className="relative mt-16">
          {/* center line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-brand-500 via-accent-500 to-sky-500 lg:block" />

          <div className="space-y-10 lg:space-y-0">
            {TIMELINE.map((item, i) => {
              const Icon = getIcon(item.icon);
              const isLeft = i % 2 === 0;
              return (
                <div key={item.step} className="relative lg:grid lg:grid-cols-2 lg:gap-12 lg:py-8">
                  {/* node */}
                  <div className="absolute left-1/2 top-0 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent-600 text-xs font-bold text-white shadow-glow ring-4 ring-white dark:ring-slate-950 lg:flex">
                    {item.step}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5 }}
                    className={`glass-card relative p-6 ${isLeft ? 'lg:mr-12' : 'lg:col-start-2 lg:ml-12'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
                        <Icon className="h-5 w-5 text-brand-600 dark:text-brand-300" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-brand-600 dark:text-brand-300">Step {item.step}</span>
                        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.description}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
