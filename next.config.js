/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'upload.wikimedia.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Skip font optimization during build if network fails (non-blocking)
  optimizeFonts: process.env.SKIP_FONT_OPTIMIZATION !== 'true',
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-icons',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast'
    ],
    // Exclude unnecessary files from build output
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu/**/*',
        'node_modules/@swc/core-linux-x64-musl/**/*',
        'node_modules/@swc/core-darwin-x64/**/*',
        'node_modules/@swc/core-darwin-arm64/**/*',
        'node_modules/@swc/core-win32-x64/**/*',
        'node_modules/@esbuild/**/*',
        'node_modules/terser/**/*',
        'node_modules/webpack/**/*',
        'node_modules/.cache/**/*',
        // Exclude Prisma engines for other platforms
        'node_modules/.prisma/client/libquery_engine-darwin*',
        'node_modules/.prisma/client/libquery_engine-windows*',
        'node_modules/.prisma/client/libquery_engine-debian*',
        'node_modules/.prisma/client/libquery_engine-linux-musl*',
        'node_modules/@prisma/engines/**/query-engine-darwin*',
        'node_modules/@prisma/engines/**/query-engine-windows*',
        'node_modules/@prisma/engines/**/query-engine-debian*',
        'node_modules/@prisma/engines/**/query-engine-linux-musl*',
        'node_modules/@prisma/engines/**/migration-engine*',
        'node_modules/@prisma/engines/**/introspection-engine*',
        'node_modules/@prisma/engines/**/prisma-fmt*',
        // Exclude test files and documentation
        '**/*.test.*',
        '**/*.spec.*',
        '**/__tests__/**/*',
        '**/test/**/*',
        '**/tests/**/*',
        '**/*.map',
        '**/README*',
        '**/CHANGELOG*',
        '**/LICENSE*',
        '**/examples/**',
        '**/example/**',
        '**/docs/**',
        '**/documentation/**',
        // Exclude TypeScript source files (keep only .d.ts)
        '**/*.ts',
        '!**/*.d.ts',
        // Exclude unnecessary Radix UI files
        'node_modules/@radix-ui/**/*.stories.*',
        'node_modules/@radix-ui/**/README*',
        'node_modules/@radix-ui/**/*.test.*',
        'node_modules/@radix-ui/**/__tests__/**',
        // Exclude large unused dependencies
        'node_modules/recharts/**/*.ts',
        'node_modules/recharts/**/examples/**',
        'node_modules/recharts/**/*.test.*',
        // Exclude lucide-react source files
        'node_modules/lucide-react/**/*.ts',
        'node_modules/lucide-react/**/*.tsx',
        '!node_modules/lucide-react/**/*.d.ts',
        // Exclude environment files (use Vercel environment variables)
        '.env*',
        // Exclude AWS SDK documentation
        'node_modules/@aws-sdk/**/*.md',
        'node_modules/@aws-sdk/**/README*',
        'node_modules/@aws-sdk/**/CHANGELOG*',
      ],
    },
    // External packages for server components (Vercel handles these automatically)
    serverComponentsExternalPackages: [
      'prisma',
      '@prisma/client',
      'pg',
      'bcryptjs',
      'jsonwebtoken',
      'nodemailer',
      'csv-parser',
      'uuid',
      'zod',
      '@aws-sdk/client-s3',
      '@aws-sdk/s3-request-presigner',
      '@aws-sdk/client-sso',
      '@aws-sdk/client-sso-oidc',
      '@aws-sdk/credential-providers',
      'cloudinary',
      'twilio',
      'next-auth',
      '@hookform/resolvers',
      'react-hook-form',
      'styled-jsx'
    ],
  },
  transpilePackages: [],
  // Enable SWC minification
  swcMinify: true,
  // Additional minification settings
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep errors and warnings
    } : false,
  },
  // Optimize bundle
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Enable tree shaking for client
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
      
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            chunks: 'all',
            priority: 15,
          },
        },
      }
    }
    
    return config
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/api/admin/view-document',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Enable compression
  compress: true,
  // Skip type checking during build for speed
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Force all pages to be dynamic (prevent static generation)
  // This ensures no pages try to access database during build
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig
