"use client";

import "./globals.css";
import Link from "next/link";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>

        {/* ✅ GOOGLE PROVIDER WRAP */}
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>

          {/* NAVBAR */}
          <div className="bg-blue-600 text-white p-4 flex justify-between">
            <h1 className="font-bold">CivicShield</h1>

            <div className="space-x-4">
              <Link href="/">Home</Link>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
              <Link href="/apply">Apply</Link>
              <Link href="/admin">Dashboard</Link>
            </div>
          </div>

          {children}

        </GoogleOAuthProvider>

      </body>
    </html>
  );
}