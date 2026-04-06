"use client";

import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastProvider } from "../context/ToastContext";
import Navbar from "../components/Navbar";

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <head>
        <title>CivicShield | Secure Welfare Distribution</title>
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