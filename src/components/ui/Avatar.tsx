import { cn } from '@/utils/cn';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

// Deterministic gradient based on the name so each user gets a stable color.
const GRADIENTS = [
  'from-brand-500 to-accent-500',
  'from-sky-500 to-brand-500',
  'from-accent-500 to-sky-500',
  'from-brand-600 to-sky-500',
  'from-accent-600 to-brand-500',
];

export default function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const idx = name.charCodeAt(0) % GRADIENTS.length;
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-md ring-2 ring-white/40 dark:ring-white/10',
        GRADIENTS[idx],
        SIZES[size],
        className,
      )}
    >
      {initials || '?'}
    </div>
  );
}
