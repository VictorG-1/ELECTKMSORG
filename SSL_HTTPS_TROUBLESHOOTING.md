# SSL/HTTPS Troubleshooting Guide

## 🔍 Common SSL/HTTPS Issues on Vercel

### 1. Database SSL Connection Issues

**Problem:** Database connection fails with SSL errors

**Solution:** Ensure your `DATABASE_URL` includes SSL mode:

```
✅ CORRECT:
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

❌ WRONG:
DATABASE_URL=postgresql://user:password@host:port/database
```

**Common SSL modes:**
- `?sslmode=require` - Requires SSL (recommended for production)
- `?sslmode=prefer` - Prefers SSL but allows non-SSL
- `?sslmode=disable` - Disables SSL (NOT recommended for production)

**For Supabase:**
```
DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres?sslmode=require
```

**For other providers:**
- Check your database provider's documentation
- Most production databases require SSL

### 2. NextAuth URL Configuration

**Problem:** NextAuth redirects fail or authentication doesn't work

**Solution:** Ensure `NEXTAUTH_URL` uses HTTPS:

```
✅ CORRECT:
NEXTAUTH_URL=https://electkmsorg.vercel.app

❌ WRONG:
NEXTAUTH_URL=http://electkmsorg.vercel.app
NEXTAUTH_URL=http://localhost:3000
```

**Important:**
- Vercel automatically provides HTTPS
- Always use `https://` in production
- No trailing slash needed

### 3. Mixed Content Issues

**Problem:** Browser blocks HTTP resources on HTTPS pages

**Solution:** Ensure all external resources use HTTPS:

- Images: `https://...`
- API calls: `https://...`
- External scripts: `https://...`

### 4. Strict-Transport-Security Header

**Status:** ✅ Already configured in `next.config.js`

The app already includes:
```javascript
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
```

This forces browsers to use HTTPS for all future requests.

## 🔧 SSL Configuration Checklist

### Database Connection

1. **Check DATABASE_URL format:**
   ```bash
   # Should include ?sslmode=require
   postgresql://user:pass@host:5432/db?sslmode=require
   ```

2. **Test database connection:**
   ```bash
   # Test locally with SSL
   psql "postgresql://user:pass@host:5432/db?sslmode=require"
   ```

3. **Common database SSL issues:**
   - Database doesn't support SSL → Use `?sslmode=prefer` or `?sslmode=disable` (not recommended)
   - Certificate validation fails → Use `?sslmode=require` (doesn't verify cert)
   - Connection timeout → Check firewall rules

### NextAuth Configuration

1. **Verify NEXTAUTH_URL:**
   ```bash
   # Should be HTTPS
   NEXTAUTH_URL=https://electkmsorg.vercel.app
   ```

2. **Check callback URLs:**
   - NextAuth automatically uses `NEXTAUTH_URL` for callbacks
   - No manual configuration needed if `NEXTAUTH_URL` is correct

### Vercel HTTPS

**Good news:** Vercel automatically provides HTTPS for all deployments!

- ✅ Automatic SSL certificates
- ✅ HTTPS redirects
- ✅ No configuration needed

## 🚨 Common SSL Error Messages

### Error: "SSL connection required"
**Cause:** Database requires SSL but connection string doesn't specify it
**Fix:** Add `?sslmode=require` to DATABASE_URL

### Error: "certificate verify failed"
**Cause:** Database SSL certificate validation fails
**Fix:** Use `?sslmode=require` (doesn't verify certificate) or fix certificate

### Error: "NextAuth redirect mismatch"
**Cause:** NEXTAUTH_URL doesn't match actual domain
**Fix:** Set NEXTAUTH_URL to exact production URL with HTTPS

### Error: "Mixed Content"
**Cause:** Page loads HTTP resources on HTTPS page
**Fix:** Ensure all resources use HTTPS

## 🔍 Diagnostic Steps

### 1. Check Database SSL

Visit: `https://electkmsorg.vercel.app/api/health`

Look for database connection status. If it fails:
- Check DATABASE_URL includes `?sslmode=require`
- Verify database allows SSL connections
- Test connection locally

### 2. Check NextAuth URL

In Vercel Dashboard → Environment Variables:
- Verify `NEXTAUTH_URL` is set to `https://electkmsorg.vercel.app`
- Ensure it uses HTTPS (not HTTP)
- No trailing slash

### 3. Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Functions** tab
3. Check **Logs** for SSL-related errors

### 4. Test Database Connection Locally

```bash
# Test with SSL
psql "postgresql://user:pass@host:5432/db?sslmode=require"

# If that works, the connection string is correct
```

## 📝 Quick Fixes

### Fix 1: Add SSL to Database URL

If your DATABASE_URL is:
```
postgresql://user:pass@host:5432/db
```

Change to:
```
postgresql://user:pass@host:5432/db?sslmode=require
```

### Fix 2: Update NEXTAUTH_URL

If your NEXTAUTH_URL is:
```
http://electkmsorg.vercel.app
```

Change to:
```
https://electkmsorg.vercel.app
```

### Fix 3: Verify All Environment Variables

Go to Vercel Dashboard → Settings → Environment Variables

Ensure:
- ✅ DATABASE_URL includes `?sslmode=require`
- ✅ NEXTAUTH_URL uses `https://`
- ✅ All secrets are 32+ characters

## 🆘 Still Having Issues?

1. **Check `/api/health` endpoint** - Shows database connection status
2. **Check Vercel Function Logs** - Look for SSL error messages
3. **Test database connection locally** - Verify SSL works
4. **Verify environment variables** - All set correctly in Vercel

## ✅ SSL Best Practices

1. **Always use HTTPS in production**
2. **Require SSL for database connections** (`?sslmode=require`)
3. **Use strong secrets** (32+ characters)
4. **Keep certificates updated** (Vercel handles this automatically)
5. **Enable HSTS** (Already configured in next.config.js)

