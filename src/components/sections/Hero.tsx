import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Users, ShieldCheck, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-mesh pt-32 pb-20 sm:pt-40">
      {/* glowing blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-brand-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -top-10 right-1/4 h-72 w-72 rounded-full bg-accent-500/20 blur-[120px]" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="section-eyebrow inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Innovation Challenge on Assistive Technology
          </span>
          
          {/* Logo and Title Section */}
          <div className="mt-5 flex items-center justify-center gap-4 sm:gap-6">
            <motion.img 
              src="/smartability-logo.png" 
              alt="Smart Ability Logo"
              className="h-20 w-20 sm:h-28 sm:w-28 object-contain drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Smart Ability <span className="gradient-text">Hackathon</span>
            </h1>
          </div>

          <p className="mt-4 font-display text-xl font-semibold text-slate-600 dark:text-slate-300">
            Build Applications and Devices to Support Speech, Hearing and Communication
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Organised by the <strong className="text-slate-800 dark:text-slate-200">Centre of Excellence in Assistive Technology, Rajalakshmi Engineering College</strong> in association with the <strong className="text-slate-800 dark:text-slate-200">Department of Speech, Hearing and Communication, NIEPMD</strong>. Build <strong className="text-slate-800 dark:text-slate-200">AI-powered software</strong> or <strong className="text-slate-800 dark:text-slate-200">hardware devices</strong> that support persons with speech, hearing and communication disabilities — and compete for <strong className="text-slate-800 dark:text-slate-200">₹1,00,000</strong> in prizes.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/register" size="lg" icon={Rocket} iconRight={ArrowRight}>
              Register Team
            </Button>
            <Button to="/student-login" size="lg" variant="secondary" icon={Users}>
              Student Login
            </Button>
            <Button to="/admin-login" size="lg" variant="secondary" icon={ShieldCheck}>
              Admin Login
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 font-semibold text-brand-700 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:ring-brand-700/40">
              📅 01 August 2026
            </div>
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 font-semibold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-700/40">
              🏆 Prize Pool: ₹1,00,000
            </div>
            <div className="flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 font-semibold text-violet-700 ring-1 ring-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:ring-violet-700/40">
              🤖 AI Software Track
            </div>
            <div className="flex items-center gap-2 rounded-full bg-sky-50 px-4 py-1.5 font-semibold text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-700/40">
              🔧 Hardware Track
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
