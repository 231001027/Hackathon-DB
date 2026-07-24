import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function Contact() {
  const { success } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      success('Message sent!', 'Our team will get back to you shortly.');
      setForm({ name: '', email: '', message: '' });
    }, 1100);
  };

  return (
    <section id="contact" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card relative overflow-hidden p-8 sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-2">
            <div>
              <span className="section-eyebrow">Contact</span>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Got questions? <span className="gradient-text">Let's talk</span>
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Reach out to the Smart Ability Hackathon organizing team for queries about registration,
                submissions, rules, or partnerships.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { Icon: Mail, label: 'Email', value: 'hackathon@college.edu' },
                  { Icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                  { Icon: MapPin, label: 'Location', value: 'Innovation Campus, Bangalore' },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
                      <c.Icon className="h-5 w-5 text-brand-600 dark:text-brand-300" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{c.label}</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-text" htmlFor="c-name">Name</label>
                <input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="label-text" htmlFor="c-email">Email</label>
                <input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" />
              </div>
              <div>
                <label className="label-text" htmlFor="c-msg">Message</label>
                <textarea id="c-msg" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" placeholder="How can we help?" />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={sending}
                className="btn-primary w-full"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Sending…
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><Send className="h-4 w-4" /> Send Message</span>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
