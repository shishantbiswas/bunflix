import Navbar from "@/components/navbar";
import "./globals.css";
import { Toaster } from "sonner";
import localFont from 'next/font/local'
import { LoadingIndicator } from "@/components/loading-indicator";
import Providers from "@/context/providers";
import MobileNavbar from "@/components/mobile-navbar";

const inter = localFont({
  src: [
    {
      path: "../assets/fonts/Inter-VariableFont.ttf",
    }
  ]
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={`${inter.className} max-w-7xl mx-auto`}>
          <LoadingIndicator />
          <Navbar />
          <MobileNavbar />
          {children}
          <Toaster closeButton richColors />
        </body>
      </Providers>
    </html>
  );
}
