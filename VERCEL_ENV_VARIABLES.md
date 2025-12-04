# Vercel Environment Variables - Complete Checklist

## 🔴 CRITICAL - Must Have (Application won't work without these)

### 1. Database
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```
**Important:**
- Must be a valid PostgreSQL connection string
- Add `?sslmode=require` for production databases
- Database must allow connections from Vercel IPs
- Test the connection string locally first

### 2. NextAuth Configuration
```
NEXTAUTH_URL=https://electkmsorg.vercel.app
NEXTAUTH_SECRET=your-secret-minimum-32-characters-long
```
**Generate secret:**
```bash
openssl rand -base64 32
```

### 3. Security Secrets
```
JWT_SECRET=your-jwt-secret-minimum-32-characters-long
CSRF_SECRET=your-csrf-secret-minimum-32-characters-long
```
**Generate secrets:**
```bash
openssl rand -base64 32
```

### 4. Production Settings
```
NODE_ENV=production
```

## 🟡 IMPORTANT - For Core Features

### OTP/SMS (Twilio)
```
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```
**Note:** Without these, OTP functionality won't work

## 🟢 OPTIONAL - For Additional Features

### File Storage (Storj)
```
STORJ_ACCESS_KEY_ID=your-storj-access-key
STORJ_SECRET_ACCESS_KEY=your-storj-secret-key
STORJ_ENDPOINT=https://gateway.storjshare.io
STORJ_REGION=global
STORJ_BUCKET_NAME=your-bucket-name
```

### Image Hosting (Cloudinary)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Email (Gmail)
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

### Admin Credentials (Optional - can be set in database)
```
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_PHONE=+1234567890
```

## 📋 Step-by-Step Setup in Vercel

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project: `electkmsorg`

### 2. Navigate to Environment Variables
- Click **Settings** tab
- Click **Environment Variables** in the left sidebar

### 3. Add Each Variable
For each variable above:
1. Click **Add New**
2. Enter the **Key** (e.g., `DATABASE_URL`)
3. Enter the **Value** (your actual value)
4. Select environments: **Production**, **Preview**, **Development**
5. Click **Save**

### 4. Important Notes
- **Case-sensitive:** Variable names must match exactly
- **No quotes:** Don't add quotes around values in Vercel
- **Secrets:** Generate strong secrets (32+ characters)
- **Redeploy:** After adding variables, trigger a new deployment

## 🔍 Verify Your Setup

### 1. Check Health Endpoint
Visit: `https://electkmsorg.vercel.app/api/health`

This will show:
- Which environment variables are missing
- Database connection status
- Recommendations for fixes

### 2. Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project
2. Click **Functions** tab
3. Click on any function
4. Check **Logs** tab for errors

## ⚠️ Common Mistakes

### ❌ Wrong
```
DATABASE_URL="postgresql://..."  # Don't use quotes in Vercel
NEXTAUTH_SECRET=short            # Too short (needs 32+ chars)
NEXTAUTH_URL=http://localhost    # Wrong URL for production
```

### ✅ Correct
```
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
NEXTAUTH_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
NEXTAUTH_URL=https://electkmsorg.vercel.app
```

## 🚨 If Still Getting 500 Error

1. **Check `/api/health` endpoint** - It will tell you what's missing
2. **Check Vercel Function Logs** - Look for the exact error message
3. **Verify all CRITICAL variables are set** - Use the checklist above
4. **Redeploy after adding variables** - Changes require a new deployment
5. **Test database connection** - Ensure DATABASE_URL is correct and accessible

## 📝 Quick Copy-Paste Template

Use this template and fill in your values:

```
DATABASE_URL=
NEXTAUTH_URL=https://electkmsorg.vercel.app
NEXTAUTH_SECRET=
JWT_SECRET=
CSRF_SECRET=
NODE_ENV=production
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
STORJ_ACCESS_KEY_ID=
STORJ_SECRET_ACCESS_KEY=
STORJ_ENDPOINT=https://gateway.storjshare.io
STORJ_REGION=global
STORJ_BUCKET_NAME=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GMAIL_USER=
GMAIL_APP_PASSWORD=
```

## 🆘 Still Need Help?

1. Visit `/api/health` to see what's missing
2. Check Vercel Function Logs for exact error
3. Verify database is accessible from internet
4. Ensure all secrets are 32+ characters long

