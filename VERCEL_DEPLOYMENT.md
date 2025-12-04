# Vercel Deployment Guide

## ✅ Completed Setup

1. ✅ Node.js version updated to 24.x
2. ✅ Netlify configurations removed
3. ✅ Vercel configuration added
4. ✅ Error pages created
5. ✅ Prisma build command configured

## 🔍 Debugging 500 Internal Server Error

### Step 1: Check Vercel Build Logs

1. Go to your Vercel dashboard
2. Click on the failed deployment
3. Check the **Build Logs** tab for any errors during build
4. Check the **Function Logs** tab for runtime errors

### Step 2: Verify Environment Variables

**Required Environment Variables in Vercel Dashboard:**

Go to: **Project Settings → Environment Variables**

Add these variables:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=https://your-app.vercel.app
JWT_SECRET=your-jwt-secret-min-32-chars
CSRF_SECRET=your-csrf-secret-min-32-chars
NODE_ENV=production
```

**Optional (if using these features):**
```
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
STORJ_ACCESS_KEY_ID=your-storj-key
STORJ_SECRET_ACCESS_KEY=your-storj-secret
STORJ_ENDPOINT=https://gateway.storjshare.io
STORJ_REGION=global
STORJ_BUCKET_NAME=your-bucket-name
```

### Step 3: Check Prisma Generation

The `vercel.json` includes Prisma generation in the install command. Verify in build logs that you see:
```
Running "prisma generate"
```

If Prisma generation fails, check:
- Database connection string is correct
- Database is accessible from Vercel's IP ranges
- Prisma schema is valid

### Step 4: Common Issues

#### Issue: "DATABASE_URL environment variable is required"
**Solution:** Add `DATABASE_URL` to Vercel environment variables

#### Issue: Prisma Client not found
**Solution:** 
1. Check build logs for Prisma generation
2. Ensure `postinstall` script runs: `"postinstall": "prisma generate"` in package.json

#### Issue: Database connection timeout
**Solution:**
1. Check if your database allows connections from Vercel IPs
2. Verify database URL format
3. Check if database requires SSL (add `?sslmode=require`)

#### Issue: Missing dependencies
**Solution:**
1. Check build logs for missing packages
2. Ensure all dependencies are in `package.json`
3. Run `npm install` locally to verify

### Step 5: Enable Debug Logging

Temporarily add to `vercel.json`:
```json
{
  "env": {
    "NODE_ENV": "production",
    "DEBUG": "true"
  }
}
```

### Step 6: Check Function Logs

1. Go to Vercel Dashboard → Your Project → Functions
2. Click on the function that's failing
3. Check the **Logs** tab for detailed error messages

### Step 7: Test Database Connection

Create a test API route to verify database connection:

```typescript
// src/app/api/test-db/route.ts
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      result 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
```

Visit: `https://your-app.vercel.app/api/test-db`

## 🚀 Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Database accessible from Vercel
- [ ] Prisma generates successfully in build logs
- [ ] No build errors in Vercel logs
- [ ] Function logs show no runtime errors
- [ ] Test database connection with `/api/test-db`

## 📝 Next Steps

1. **Check Vercel Function Logs** - This will show the exact error
2. **Verify Environment Variables** - Most common cause of 500 errors
3. **Test Database Connection** - Use the test route above
4. **Check Build Logs** - Ensure Prisma generates correctly

## 🆘 Still Having Issues?

1. Check Vercel Function Logs for the exact error message
2. Verify all environment variables are set correctly
3. Ensure database allows connections from Vercel
4. Check that Prisma client generates during build

