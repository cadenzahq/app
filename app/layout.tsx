import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '@/components/header/Header'

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cadenza",
  description: "Rehearsal and roster management for community orchestras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
