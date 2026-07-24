import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/**
 * Vite Configuration - Production Optimized
 * Configured for maximum performance with code splitting, lazy loading, and caching
 */
export default defineConfig({
  plugins: [
    react({
      // Fast Refresh with optimizations
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // Dependency optimization
  optimizeDeps: {
    // Pre-bundle these dependencies for faster startup
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
    ],
    // Don't pre-bundle these to avoid duplication
    exclude: ['lucide-react'],
  },

  // Build configuration for production
  build: {
    // Target modern browsers for smaller bundle
    target: 'ES2020',

    // Output directory
    outDir: 'dist',

    // Source map for debugging (set to false in production for smaller bundle)
    sourcemap: false,

    // Minification - use esbuild (default, included with Vite)
    minify: 'esbuild',

    // Code splitting strategy
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor libraries
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          // Animation library
          'animation': ['framer-motion'],
          // Icons library
          'icons': ['lucide-react'],
          // Admin pages as separate chunk for better caching
          'admin': [
            './src/pages/admin/AdminDashboard.tsx',
            './src/pages/admin/AdminTeams.tsx',
            './src/pages/admin/AdminSubmissions.tsx',
            './src/pages/admin/AdminAnalytics.tsx',
            './src/pages/admin/AdminSettings.tsx',
          ],
          // Auth pages
          'auth': [
            './src/pages/LoginPage.tsx',
            './src/pages/RegisterPage.tsx',
            './src/pages/TeamLeaderRegisterPage.tsx',
            './src/pages/MemberRegisterPage.tsx',
          ],
          // Student pages
          'student': [
            './src/pages/StudentDashboard.tsx',
            './src/pages/TeamDetailsPage.tsx',
            './src/pages/TeamMembersSetupPage.tsx',
          ],
        },

        // Asset naming for cache busting
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },

    // Chunk size warnings threshold
    chunkSizeWarningLimit: 600,

    // CSS code splitting
    cssCodeSplit: true,

    // Reporting compressed size
    reportCompressedSize: true,

    // Inline CSS for critical path
    cssMinify: true,
  },

  // Server configuration for development
  server: {
    // HMR settings for fast refresh
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
    // Development server port
    port: 5173,
    // Open browser automatically
    open: false,
  },

  // Preview settings
  preview: {
    port: 4173,
  },
});
