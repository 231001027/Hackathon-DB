/**
 * Performance Monitoring Utilities
 * Tracks performance metrics and helps identify bottlenecks
 * Used for logging and performance analysis
 */

import { isDevelopment } from '@/config/environment';

/**
 * Performance metrics storage
 */
export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * Performance monitor singleton
 */
class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private marks = new Map<string, number>();

  /**
   * Start measuring performance
   */
  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  /**
   * End measuring and record metric
   */
  end(label: string, metadata?: Record<string, unknown>): number {
    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`Performance mark '${label}' not found`);
      return 0;
    }

    const duration = performance.now() - startTime;
    const metric: PerformanceMetric = {
      name: label,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);
    this.marks.delete(label);

    if (isDevelopment()) {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Mark time without ending
   */
  mark(label: string): void {
    performance.mark(label);
  }

  /**
   * Measure between marks
   */
  measure(label: string, startMark: string, endMark: string): number {
    try {
      performance.measure(label, startMark, endMark);
      const measure = performance.getEntriesByName(label)[0];
      return measure?.duration ?? 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter((m) => m.name === name);
  }

  /**
   * Get average duration for metric
   */
  getAverageDuration(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => acc + m.duration, 0);
    return sum / metrics.length;
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics = [];
    this.marks.clear();
  }

  /**
   * Get performance summary
   */
  getSummary(): Record<string, { count: number; avg: number; max: number; min: number }> {
    const summary: Record<string, { count: number; avg: number; max: number; min: number }> = {};

    this.metrics.forEach((metric) => {
      if (!summary[metric.name]) {
        summary[metric.name] = {
          count: 0,
          avg: 0,
          max: 0,
          min: Infinity,
        };
      }

      const s = summary[metric.name];
      s.count++;
      s.max = Math.max(s.max, metric.duration);
      s.min = Math.min(s.min, metric.duration);
      s.avg = (s.avg * (s.count - 1) + metric.duration) / s.count;
    });

    return summary;
  }
}

/**
 * Export singleton instance
 */
export const perf = new PerformanceMonitor();

/**
 * Measure async operation
 */
export async function measureAsync<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  perf.start(label);
  try {
    return await fn();
  } finally {
    perf.end(label);
  }
}

/**
 * Measure sync operation
 */
export function measureSync<T>(
  label: string,
  fn: () => T
): T {
  perf.start(label);
  try {
    return fn();
  } finally {
    perf.end(label);
  }
}

/**
 * Get Core Web Vitals
 */
export async function getCoreWebVitals(): Promise<{
  lcp: number | null;
  fid: number | null;
  cls: number | null;
}> {
  return new Promise((resolve) => {
    let lcp: number | null = null;
    let fid: number | null = null;
    let cls = 0;

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          const time = (lastEntry as PerformanceEntry & { renderTime?: number; loadTime?: number }).renderTime ||
            (lastEntry as PerformanceEntry & { renderTime?: number; loadTime?: number }).loadTime;
          if (time) lcp = time;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch {
        // LCP not supported
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const time = (entries[0] as PerformanceEntry & { processingDuration?: number }).processingDuration;
            if (time) fid = time;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch {
        // FID not supported
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
              const value = (entry as PerformanceEntry & { value?: number }).value;
              if (value) cls += value;
            }
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch {
        // CLS not supported
      }
    }

    // Return values after delay to collect metrics
    setTimeout(() => {
      resolve({
        lcp,
        fid,
        cls,
      });
    }, 5000);
  });
}

/**
 * Report performance metrics
 */
export function reportMetrics(): void {
  if (!isDevelopment()) return;

  const summary = perf.getSummary();
  console.group('📊 Performance Metrics');

  Object.entries(summary).forEach(([name, data]) => {
    console.log(`${name}:`, {
      calls: data.count,
      avg: `${data.avg.toFixed(2)}ms`,
      min: `${data.min.toFixed(2)}ms`,
      max: `${data.max.toFixed(2)}ms`,
    });
  });

  console.groupEnd();
}

/**
 * Memory usage (approximate)
 */
export function getMemoryUsage(): { usedJSHeapSize: number; jsHeapSizeLimit: number } | null {
  if (!(performance as any).memory) {
    return null;
  }

  return {
    usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
    jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
  };
}

/**
 * Check if resource is cached
 */
export function isResourceCached(url: string): boolean {
  if (!('PerformanceResourceTiming' in window)) return false;

  const entries = performance.getEntriesByName(url, 'resource');
  if (entries.length === 0) return false;

  const entry = entries[0] as PerformanceResourceTiming;
  return entry.transferSize === 0 && entry.decodedBodySize > 0;
}

/**
 * Optimize animation frame timing
 */
export function scheduleIdleCallback(callback: () => void, timeout?: number): number {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, { timeout });
  }

  // Fallback for browsers without requestIdleCallback
  return setTimeout(callback, timeout ?? 0) as unknown as number;
}

/**
 * Cancel idle callback
 */
export function cancelIdleCallback(id: number): void {
  if ('cancelIdleCallback' in window) {
    cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}
