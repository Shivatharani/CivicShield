"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between">
      <h1>CivicShield</h1>

      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/apply">Apply</Link>
        <Link href="/admin">Dashboard</Link>
      </div>
    </div>
  );
}