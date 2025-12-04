import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check all required environment variables
    const databaseUrl = process.env.DATABASE_URL || ''
    const hasSslMode = databaseUrl.includes('sslmode=require') || databaseUrl.includes('sslmode=prefer')
    
    const envCheck = {
      DATABASE_URL: {
        present: !!process.env.DATABASE_URL,
        value: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 20)}...` : 'MISSING',
        hasSslMode: hasSslMode,
        sslWarning: !hasSslMode && !!process.env.DATABASE_URL ? '⚠️ DATABASE_URL missing SSL mode (add ?sslmode=require)' : null,
      },
      NEXTAUTH_SECRET: {
        present: !!process.env.NEXTAUTH_SECRET,
        length: process.env.NEXTAUTH_SECRET?.length || 0,
        valid: (process.env.NEXTAUTH_SECRET?.length || 0) >= 32,
      },
      NEXTAUTH_URL: {
        present: !!process.env.NEXTAUTH_URL,
        value: process.env.NEXTAUTH_URL || 'MISSING',
        isHttps: process.env.NEXTAUTH_URL?.startsWith('https://'),
        httpsWarning: process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith('https://') 
          ? '⚠️ NEXTAUTH_URL should use HTTPS (not HTTP)' 
          : null,
      },
      JWT_SECRET: {
        present: !!process.env.JWT_SECRET,
        length: process.env.JWT_SECRET?.length || 0,
        valid: (process.env.JWT_SECRET?.length || 0) >= 32,
      },
      CSRF_SECRET: {
        present: !!process.env.CSRF_SECRET,
        length: process.env.CSRF_SECRET?.length || 0,
        valid: (process.env.CSRF_SECRET?.length || 0) >= 32,
      },
      NODE_ENV: process.env.NODE_ENV || 'not set',
      VERCEL: process.env.VERCEL || 'not set',
    }

    // Check optional but important variables
    const optionalCheck = {
      TWILIO_ACCOUNT_SID: !!process.env.TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: !!process.env.TWILIO_AUTH_TOKEN,
      TWILIO_PHONE_NUMBER: !!process.env.TWILIO_PHONE_NUMBER,
      STORJ_ACCESS_KEY_ID: !!process.env.STORJ_ACCESS_KEY_ID,
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
    }

    // Test database connection (safely)
    let dbStatus = 'not tested'
    let dbError = null
    
    if (process.env.DATABASE_URL) {
      try {
        // Dynamic import to avoid errors if Prisma fails to load
        const { prisma } = await import('@/lib/db')
        await prisma.$queryRaw`SELECT 1 as test`
        dbStatus = 'connected'
      } catch (error: any) {
        dbStatus = 'error'
        dbError = error.message
      }
    } else {
      dbStatus = 'skipped - no DATABASE_URL'
    }

    // Determine overall status
    const requiredMissing = [
      !envCheck.DATABASE_URL.present && 'DATABASE_URL',
      !envCheck.NEXTAUTH_SECRET.present && 'NEXTAUTH_SECRET',
      !envCheck.NEXTAUTH_URL.present && 'NEXTAUTH_URL',
      !envCheck.JWT_SECRET.present && 'JWT_SECRET',
      !envCheck.CSRF_SECRET.present && 'CSRF_SECRET',
    ].filter(Boolean)

    const status = requiredMissing.length === 0 && dbStatus === 'connected' ? 'ok' : 'issues'

    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
      required: {
        missing: requiredMissing,
        environment: envCheck,
      },
      optional: optionalCheck,
      database: {
        status: dbStatus,
        error: dbError,
      },
      recommendations: requiredMissing.length > 0 ? [
        `Missing required environment variables: ${requiredMissing.join(', ')}`,
        'Go to Vercel Dashboard → Settings → Environment Variables',
        'Add all required variables and redeploy',
      ] : [],
    }, { 
      status: status === 'ok' ? 200 : 500 
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      message: 'Health check endpoint failed - check Vercel Function Logs for details',
    }, { status: 500 })
  }
}
