"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";
import { FaFileSignature, FaChevronRight, FaArrowRight, FaShieldAlt, FaUserCircle, FaBuilding, FaWallet, FaInfoCircle, FaPaperPlane } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Apply() {
  const [formData, setFormData] = useState({
    id: "",
    scheme: "",
    amount: "",
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Access Denied: Login required", "error");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }

    const role = localStorage.getItem("role");
    if (role !== "OPERATOR") {
      showToast("Access Denied: Operators only", "error");
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1500);
    } else {
      setAuthorized(true);
    }
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!formData.id || !formData.scheme || !formData.amount) {
      showToast("Please fill all required fields", "info");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/apply",
        { 
          id: formData.id, 
          scheme: formData.scheme, 
          amount: formData.amount 
        },
        {
          headers: { Authorization: token }
        }
      );

      setResult(res.data);

      if (res.data.status === "SUCCESS") {
        showToast("Application verified and committed to ledger!", "success");
        setFormData({ ...formData, id: "" });
      } else {
        showToast(`Verification Failed: ${res.data.status || "Check details"}`, "error");
      }
    } catch (err: any) {
      showToast("Cryptographic node error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) return null;

  return (
    <div className="flex flex-col items-center py-24 min-h-screen bg-[#f8fafc] text-slate-900 px-6">
      
      <div className="max-w-3xl w-full z-10 animate-fade-in-up mt-10">
        
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-[9px] font-black uppercase tracking-widest text-amber-600 mb-6">
               <FaShieldAlt /> Secure Transmission Protocol
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">Application Gateway</h1>
            <p className="text-slate-500 font-medium">Immutable benefit disbursement request system</p>
        </div>

        <Card className="border-2 border-amber-100 shadow-2xl shadow-amber-100/50 rounded-[32px] overflow-hidden bg-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 blur-[60px] rounded-full translate-x-10 translate-y-[-20px]"></div>
          
          <CardContent className="p-10 md:p-16">
            <form onSubmit={handleApply} className="space-y-8 relative z-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Citizen Identification</label>
                    <div className="relative">
                      <FaUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-amber-600 z-10" />
                      <Input
                        className="bg-slate-50 border border-slate-200 h-14 w-full rounded-xl focus-visible:ring-amber-600 transition-all font-bold placeholder-slate-300 pl-12"
                        placeholder="UID-8829-XXXX"
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        required
                      />
                    </div>
                </div>

                <div>
                    <label className="block mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Welfare Protocol</label>
                    <div className="relative">
                      <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 z-10" />
                      <Input
                        className="bg-slate-50 border border-slate-200 h-14 w-full rounded-xl focus-visible:ring-amber-600 transition-all font-bold text-slate-700 placeholder-slate-300 pl-12"
                        placeholder="Enter Welfare Protocol Name"
                        value={formData.scheme}
                        onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                        required
                      />
                    </div>
                </div>
              </div>

              <div>
                <label className="block mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Disbursement Value (₹)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black z-10">₹</span>
                    <Input
                      type="number"
                      className="bg-slate-50 border border-slate-200 h-14 w-full rounded-xl focus-visible:ring-amber-600 transition-all font-black text-xl text-amber-600 placeholder-slate-300 pl-10"
                      placeholder="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                </div>
                <div className="mt-4 flex items-start gap-2 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <FaInfoCircle className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-wide">
                      Disclaimer: Any fraudulent entries will be flagged by the automated audit engine and may lead to permanent exclusion from the protocol.
                    </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-xl bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-200 transition-all active:scale-95"
              >
                {loading ? "TRANSMITTING..." : "SUBMIT TO LEDGER"} <FaPaperPlane className="text-sm ml-2" />
              </Button>
            </form>

            {result && (
              <div className="mt-12 animate-fade-in-up border-t border-slate-100 pt-10">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${result.status === "SUCCESS" ? "bg-green-500" : "bg-red-500"}`}></div>
                  LEDGER RESPONSE DATA
                </h3>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl overflow-hidden relative">
                  <div className={`absolute top-0 left-0 w-full h-[2px] ${result.status === "SUCCESS" ? "bg-green-500" : "bg-red-500"}`}></div>
                  <pre className="text-xs font-mono whitespace-pre-wrap text-amber-100 opacity-80 max-h-60 overflow-auto custom-scrollbar">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 text-slate-400 font-bold text-xs">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              ENCRYPTED END-TO-END
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              IMMUTABLE RECORDING
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              VERIFIED IDENTITY
           </div>
        </div>

      </div>

    </div>
  );
}
