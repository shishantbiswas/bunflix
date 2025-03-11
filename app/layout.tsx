import "./globals.css";
import ClientWrapper from "./client-wrapper";
import { Metadata } from "next";

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
    </html>
  );
}
