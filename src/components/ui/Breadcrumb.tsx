import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
      <Link to="/" className="transition-colors hover:text-brand-600 dark:hover:text-brand-300">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-brand-600 dark:hover:text-brand-300">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
