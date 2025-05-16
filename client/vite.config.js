import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { dependencies } from './package.json'
import viteCompression from 'vite-plugin-compression'

// Function to generate dependency chunks
function renderChunks(deps) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['vue', 'vue-router', 'pinia', 'chart.js', 'vue-chartjs', '@supabase/supabase-js'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Enable gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files > 10kb
      deleteOriginFile: false, // Keep original files
    }),
    // Enable brotli compression (even better than gzip)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240, // Only compress files > 10kb
      deleteOriginFile: false, // Keep original files
    }),
    // Add preprocessor plugins if needed in the future
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'cloudinary-core': 'cloudinary-core',
      'lodash': 'lodash'
    },
    // Ensure these modules are properly resolved
    dedupe: ['vue', 'vue-router', 'pinia', 'cloudinary-core', 'lodash']
  },
  build: {
    // Enable minification and tree-shaking with explicit terser configuration
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
        toplevel: true
      },
      mangle: {
        safari10: true,
        toplevel: true,
        keep_classnames: false,
        keep_fnames: false
      },
      format: {
        comments: false
      }
    },
    // Enhanced chunk splitting for better performance and caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core framework dependencies
          if (id.includes('node_modules/vue/') || id.includes('node_modules/@vue/')) {
            return 'vue-core';
          }
          
          // Router and related packages
          if (id.includes('node_modules/vue-router/') || id.includes('node_modules/history/')) {
            return 'vue-router';
          }
          
          // State management
          if (id.includes('node_modules/pinia/') || id.includes('/store/')) {
            return 'store';
          }
          
          // UI components and styling libraries
          if (id.includes('tailwind') || id.includes('postcss') || id.includes('-ui') || id.includes('ui-')) {
            return 'ui';
          }
          
          // Image processing and Cloudinary - explicitly include cloudinary-core
          if (id.includes('cloudinary') || 
              id.includes('/services/imageOptimizer') || 
              id.includes('/services/deviceImages')) {
            return 'image-processing';
          }
          
          // Data visualization
          if (id.includes('chart.js') || id.includes('vue-chartjs')) {
            return 'charts';
          }
          
          // API and network related code
          if (id.includes('/services/api') || id.includes('/services/supabase') || id.includes('axios')) {
            return 'api';
          }
          
          // Utility libraries - explicitly include lodash
          if (id.includes('lodash') || id.includes('utils')) {
            return 'utils';
          }
          
          // Compression and optimization related code
          if (id.includes('compression') || id.includes('terser')) {
            return 'optimization';
          }
          
          // Critical dependencies that should load first
          if (id.includes('node_modules/vue') || id.includes('node_modules/router')) {
            return 'critical-vendor';
          }
          
          // All other node_modules - split into smaller chunks
          if (id.includes('node_modules/')) {
            // Parse the module name to create more granular chunks
            const moduleMatch = id.match(/node_modules\/(@[^/]+\/[^/]+|[^/]+)/);
            if (moduleMatch) {
              const moduleName = moduleMatch[1];
              // Group smaller modules together
              const moduleSize = moduleName.length;
              if (moduleSize > 10) {
                return `vendor-${moduleName.replace(/[@/-]/g, '_')}`;
              }
            }
            return 'vendor';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
            return 'assets/img/[name].[hash][extname]';
          } 
          
          if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            return 'assets/fonts/[name].[hash][extname]';
          }
          
          if (/css/i.test(extType)) {
            return 'assets/css/[name].[hash][extname]';
          }
          
          return 'assets/[name].[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js'
      }
    },
    // No source map in production for better performance
    sourcemap: false,
    // Increase size limit for chunks to reduce warnings with optimized splitting
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting for optimal loading
    cssCodeSplit: true,
    // Disable brotli size reporting for faster builds
    brotliSize: false,
    // Enable compression for smaller bundles
    assetsInlineLimit: 4096, // 4kb
    // Improve build performance
    reportCompressedSize: false,
    // Configure module preloading for improved runtime performance
    modulePreload: {
      polyfill: true,
    },
  },
  // Server configuration
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    },
    // Optimize hot module replacement
    hmr: {
      overlay: true
    },
    // Enable compression for dev server responses
    cors: true
  },
  // Performance optimization for preview mode
  preview: {
    port: 5000,
    open: true,
    cors: true
  },
  
  // Production specific optimizations
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
    treeShaking: true
  }
})
