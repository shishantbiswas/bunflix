import "./globals.css";
import ClientWrapper from "./client-wrapper";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Nextflix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClientWrapper>
        {children}
      </ClientWrapper>
      <Script
        defer
        id="umami"
        src="https://umami.service.coolify.bsws.in/script.js"
        data-do-not-track="true"
        data-domains="bunflix.bsws.in"
        data-website-id="37066bad-b029-48d9-bef5-d3e9abb151cc">
      </Script>
    </html>
  );
}
