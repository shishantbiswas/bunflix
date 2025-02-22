"use client"

import Navbar from "@/components/navbar";
import { Toaster } from "sonner";
import { LoadingIndicator } from "@/components/loading-indicator";
import Providers from "@/context/providers";
import MobileNavbar from "@/components/mobile-navbar";
import localFont from 'next/font/local'
import { useLiveQuery } from "dexie-react-hooks";
import { indexDB } from "@/lib/index-db";

const inter = localFont({
  src: [
    {
      path: "../assets/fonts/Inter-VariableFont.ttf",
    }
  ]
})


export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const widthPreference = useLiveQuery(() => indexDB.userPreferences.get(1))
    return (
    <Providers>
      <body className={`${inter.className}`}>
        <div className={`transition-all duration-[2000ms] mx-auto ${widthPreference && widthPreference.centerContent == true ? "max-w-6xl" : "w-full"}`}>
        <LoadingIndicator />
        <Navbar />
        <MobileNavbar />
        {children}
        <Toaster closeButton richColors />
        </div>
      </body>
    </Providers>
  )
}