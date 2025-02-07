import { RefreshCcw } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
    title: 'Error - Nextflix',
    description: 'Nextflix clone built with Next.js and Tailwind CSS',
}

type SearchParams = Promise<{ err: string }>

export default async function Error({ searchParams }: { searchParams: SearchParams }) {
    const err = (await searchParams).err
    return (
        <div className="min-h-screen flex flex-col items-center justify-center   p-4">
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
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{err}</h1>
                <p className="mt-4 text-base text-white/60">
                    We apologize for the inconvenience. Please try again later or refresh the page.
                </p>
                <div className="mt-8">
                    <Link
                        href={'/'}
                        className="inline-flex items-center px-4 py-2"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

