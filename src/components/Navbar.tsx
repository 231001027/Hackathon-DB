import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { NAV_LINKS } from '@/data';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useClickOutside } from '@/hooks';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(() => setMenuOpen(false));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-glass'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Empty space on left */}
        <div></div>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 py-1 pl-1 pr-2 transition-colors hover:border-brand-400 dark:border-slate-700 dark:bg-slate-800/60"
              >
                <Avatar name={user.name} size="sm" />
                <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
                  {user.name.split(' ')[0]}
                </span>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="glass-card absolute right-0 mt-2 w-52 overflow-hidden p-1.5"
                  >
                    <div className="border-b border-slate-200/60 px-3 py-2 dark:border-slate-700/60">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                    <Link
                      to={dashboardLink}
                      onClick={() => setMenuOpen(false)}
                      className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/register"
              className="hidden rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105 sm:inline-flex"
            >
              Get Started
            </Link>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass overflow-hidden lg:hidden"
          >
            <div className="space-y-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-brand-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
