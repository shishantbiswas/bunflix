import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SearchBarFocusProvider } from "@/context/searchContext";
import { Analytics } from "@vercel/analytics/react";
import Providers from "@/context/tanstack-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <SearchBarFocusProvider>
          <body className={inter.className}>
            <Navbar />
            {children}
            <SpeedInsights />
            <Analytics />
            <Toaster closeButton richColors />
          </body>
        </SearchBarFocusProvider>
      </Providers>
    </html>
  );
}
