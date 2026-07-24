import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  href?: string;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const VARIANTS = {
  primary: 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-glow hover:shadow-glow-blue',
  secondary:
    'border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-300',
  ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  danger:
    'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  icon: Icon,
  iconRight: IconRight,
  type = 'button',
  disabled,
  fullWidth,
  onClick,
  className = '',
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-60 disabled:hover:scale-100 ${SIZES[size]} ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

  const content = (
    <>
      {Icon && <Icon className="h-4 w-4" />}
      {children}
      {IconRight && <IconRight className="h-4 w-4" />}
    </>
  );

  if (to) {
    return (
      <motion.div whileHover={{ scale: disabled ? 1 : 1.03 }} whileTap={{ scale: disabled ? 1 : 0.95 }} className={fullWidth ? 'w-full' : 'inline-block'}>
        <Link to={to} className={classes}>
          {content}
        </Link>
      </motion.div>
    );
  }
  if (href) {
    return (
      <motion.a whileHover={{ scale: disabled ? 1 : 1.03 }} whileTap={{ scale: disabled ? 1 : 0.95 }} href={href} className={classes}>
        {content}
      </motion.a>
    );
  }
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {content}
    </motion.button>
  );
}
