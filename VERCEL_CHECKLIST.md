# Vercel Deployment Checklist

## ✅ Already Configured

- [x] Node.js 24.x in package.json
- [x] Prisma schema with correct binary targets
- [x] Vercel configuration (vercel.json)
- [x] Error pages (error.tsx, global-error.tsx)
- [x] Health check endpoint (/api/health)
- [x] Prisma generation in install command
- [x] Next.js config optimized for Vercel
- [x] Prisma binaries configured for Linux x64

## 🔧 Required Environment Variables

### CRITICAL (Must be set in Vercel Dashboard)

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

#### Database
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```
**Important:** 
- Use `?sslmode=require` for production databases
- Ensure database allows connections from Vercel IPs
- Test connection before deploying

#### Authentication & Security
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-min-32-chars-long
JWT_SECRET=your-jwt-secret-min-32-chars-long
CSRF_SECRET=your-csrf-secret-min-32-chars-long
```

**Generate secure secrets:**
```bash
# Generate random secrets (32+ characters)
openssl rand -base64 32
```

#### Production Settings
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### IMPORTANT (For OTP/SMS functionality)

```
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### OPTIONAL (If using these features)

#### File Storage (Storj)
```
STORJ_ACCESS_KEY_ID=your-storj-access-key
STORJ_SECRET_ACCESS_KEY=your-storj-secret-key
STORJ_ENDPOINT=https://gateway.storjshare.io
STORJ_REGION=global
STORJ_BUCKET_NAME=your-bucket-name
```

#### File Storage (Cloudinary - Legacy)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Email (Gmail)
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

#### Admin Credentials (Optional - can be set via database)
```
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_PHONE=+1234567890
```

## 📋 Pre-Deployment Steps

### 1. Database Setup

**If using a new database:**
```bash
# Run migrations
npx prisma db push

# Seed initial data (if needed)
npx prisma db seed
```

**If using existing database:**
- Verify connection string is correct
- Ensure database is accessible from internet
- Check SSL requirements

### 2. Test Build Locally

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build the application
npm run build

# Test production build locally
npm start
```

### 3. Verify Prisma Binaries

After `prisma generate`, check that these files exist:
- `node_modules/.prisma/client/libquery_engine-linux-x64-gnu.so.node`
- `node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node`

## 🚀 Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 2. Configure Environment Variables

1. In Vercel project settings
2. Go to **Environment Variables**
3. Add all required variables listed above
4. Set them for **Production**, **Preview**, and **Development** as needed

### 3. Configure Build Settings

Vercel should auto-detect from `vercel.json`, but verify:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Install Command:** `npm install --legacy-peer-deps && npx prisma generate`
- **Output Directory:** `.next` (auto-detected)

### 4. Deploy

1. Push your code to GitHub
2. Vercel will automatically deploy
3. Monitor build logs for any errors

## 🔍 Post-Deployment Verification

### 1. Check Health Endpoint

Visit: `https://your-app.vercel.app/api/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": {
    "DATABASE_URL": true,
    "NEXTAUTH_SECRET": true,
    ...
  },
  "database": {
    "status": "connected"
  }
}
```

### 2. Test Database Connection

Visit: `https://your-app.vercel.app/api/test-db` (if you created it)

### 3. Check Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Functions** tab
3. Check for any errors in logs

### 4. Test Application

- Visit the homepage
- Test authentication
- Test database operations
- Check for any console errors

## ⚠️ Common Issues & Solutions

### Issue: 500 Internal Server Error

**Check:**
1. Vercel Function Logs for exact error
2. All environment variables are set
3. Database is accessible
4. Prisma client generated successfully

**Solution:**
- Visit `/api/health` to see what's missing
- Check Vercel logs for detailed error messages

### Issue: Database Connection Failed

**Check:**
1. `DATABASE_URL` is correct
2. Database allows connections from Vercel IPs
3. SSL mode is set correctly (`?sslmode=require`)
4. Database credentials are correct

**Solution:**
- Test connection string locally
- Check database firewall settings
- Verify SSL requirements

### Issue: Prisma Client Not Found

**Check:**
1. Build logs show `prisma generate` running
2. `postinstall` script in package.json
3. Prisma schema is valid

**Solution:**
- Ensure `vercel.json` includes Prisma generation
- Check build logs for Prisma errors

### Issue: Missing Environment Variables

**Check:**
1. All variables are set in Vercel Dashboard
2. Variables are set for correct environment (Production/Preview)
3. Variable names match exactly (case-sensitive)

**Solution:**
- Double-check variable names
- Ensure they're set for Production environment

## 📝 Additional Notes

### Database Connection Pooling

For production databases, consider using connection pooling:
- Supabase: Use connection pooler URL
- Other providers: Use pgbouncer or similar

### Performance Optimization

- Vercel automatically optimizes Next.js
- Edge functions available for API routes if needed
- Consider using Vercel's Edge Network for static assets

### Monitoring

- Use Vercel's built-in analytics
- Check Function Logs regularly
- Monitor database connection health

## ✅ Final Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Database accessible and tested
- [ ] Health endpoint returns "ok"
- [ ] Database connection test passes
- [ ] No errors in Vercel Function Logs
- [ ] Application loads correctly
- [ ] Authentication works
- [ ] Database operations work
- [ ] File uploads work (if using)
- [ ] OTP/SMS works (if using Twilio)

## 🆘 Need Help?

1. Check Vercel Function Logs for exact errors
2. Visit `/api/health` endpoint for diagnostics
3. Review VERCEL_DEPLOYMENT.md for detailed troubleshooting
4. Check Vercel documentation: https://vercel.com/docs

