
import "./globals.css";
import ClientWrapper from "./client-wrapper";


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
