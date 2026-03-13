import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Osun Homes - Find Your Perfect Home in Osun State",
  description: "Connect with landlords and agents in Osun State, Nigeria. Find houses, apartments, and properties for rent or sale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50">{children}</main>
          </AuthProvider>
        </ClientBody>
      </body>
    </html>
  );
}
