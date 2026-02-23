import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className={`${inter.className} antialiased`}>

        <nav style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          borderBottom: "1px solid #e5e5e5",
          backgroundColor: "white"
        }}>

          {/* Logo */}
          <a href="/" style={{
            fontSize: "20px",
            fontWeight: "600",
            textDecoration: "none",
            color: "#111"
          }}>
            Cadenza
          </a>

          {/* Navigation links */}
          <div style={{
            display: "flex",
            gap: "24px"
          }}>

            <a href="/dashboard" style={{
              textDecoration: "none",
              color: "#444"
            }}>
              Dashboard
            </a>

            <a href="/rehearsals" style={{
              textDecoration: "none",
              color: "#444"
            }}>
              Rehearsals
            </a>

            <a href="/members" style={{
              textDecoration: "none",
              color: "#444"
            }}>
              Members
            </a>

          </div>

        </nav>

        <main>
          {children}
        </main>

      </body> 
    </html>
  );
}
