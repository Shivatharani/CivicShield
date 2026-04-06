"use client";

import Link from "next/link";
import { FaShieldAlt, FaChartBar, FaUserLock, FaGem } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col items-center pb-20">
      
      {/* HERO SECTION */}
      <section className="w-full bg-[#fce4ec44] px-10 py-32 flex flex-col items-center text-center">
        <div className="max-w-4xl">
          <div className="inline-block px-4 py-1.5 mb-6 bg-pink-100 text-pink-600 rounded-full text-xs font-bold uppercase tracking-widest border border-pink-200">
            Secure · Transparent · Automated
          </div>
          <h1 className="text-6xl font-extrabold text-gray-900 mb-8 leading-[1.1]">
            Next Gen Welfare <span className="text-pink-400">Distribution</span> System
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Eliminating leakages and ensuring fair distribution using blockchain-backed verification and AI-driven fraud detection.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="bg-[#acd1af] text-[#2c4c2e] px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all border border-green-200">
              Get Started Now
            </Link>
            <Link href="/login" className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all border border-gray-100">
              Member Login
            </Link>
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section className="max-w-7xl w-full px-10 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="card-pastry p-8 flex flex-col items-center h-full">
            <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 border border-pink-100">
              <FaShieldAlt className="text-pink-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-4">Fraud Protection</h3>
            <p className="text-gray-500 text-center leading-relaxed">
              Real-time pattern matching and data cross-referencing to prevent double claims and identity theft.
            </p>
          </div>

          <div className="card-pastry p-8 flex flex-col items-center h-full border-b-4 border-b-green-200">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
              <FaGem className="text-[#689f38] text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-4">Blockchain Ledger</h3>
            <p className="text-gray-500 text-center leading-relaxed">
              Every transaction is recorded on an immutable ledger to ensure total transparency and tamper-proof auditing.
            </p>
          </div>

          <div className="card-pastry p-8 flex flex-col items-center h-full">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
              <FaChartBar className="text-blue-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-4">Live Monitoring</h3>
            <p className="text-gray-500 text-center leading-relaxed">
              Admins can track distribution status, system health, and budget allocation in real-time from our dashboard.
            </p>
          </div>

        </div>
      </section>

      {/* SYSTEM DETAILS SECTION */}
      <section className="max-w-6xl w-full px-10 py-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-8 text-gray-800 leading-tight">
            How CivicShield Empowers the Community
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#fdf6f0] border border-[#f5e4d2] rounded-full flex items-center justify-center font-bold text-gray-700">1</div>
              <p className="text-gray-600"><span className="font-bold text-gray-800">Direct Benefit Transfer:</span> Funds and resources reach the intended beneficiaries directly without middlemen.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#fdf6f0] border border-[#f5e4d2] rounded-full flex items-center justify-center font-bold text-gray-700">2</div>
              <p className="text-gray-600"><span className="font-bold text-gray-800">Instant Eligibility Check:</span> Multi-gate verification ensures only eligible citizens receive benefits based on income and region.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#fdf6f0] border border-[#f5e4d2] rounded-full flex items-center justify-center font-bold text-gray-700">3</div>
              <p className="text-gray-600"><span className="font-bold text-gray-800">Tamper Evidence:</span> The system automatically freezes if any ledger tampering is detected, protecting public funds.</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="w-full aspect-square bg-[#f5f5f5] rounded-3xl overflow-hidden shadow-inner border border-gray-100 flex items-center justify-center p-12">
            <FaUserLock className="text-[#fce4ec] text-[200px]" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-50 max-w-[200px]">
            <p className="text-xs font-bold text-green-600 mb-1 uppercase tracking-widest">Active Status</p>
            <p className="text-sm font-medium text-gray-700">System secured with 256-bit encryption and blockchain integrity checks.</p>
          </div>
        </div>
      </section>

    </div>
  );
}