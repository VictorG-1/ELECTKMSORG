'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">500</h1>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Internal Server Error
              </h2>
              <p className="text-gray-600 mb-6">
                A critical error occurred. Please refresh the page.
              </p>
              <button
                onClick={reset}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

