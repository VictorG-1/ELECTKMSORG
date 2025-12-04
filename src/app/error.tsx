'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Internal Server Error
          </h2>
          <p className="text-gray-600 mb-6">
            Something went wrong. Please try again later.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-800 font-mono">
                {error.message}
              </p>
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <Button onClick={reset} variant="default">
              Try Again
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="outline">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

