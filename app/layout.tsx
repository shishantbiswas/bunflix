import Navbar from "@/components/navbar";
import "./globals.css";
import { Toaster } from "sonner";
import localFont from 'next/font/local'
import { LoadingIndicator } from "@/components/loading-indicator";
import Providers from "@/context/providers";

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
