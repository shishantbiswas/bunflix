import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";
import { Toaster } from "sonner";
import { SearchBarFocusProvider } from "@/context/searchContext";
import Providers from "@/context/tanstack-provider";
import { TransitionProvider } from "@/context/transition-context";
import { LoadingIndicator } from "@/components/loading-indicator";
import ObserverProvider from "@/context/ObserverProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <TransitionProvider>
          <SearchBarFocusProvider>
            <ObserverProvider>
              <body className={inter.className}>
                <LoadingIndicator />
                <Navbar />
                {children}
                <Toaster closeButton richColors />
              </body>
            </ObserverProvider>
          </SearchBarFocusProvider>
        </TransitionProvider>
      </Providers>
    </html>
  );
}
