# styled-jsx Fix for Vercel

## Issue
`Cannot find module 'styled-jsx/package.json'` error on Vercel deployment.

## Root Cause
Next.js requires `styled-jsx/package.json` at runtime, but Vercel's output file tracing was excluding it or not including it properly.

## Fixes Applied

### 1. ✅ Removed from External Packages
- Removed `styled-jsx` from `serverComponentsExternalPackages` in `next.config.js`
- This ensures it gets bundled instead of externalized

### 2. ✅ Added Exception in Excludes
- Added `'!node_modules/styled-jsx/**'` to `outputFileTracingExcludes`
- This ensures styled-jsx is NOT excluded by any exclusion patterns

### 3. ✅ Explicitly Included
- Added `outputFileTracingIncludes` to explicitly include styled-jsx
- Pattern: `'node_modules/styled-jsx/**/*'`

### 4. ✅ Verified in Dependencies
- Confirmed `styled-jsx: "^5.1.1"` is in `package.json` dependencies

## Configuration Summary

```javascript
// next.config.js
experimental: {
  outputFileTracingExcludes: {
    '*': [
      // ... other exclusions
      '!node_modules/styled-jsx/**', // Ensure styled-jsx is included
    ],
  },
  outputFileTracingIncludes: {
    '/**': [
      'node_modules/styled-jsx/**/*', // Explicitly include styled-jsx
    ],
  },
  serverComponentsExternalPackages: [
    // ... other packages
    // NOTE: styled-jsx is NOT in this list (must be bundled)
  ],
}
```

## Next Steps

1. **Commit and push changes:**
   ```bash
   git add next.config.js package.json
   git commit -m "Fix styled-jsx module not found error for Vercel"
   git push
   ```

2. **Redeploy on Vercel:**
   - Vercel will automatically trigger a new deployment
   - Monitor build logs to ensure styled-jsx is included

3. **Verify:**
   - Check that the error is resolved
   - Test the application functionality

## If Issue Persists

If the error still occurs after redeploying:

1. **Check build logs** for any warnings about styled-jsx
2. **Verify installation** - ensure `npm install` includes styled-jsx
3. **Clear Vercel cache** - try redeploying with "Clear cache and deploy"
4. **Check node_modules** - verify styled-jsx exists locally after `npm install`

## Additional Notes

- `styled-jsx` is a Next.js internal dependency
- It should be bundled, not externalized
- The package.json file specifically is required by Next.js at runtime
- This fix ensures the entire styled-jsx package is included in the serverless function bundle

