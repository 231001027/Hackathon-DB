/**
 * FieldError Component
 * Professional error message display for form fields
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FieldErrorProps {
  error?: string;
  className?: string;
}

/**
 * Displays validation error for a form field
 */
export default function FieldError({ error, className = '' }: FieldErrorProps) {
  if (!error) return null;

  return (
    <div className={`flex items-start gap-2 mt-1.5 ${className}`}>
      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
      <span className="text-xs font-medium text-red-600 dark:text-red-400">
        {error}
      </span>
    </div>
  );
}
