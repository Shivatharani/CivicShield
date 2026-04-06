"use client";

export default function Home() {
  return (
    <div className="p-10 text-center">

      <h1 className="text-3xl font-bold mb-4">
        Secure Welfare Distribution System
      </h1>

      <p className="text-gray-600 mb-6">
        Blockchain-backed fraud detection, automated approvals, and real-time monitoring.
      </p>

      <a href="/login">
        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Get Started
        </button>
      </a>

    </div>
  );
}