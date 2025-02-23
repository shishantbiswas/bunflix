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
  const settings = useLiveQuery(() => indexDB.userPreferences.get(1))
  if (!settings) {
    indexDB.userPreferences.add({
      id: 1,
      disableFloatingNavbar: false,
      centerContent: false,
      hideWatchedShows: false,
      hideWatchedShowsInSearch: false,
      lang: "all"
    })
  }

    return (
    <Providers>
      <body className={`${inter.className}`}>
        <div className={`transition-all duration-[1500ms] mx-auto ${settings && settings.centerContent == true ? "xl:w-[76rem]" : "w-full"}`}>
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