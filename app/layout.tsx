import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KSENSE",
  description: "Run risk scoring and submit assessment payload",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
