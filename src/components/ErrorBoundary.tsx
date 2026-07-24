/**
 * Error Boundary Component for React Error Handling
 * Catches rendering errors and displays professional error UI
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

/**
 * Professional Error Boundary Component
 * Handles uncaught React component errors gracefully
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 Error caught by boundary:', error);
      console.error('📋 Error Info:', errorInfo);
    }

    // In production, you would send this to a logging service
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorCount: this.state.errorCount + 1,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-950 dark:to-red-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 text-center space-y-4">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
                  <div className="relative bg-red-500 rounded-full p-4">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Something went wrong
              </h1>

              {/* Error Message */}
              <p className="text-slate-600 dark:text-slate-400">
                We encountered an unexpected error. Our team has been notified.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 text-left max-h-32 overflow-auto">
                  <p className="text-xs font-mono text-red-700 dark:text-red-300 break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg transition"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
              </div>

              {/* Support Message */}
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
                Error ID: {this.state.errorCount > 0 ? `RETRY-${this.state.errorCount}` : 'ERR-' + Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
