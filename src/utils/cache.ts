/**
 * Intelligent Caching Utilities
 * Provides memory cache, localStorage cache, and cache invalidation strategies
 * Used for optimizing API calls and reducing redundant processing
 */

import { config } from '@/config/environment';

/**
 * Cache entry with expiration
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

/**
 * Memory cache for storing data during session
 * Cleared on page reload
 */
class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  /**
   * Get value from cache if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set value in cache with TTL
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * LocalStorage-based cache for persisting data across sessions
 * Used for team/user data that doesn't change frequently
 */
class PersistentCache {
  private prefix = 'cache_';

  /**
   * Get value from localStorage cache if not expired
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const entry = JSON.parse(item) as CacheEntry<T>;

      // Check if expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.delete(key);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  /**
   * Set value in localStorage cache with TTL
   */
  set<T>(key: string, data: T, ttl: number = 24 * 60 * 60 * 1000): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch {
      // Silently fail if localStorage is full
    }
  }

  /**
   * Delete value from localStorage cache
   */
  delete(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch {
      // Silently fail
    }
  }

  /**
   * Clear all cached items
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(this.prefix)
      );
      keys.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Silently fail
    }
  }
}

/**
 * Smart cache that uses both memory and persistent caches
 */
class SmartCache {
  private memoryCache = new MemoryCache();
  private persistentCache = new PersistentCache();

  /**
   * Get value from cache (checks memory first, then persistent)
   */
  get<T>(key: string): T | null {
    if (!config.cache.enableCache) return null;

    // Check memory cache first (faster)
    const memValue = this.memoryCache.get<T>(key);
    if (memValue) return memValue;

    // Check persistent cache
    const persistValue = this.persistentCache.get<T>(key);
    if (persistValue) {
      // Restore to memory cache for faster access
      this.memoryCache.set(key, persistValue, 5 * 60 * 1000);
    }

    return persistValue;
  }

  /**
   * Set value in both caches
   */
  set<T>(key: string, data: T, options?: {
    memoryTTL?: number;
    persistentTTL?: number;
  }): void {
    if (!config.cache.enableCache) return;

    const memoryTTL = options?.memoryTTL ?? 5 * 60 * 1000; // 5 minutes
    const persistentTTL = options?.persistentTTL ?? 24 * 60 * 60 * 1000; // 24 hours

    this.memoryCache.set(key, data, memoryTTL);
    this.persistentCache.set(key, data, persistentTTL);
  }

  /**
   * Delete from both caches
   */
  delete(key: string): void {
    this.memoryCache.delete(key);
    this.persistentCache.delete(key);
  }

  /**
   * Clear both caches
   */
  clear(): void {
    this.memoryCache.clear();
    this.persistentCache.clear();
  }

  /**
   * Get cache statistics
   */
  stats() {
    return {
      memorySize: this.memoryCache.size(),
      enabled: config.cache.enableCache,
    };
  }
}

/**
 * Export singleton instance
 */
export const cache = new SmartCache();

/**
 * Decorator for caching function results
 * @example
 * @cached('user-data', 5 * 60 * 1000)
 * async function fetchUserData(id: string) { ... }
 */
export function cached(key: string, ttl: number = 5 * 60 * 1000) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const cacheKey = `${key}:${JSON.stringify(args)}`;
      const cached = cache.get(cacheKey);

      if (cached) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, result, { memoryTTL: ttl });

      return result;
    };

    return descriptor;
  };
}

/**
 * Request deduplication - prevents multiple identical requests
 * Useful for rapid user clicks on the same button
 */
export class RequestDeduplicator {
  private pending = new Map<string, Promise<unknown>>();

  /**
   * Execute function, returning cached promise if same request is pending
   */
  async execute<T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T> {
    // Return pending promise if exists
    if (this.pending.has(key)) {
      return this.pending.get(key) as Promise<T>;
    }

    // Create new promise
    const promise = fn().finally(() => {
      this.pending.delete(key);
    });

    // Store pending promise
    this.pending.set(key, promise);

    return promise;
  }

  /**
   * Clear pending requests
   */
  clear(): void {
    this.pending.clear();
  }
}

/**
 * Image lazy loading utility
 * Loads images only when they come into viewport
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      img.src = src;
      img.onload = () => resolve();
      img.onerror = reject;
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          image.src = src;
          image.onload = () => {
            observer.unobserve(image);
            resolve();
          };
          image.onerror = () => {
            observer.unobserve(image);
            reject();
          };
        }
      });
    });

    observer.observe(img);
  });
}

/**
 * Prefetch resource (link, script, style)
 */
export function prefetch(url: string, as: 'style' | 'script' = 'script'): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = as;
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Preload critical resource
 */
export function preload(url: string, as: 'style' | 'script' | 'image' = 'script'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = url;
  document.head.appendChild(link);
}
