"use client";

import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastProvider } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });


export default function RootLayout({ children }: any) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <title>CivicShield</title>
        <link rel="icon" href="/favicon.jpeg" />
        <meta name="description" content="Blockchain-backed fraud detection and automated welfare approvals." />
      </head>
      <body>
        <ToastProvider>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
          </GoogleOAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
