"use client"
 
import { RefreshCcw } from 'lucide-react'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center ">
        <svg
          className="mx-auto h-24 w-24 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Oops! Something went wrong</h1>
        <p className="mt-4 text-base text-white/60">
          {error.message}
        </p>
        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  )
}