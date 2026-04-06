"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";
import { FaPlay, FaPause, FaDownload, FaChartPie, FaWallet, FaHistory, FaUsers, FaShieldAlt, FaCircle, FaTerminal, FaDatabase } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Admin() {
  const [data, setData] = useState<any>({});
  const [authorized, setAuthorized] = useState(false);
  const { showToast } = useToast();

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Access Denied: Identification Required", "error");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5000/dashboard",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setData(res.data);
      setAuthorized(true);
    } catch (err) {
      showToast("Session Timed Out: Please re-authorize", "error");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  const pause = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/admin/pause",
        {},
        {
          headers: { Authorization: token },
        }
      );
      showToast("Operational Halt Executed", "success");
      fetchData();
    } catch {
      showToast("Halt Command Failed", "error");
    }
  };

  const resume = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/admin/unpause",
        {},
        {
          headers: { Authorization: token },
        }
      );
      showToast("System Re-engaged Successfully", "success");
      fetchData();
    } catch {
      showToast("Engagement Command Failed", "error");
    }
  };

  const downloadReport = () => {
    showToast("Extracting Investigative Data...", "info");
    window.open("http://localhost:5000/tamper-report");
  };

  if (!authorized) return null;

  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  return (
    <div className="flex flex-col items-center py-12 min-h-screen bg-[#f8fafc] text-slate-900 px-6 relative">
      
      <div className="max-w-7xl w-full z-10 animate-fade-in-up mt-16">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <FaTerminal />
               </div>
               <h1 className="text-4xl font-black tracking-tight">Command Center</h1>
            </div>
            <p className="text-slate-500 font-medium ml-1">Governance node status and immutable ledger analytics</p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`bg-white border px-5 py-2.5 flex items-center gap-3 rounded-xl shadow-sm ${
              data.systemStatus === "ACTIVE" 
                ? "border-green-100 ring-4 ring-green-50" 
                : "border-red-100 ring-4 ring-red-50"
            }`}>
              <div className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                   data.systemStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                   data.systemStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                }`}></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{data.systemStatus || "SYNCHRONIZING..."}</span>
            </div>

            {data.freezeReason && (
              <div className="bg-red-600 px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-lg shadow-red-200">
                 <FaCircle className="text-white text-[8px] animate-pulse" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                    ALERT: {data.freezeReason}
                 </span>
              </div>
            )}
          </div>
        </div>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="p-8 flex flex-col justify-between group bg-white border-2 border-amber-100 hover:border-amber-400 transition-all rounded-[24px]">
            <div className="flex justify-between items-start mb-10">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                <FaWallet className="text-amber-600 group-hover:text-white text-xl" />
              </div>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">TREASURY</span>
            </div>
            <div>
              <p className="text-4xl font-black text-slate-900 tracking-tight mb-1">₹{data.budget?.toLocaleString() || 0}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Available Allocation</p>
            </div>
          </Card>

          <Card className="p-8 flex flex-col justify-between group bg-white border-2 border-amber-100 hover:border-amber-400 transition-all rounded-[24px]">
            <div className="flex justify-between items-start mb-10">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                <FaDatabase className="text-amber-600 group-hover:text-white text-xl" />
              </div>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">LEDGER DEPTH</span>
            </div>
            <div>
              <p className="text-4xl font-black text-slate-900 tracking-tight mb-1">{data.totalTransactions || 0}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verified Entries</p>
            </div>
          </Card>

          <Card className="p-8 flex flex-col justify-between group bg-white border-2 border-amber-100 hover:border-amber-400 transition-all rounded-[24px]">
            <div className="flex justify-between items-start mb-10">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                <FaChartPie className="text-amber-600 group-hover:text-white text-xl" />
              </div>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">MATCH RATE</span>
            </div>
            <div>
              <p className="text-4xl font-black text-slate-900 tracking-tight mb-1">{data.approvalRate || 0}%</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Algorithmic Confidence</p>
            </div>
          </Card>
        </div>

        {/* CONTROLS & TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ACTIONS (Left Sidebar) */}
          <div className="lg:col-span-1 space-y-8">
            <div className="premium-card p-8 bg-white border-2 border-slate-50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                SYSTEM AUTHORITY {role !== "OPERATOR" && <span className="text-[8px] bg-red-50 text-red-600 px-2.5 py-1 rounded-md border border-red-100">RESTRICTED</span>}
              </h3>
              
              <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    onClick={pause}
                    disabled={role !== "OPERATOR" || data.systemStatus === "PAUSED"}
                    className="w-full h-14 rounded-xl font-black text-xs flex items-center justify-center gap-3 bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <FaPause className="text-[10px]" /> EMERGENCY HALT
                  </Button>

                  <Button
                    variant="outline"
                    onClick={resume}
                    disabled={role !== "OPERATOR" || data.systemStatus !== "PAUSED"}
                    className="w-full h-14 rounded-xl font-black text-xs flex items-center justify-center gap-3 bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-600 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <FaPlay className="text-[10px]" /> RESUME OPERATIONS
                  </Button>

                  <Button
                    variant="outline"
                    onClick={downloadReport}
                    disabled={role !== "OPERATOR" || data.systemStatus !== "FROZEN"}
                    className="w-full h-14 rounded-xl font-black text-xs flex items-center justify-center gap-3 bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <FaDownload className="text-[10px]" /> EXTRACT EVIDENCE
                  </Button>
              </div>
            </div>

            <Card className="p-8 bg-amber-100 border-2 border-amber-200 shadow-xl rounded-[24px]">
              <h3 className="text-[10px] font-black text-amber-800 uppercase tracking-[0.2em] mb-6">
                CLEARED IDENTITY
              </h3>
              <div className="bg-white/40 p-5 rounded-2xl border border-white group hover:border-amber-500/50 transition-all">
                <div className="flex items-center gap-4 mb-3">
                   <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <FaUsers />
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{role || "GUEST"}</p>
                      <p className="text-[9px] text-amber-700 font-bold uppercase tracking-widest mt-0.5">Permissions Level</p>
                   </div>
                </div>
                <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden mt-4">
                   <div className={`h-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)] transition-all duration-1000 ${role === "OPERATOR" ? "w-full" : "w-1/3"}`}></div>
                </div>
              </div>
            </Card>
          </div>

          {/* TABLES (Right Side) */}
          <div className="lg:col-span-2 space-y-8">
            
            <Card className="p-8 bg-white border-2 border-amber-50 rounded-[24px]">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">REAL-TIME LEDGER FEED</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-amber-50 mx-[-32px]">
                      <TableHead className="pb-5 text-slate-400">HASH_KEY</TableHead>
                      <TableHead className="pb-5 text-slate-400">SCHEME</TableHead>
                      <TableHead className="pb-5 text-slate-400">AMOUNT</TableHead>
                      <TableHead className="pb-5 text-right text-slate-400">VERIFICATION</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.last10?.map((tx: any, i: number) => (
                      <TableRow key={i} className="group hover:bg-amber-50/50 transition-colors border-amber-50">
                        <TableCell className="py-5 font-mono text-[10px] text-slate-400 group-hover:text-amber-600">{tx.CitizenHash?.slice(0, 16)}...</TableCell>
                        <TableCell className="py-5 font-black text-slate-900 group-hover:text-amber-600 text-[10px] uppercase">{tx.Scheme}</TableCell>
                        <TableCell className="py-5 font-black text-slate-900 text-lg">₹{tx.Amount}</TableCell>
                        <TableCell className="py-5 text-right">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest border ${
                            tx.status === "SUCCESS" 
                            ? "bg-green-50 text-green-600 border-green-100" 
                            : "bg-red-50 text-red-600 border-red-100"
                          }`}>
                            {tx.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!data.last10?.length && (
                      <TableRow>
                        <TableCell colSpan={4} className="py-12 text-center text-slate-300 font-bold italic text-sm">No synchronized entries found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            <Card className="p-8 bg-white border-2 border-amber-50 rounded-[24px]">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">CITIZEN REGISTRY</h3>
              <div className="max-h-64 overflow-auto space-y-4 pr-3 custom-scrollbar">
                {data.registry?.map((u: any, i: number) => (
                  <div key={i} className="bg-amber-50/30 p-5 rounded-2xl flex justify-between items-center border border-transparent hover:border-amber-200 hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-white border border-amber-100 flex items-center justify-center font-black text-[10px] text-slate-400 group-hover:text-amber-600 transition-all shadow-sm">
                          {i + 1}
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-900 tracking-widest group-hover:text-amber-600 transition-all">{u.Citizen_ID}</p>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">CLAIMS: {u.Claim_Count}</p>
                       </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-amber-600 font-black uppercase tracking-widest mb-1">LAST_ACTIVITY</p>
                      <p className="text-[10px] font-black text-slate-900">{u.Last_Claim_Date || "N/A"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>

        </div>

      </div>

    </div>
  );
}
