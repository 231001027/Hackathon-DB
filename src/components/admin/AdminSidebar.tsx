import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  BarChart3,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  Bug,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Logo from '@/components/ui/Logo';
import { useMediaQuery } from '@/hooks';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/teams', label: 'Registered Teams', icon: Users },
  { to: '/admin/submissions', label: 'Submissions', icon: FileCheck2 },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/debugger', label: 'Activity Debugger', icon: Bug },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const width = isDesktop ? (collapsed ? 'w-20' : 'w-64') : 'w-64';

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-slate-200/60 px-4 dark:border-slate-800/60">
        <Logo size={collapsed ? 36 : 32} className="shrink-0" />
        {!collapsed && (
          <span className="font-display text-sm font-bold text-slate-900 dark:text-white">
            Smart<span className="gradient-text">Ability</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-glow'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              } ${collapsed && isDesktop ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200/60 p-3 dark:border-slate-800/60">
        <div className={`mb-2 flex items-center gap-3 rounded-xl bg-slate-100/60 p-2 dark:bg-slate-800/60 ${collapsed && isDesktop ? 'justify-center' : ''}`}>
          <Avatar name={user?.name ?? 'Admin'} size="sm" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">Administrator</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10 ${collapsed && isDesktop ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80 lg:hidden">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <Logo size={34} />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200/60 bg-white/70 backdrop-blur-xl transition-all duration-300 dark:border-slate-800/60 dark:bg-slate-900/60 lg:flex ${width}`}>
        <div className="flex items-center justify-end px-3 py-2">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/60 bg-white shadow-glass-lg dark:border-slate-800/60 dark:bg-slate-900 lg:hidden"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
