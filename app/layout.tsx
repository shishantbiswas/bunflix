import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";
import { Toaster } from "sonner";
import { SearchBarFocusProvider } from "@/context/searchContext";
import Providers from "@/context/tanstack-provider";
import { TransitionProvider } from "@/context/transition-context";
import { LoadingIndicator } from "@/components/loading-indicator";

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
            <body className={inter.className}>
              <LoadingIndicator />
              <Navbar />
              {children}
              <Toaster closeButton richColors />
            </body>
          </SearchBarFocusProvider>
        </TransitionProvider>
      </Providers>
    </html>
  );
}
