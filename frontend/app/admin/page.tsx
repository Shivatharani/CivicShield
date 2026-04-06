"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";
import { FaPlay, FaPause, FaDownload, FaChartPie, FaWallet, FaHistory, FaUsers, FaShieldAlt, FaCircle, FaTerminal, FaDatabase, FaWrench, FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Admin() {
  const [data, setData] = useState<any>({});
  const [authorized, setAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDescending, setSortDescending] = useState(true);
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
      const res = await axios.get("http://localhost:5000/dashboard", {
        headers: { Authorization: token },
      });
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
    setIsMounted(true);
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  const pause = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5000/admin/pause", {}, { headers: { Authorization: token } });
      showToast("Operational Halt Executed", "success");
      fetchData();
    } catch {
      showToast("Halt Command Failed", "error");
    }
  };

  const resume = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5000/admin/unpause", {}, { headers: { Authorization: token } });
      showToast("System Re-engaged Successfully", "success");
      fetchData();
    } catch {
      showToast("Engagement Command Failed", "error");
    }
  };

  const downloadReport = async () => {
    const token = localStorage.getItem("token");
    showToast("Extracting Investigative Data...", "info");
    try {
      const res = await axios.get("http://localhost:5000/tamper-report", {
        headers: { Authorization: token },
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tamper_report.json");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      showToast("Report Extraction Failed", "error");
    }
  };

  const repairSystem = async () => {
    const token = localStorage.getItem("token");
    showToast("Initiating Cryptographic Repair...", "info");
    try {
      await axios.post("http://localhost:5000/admin/repair-ledger", {}, { headers: { Authorization: token } });
      showToast("System Re-engaged & Integrity Restored", "success");
      fetchData();
    } catch {
      showToast("Repair Operation Failed", "error");
    }
  };

  if (!authorized) return null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20 px-8 lg:px-16 pt-28">
      <div className="w-full max-w-[1750px] mx-auto space-y-12 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
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
              data.systemStatus === "ACTIVE" ? "border-green-100 ring-4 ring-green-50" : "border-red-100 ring-4 ring-red-50"
            }`}>
              <div className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${data.systemStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${data.systemStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{data.systemStatus || "SYNCHRONIZING..."}</span>
            </div>
            {data.freezeReason && (
              <div className="bg-red-600 px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-lg shadow-red-200">
                 <FaCircle className="text-white text-[8px] animate-pulse" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">ALERT: {data.freezeReason}</span>
              </div>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 flex flex-col justify-between group bg-white border-2 border-slate-50 hover:border-amber-400 transition-all rounded-[32px] shadow-sm">
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

          <Card className="p-8 flex flex-col justify-between group bg-white border-2 border-slate-50 hover:border-amber-400 transition-all rounded-[32px] shadow-sm">
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

          <Card className="p-8 flex flex-col justify-between group bg-white border-2 border-slate-50 hover:border-amber-400 transition-all rounded-[32px] shadow-sm">
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

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 bg-white border-2 border-slate-50 rounded-[32px] shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">System Integrity Overview</h3>
              <div className="h-[300px] w-full flex items-center justify-center">
                {isMounted && (data.integrityStats?.some((s: any) => s.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.integrityStats || []} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {data.integrityStats?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : "#ef4444"} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-300 font-black italic">?</div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Integrity Data Logged</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 bg-white border-2 border-slate-50 rounded-[32px] shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Risk Analysis Breakdown</h3>
              <div className="h-[300px] w-full flex items-center justify-center">
                {isMounted && (data.rejectionStats?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.rejectionStats || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="reason" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-300 font-black italic">✓</div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Risk Factors Detected</p>
                  </div>
                ))}
              </div>
            </Card>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <Card className="p-8 bg-white border-2 border-slate-50 rounded-[32px] shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">SYSTEM AUTHORITY</h3>
              <div className="flex flex-col gap-4">
                  <Button variant="outline" onClick={pause} disabled={role !== "OPERATOR" || data.systemStatus === "PAUSED"} className="w-full h-14 rounded-2xl font-black text-[10px] bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"><FaPause className="mr-2" /> EMERGENCY HALT</Button>
                  <Button variant="outline" onClick={resume} disabled={role !== "OPERATOR" || data.systemStatus === "ACTIVE"} className="w-full h-14 rounded-2xl font-black text-[10px] bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white transition-all shadow-sm"><FaPlay className="mr-2" /> SYSTEM RESUME</Button>
                  {data.systemStatus === "TAMPERED" && (
                    <Button variant="outline" onClick={repairSystem} disabled={role !== "OPERATOR"} className="w-full h-14 rounded-2xl font-black text-[10px] bg-amber-500 text-white border-none hover:bg-amber-600 animate-pulse shadow-lg"><FaWrench className="mr-2" /> REPAIR & RE-ENGAGE</Button>
                  )}
                  <Button variant="outline" onClick={downloadReport} disabled={role !== "OPERATOR"} className="w-full h-14 rounded-2xl font-black text-[10px] bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm"><FaDownload className="mr-2" /> EXTRACT EVIDENCE</Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <Card className="p-8 bg-white border-2 border-slate-50 rounded-[32px] shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">REAL-TIME LEDGER FEED</h3>
              <div className="overflow-hidden rounded-2xl border border-slate-100">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="text-[10px] font-black uppercase text-slate-400 py-5 px-6">Entry ID</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-400 py-5">Amount</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-400 py-5">Reason</TableHead>
                      <TableHead className="text-right px-6 py-5 text-[10px] font-black uppercase text-slate-400">Integrity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.last10?.map((tx: any, i: number) => (
                      <TableRow key={i} className="hover:bg-amber-50/20 transition-colors">
                        <TableCell className="font-mono text-[10px] font-bold text-slate-400 px-6 py-5">#{tx.TransactionID}</TableCell>
                        <TableCell className="font-black text-slate-900">₹{tx.Amount?.toLocaleString()}</TableCell>
                        <TableCell className="text-xs font-medium text-slate-500">{tx.Scheme}</TableCell>
                        <TableCell className="text-right px-6 py-5"><span className="bg-green-50 text-green-600 text-[8px] font-black px-2 py-1 rounded-md border border-green-100 uppercase tracking-widest">CHAINED</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            <Card className="p-8 bg-white border-2 border-slate-50 rounded-[32px] shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CITIZEN REGISTRY</h3>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input type="text" placeholder="Search Citizen ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500/20 outline-none" />
                    </div>
                    <button onClick={() => setSortDescending(!sortDescending)} className="h-10 px-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-600 flex items-center gap-2 text-[10px] font-black uppercase hover:bg-amber-600 hover:text-white transition-all">
                      {sortDescending ? <FaSortAmountDown /> : <FaSortAmountUp />} {sortDescending ? "Higher" : "Lower"}
                    </button>
                </div>
              </div>
              <div className="max-h-[400px] overflow-auto custom-scrollbar pr-2 space-y-4">
                {data.registry?.filter((u: any) => u.Citizen_ID?.toLowerCase().includes(searchQuery.toLowerCase())).sort((a: any, b: any) => sortDescending ? parseInt(b.Claim_Count) - parseInt(a.Claim_Count) : parseInt(a.Claim_Count) - parseInt(b.Claim_Count)).map((u: any, i: number) => (
                  <div key={i} className="bg-slate-50/50 p-5 rounded-2xl flex justify-between items-center border border-transparent hover:border-amber-200 hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400 group-hover:text-amber-600 shadow-sm">{i + 1}</div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">CITIZEN NODE</p>
                          <p className="text-sm font-black text-slate-900">ID-{u.Citizen_ID}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">CLAIMS</p>
                       <p className="text-sm font-black text-amber-600">{u.Claim_Count}</p>
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
