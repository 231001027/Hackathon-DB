/**
 * ValidationFeedback Component
 * Displays validation feedback (success, error, info, warning)
 * Used for form field validation messages
 */

import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

interface ValidationFeedbackProps {
  message: string;
  type: FeedbackType;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Get icon for feedback type
 */
function getIcon(type: FeedbackType) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-5 h-5" />;
    case 'error':
      return <AlertCircle className="w-5 h-5" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5" />;
    case 'info':
      return <Info className="w-5 h-5" />;
  }
}

/**
 * Get colors based on feedback type
 */
function getColors(type: FeedbackType) {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-50 dark:bg-green-950/30',
        border: 'border-green-200 dark:border-green-800',
        icon: 'text-green-600 dark:text-green-400',
        text: 'text-green-900 dark:text-green-200',
      };
    case 'error':
      return {
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-800',
        icon: 'text-red-600 dark:text-red-400',
        text: 'text-red-900 dark:text-red-200',
      };
    case 'warning':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        border: 'border-amber-200 dark:border-amber-800',
        icon: 'text-amber-600 dark:text-amber-400',
        text: 'text-amber-900 dark:text-amber-200',
      };
    case 'info':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'text-blue-600 dark:text-blue-400',
        text: 'text-blue-900 dark:text-blue-200',
      };
  }
}

/**
 * ValidationFeedback Component
 */
export default function ValidationFeedback({
  message,
  type,
  dismissible = false,
  onDismiss,
  className = '',
}: ValidationFeedbackProps) {
  const colors = getColors(type);

  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg border
        ${colors.bg} ${colors.border} ${className}
      `}
    >
      <div className={`flex-shrink-0 mt-0.5 ${colors.icon}`}>
        {getIcon(type)}
      </div>

      <div className="flex-1">
        <p className={`text-sm font-medium ${colors.text}`}>{message}</p>
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 text-xl leading-none hover:opacity-60 transition ${colors.text}`}
        >
          ×
        </button>
      )}
    </div>
  );
}
