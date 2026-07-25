import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQS } from '@/data';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="section-eyebrow">FAQ</span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Everything you need to know about participating in Smart Ability Innovation.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`h-5 w-5 shrink-0 ${isOpen ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400'}`} />
                    <span className="font-display text-sm font-bold text-slate-900 dark:text-white sm:text-base">{faq.q}</span>
                  </div>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 pl-12 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
