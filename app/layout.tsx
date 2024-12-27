import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";
import { Toaster } from "sonner";

import { LoadingIndicator } from "@/components/loading-indicator";
import Providers from "@/context/providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <LoadingIndicator />
          <Navbar />
          {children}
          <Toaster closeButton richColors />
        </body>
      </Providers>
    </html>
  );
}
