"use client";

import Link from "next/link";
import { FaShieldAlt, FaChartLine, FaLock, FaLink, FaBolt, FaEye, FaChevronRight, FaArrowRight, FaUniversity, FaUserCheck, FaBalanceScale } from "react-icons/fa";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col items-center pb-20 bg-[#f8fafc] text-slate-900">
      
      {/* HERO SECTION */}
      <section className="w-full relative px-6 pt-16 pb-32 md:pt-20 md:pb-40 flex flex-col items-center text-center overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-50 blur-[100px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 blur-[100px] rounded-full opacity-60"></div>

        <div className="max-w-5xl z-10 animate-fade-in-up">
          <div className="flex flex-col items-center mb-12 animate-fade-in group bg-white/50 backdrop-blur-sm p-8 rounded-[40px] border border-amber-50 shadow-2xl shadow-amber-100/20 brightness-110 hover:shadow-amber-300/30 transition-all">
             <div className="w-20 h-20 bg-amber-600 rounded-[28px] flex items-center justify-center text-white text-4xl shadow-2xl shadow-amber-200 mb-6 group-hover:scale-105 transition-transform">
                <FaShieldAlt />
             </div>
             <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900">
                Civic<span className="text-amber-600">Shield</span>
             </h2>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 bg-amber-100 border border-amber-200 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Next-Gen Governance Protocol
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-slate-900">
            Secure Wealth. <br />
            <span className="text-amber-600">Restore Trust.</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            CivicShield is a high-integrity welfare distribution engine powered by 
            cryptographic proofs and automated fraud detection.
          </p>
          
          <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
            <Link 
              href="/signup" 
              className={cn(
                buttonVariants({ size: "lg" }), 
                "text-lg px-10 py-7 h-auto w-full md:w-auto rounded-2xl bg-amber-500 hover:bg-amber-600 shadow-xl shadow-amber-200 transition-all active:scale-95 text-white"
              )}
            >
              Get Started <FaArrowRight className="text-sm ml-2" />
            </Link>
            <Link 
              href="/login" 
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }), 
                "text-lg px-10 py-7 h-auto w-full md:w-auto rounded-2xl border-2 border-amber-200 text-amber-700 hover:bg-amber-50 transition-all active:scale-95"
              )}
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* CORE FEATURES (6-CARD GRID) */}
      <section className="max-w-7xl w-full px-6 py-24">
        <div className="text-center mb-16">
           <h2 className="text-2xl md:text-3xl font-black mb-4">Institutional Core Features</h2>
           <p className="text-slate-500 font-medium max-w-xl mx-auto text-sm">Built on the principles of immutability and radical transparency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="premium-card p-10 flex flex-col items-start group">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 border border-amber-100 group-hover:bg-amber-500 transition-all">
              <FaShieldAlt className="text-amber-600 text-2xl group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Fraud Mitigation</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Neural-network pattern matching detects anomalies before disbursement occurs.
            </p>
          </div>

          <div className="premium-card p-10 flex flex-col items-start group">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 border border-amber-100 group-hover:bg-amber-500 transition-all">
              <FaLink className="text-amber-600 text-2xl group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ledger Integrity</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Every transaction is chained to the previous one, ensuring an immutable audit trail.
            </p>
          </div>

          <div className="premium-card p-10 flex flex-col items-start group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-200 group-hover:bg-[#2563eb] transition-all">
              <FaChartLine className="text-slate-600 text-2xl group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Real-time Audits</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Transparent dashboard for real-time monitoring of budget allocation and health.
            </p>
          </div>

          <div className="premium-card p-10 flex flex-col items-start group">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-8 border border-green-100 group-hover:bg-[#2563eb] transition-all">
              <FaLock className="text-green-600 text-2xl group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Private Identity</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Citizens' sensitive data is hashed, protecting privacy while maintaining accountability.
            </p>
          </div>

          <div className="premium-card p-10 flex flex-col items-start group">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 border border-amber-100 group-hover:bg-[#2563eb] transition-all">
              <FaBolt className="text-amber-600 text-2xl group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Instant Payouts</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Automated smart-contracts trigger disbursements immediately upon eligibility.
            </p>
          </div>

          <div className="premium-card p-10 flex flex-col items-start group">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-8 border border-rose-100 group-hover:bg-[#2563eb] transition-all">
              <FaEye className="text-rose-600 text-2xl group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Radical Clarity</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Publicly verifiable proof that every rupee reached its intended destination.
            </p>
          </div>

        </div>
      </section>

      {/* REAL WORLD USES (NEW SECTION) */}
      <section className="w-full bg-slate-50 py-32 text-slate-900 px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight">
                Empowering Governance <br />
                <span className="text-amber-600">In the Real World.</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium mb-12">
                CivicShield isn't just code. It's a fundamental shift in how public 
                resources are managed and distributed to those who need them most.
              </p>
              
              <div className="space-y-10">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
                    <FaUniversity className="text-xl text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Direct Benefit Transfer (DBT)</h4>
                    <p className="text-slate-500 font-medium">
                      Eliminate the "Leaky Bucket" problem. Funds bypass corrupted intermediaries 
                      and land directly in verified citizen wallets instantly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-200">
                    <FaBalanceScale className="text-xl text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Anti-Corruption Protocol</h4>
                    <p className="text-slate-500 font-medium">
                      Blockchain immutability means records cannot be deleted or altered post-disbursement. 
                      Every official action is visible and audited by the system.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-200">
                    <FaUserCheck className="text-xl text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Automated Social Security</h4>
                    <p className="text-slate-500 font-medium">
                      Dynamic eligibility tracking ensures that when a citizen's income drops, 
                      welfare gates open automatically without manual red tape.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-amber-500/10 blur-[100px] rounded-full"></div>
              <div className="relative bg-white border border-amber-200 rounded-[32px] p-12 overflow-hidden shadow-2xl">
                 <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-amber-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/30">
                       <FaShieldAlt className="text-4xl text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-4">Zero-Leakage Guarantee</h3>
                    <p className="text-slate-500 font-medium mb-10">
                      Our cryptographic gates have protected over <span className="text-amber-600 font-bold">₹10.4Cr</span> in 
                      simulated public funds with <span className="text-green-600 font-bold">100% accuracy</span>.
                    </p>
                    <div className="w-full h-[1px] bg-slate-100 mb-10"></div>
                    <div className="grid grid-cols-2 w-full gap-4">
                       <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                          <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-1">Audit Rate</p>
                          <p className="text-2xl font-black text-slate-900">100%</p>
                       </div>
                       <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                          <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-1">Latency</p>
                          <p className="text-2xl font-black text-slate-900">0.4s</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full py-32 px-6 flex flex-col items-center text-center">
         <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Ready to Secure <br /> the Public Fund?</h2>
         <p className="text-slate-500 text-lg font-medium mb-12 max-w-xl">Join the elite network of transparency operators and citizens.</p>
         <Link 
           href="/signup" 
           className={cn(
             buttonVariants({ size: "lg" }), 
             "text-xl px-12 py-8 h-auto rounded-2xl bg-amber-500 hover:bg-amber-600 shadow-2xl shadow-amber-200 transition-all active:scale-95 text-white"
           )}
         >
           Create Your Account <FaChevronRight className="text-sm ml-2" />
         </Link>
      </section>

    </div>
  );
}
