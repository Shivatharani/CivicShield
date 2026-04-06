"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";
import { FaPlay, FaPause, FaDownload, FaChartPie, FaWallet, FaHistory, FaUsers } from "react-icons/fa";

export default function Admin() {
  const [data, setData] = useState<any>({});
  const { showToast } = useToast();

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Access Denied: Login required", "error");
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
    } catch (err) {
      console.log(err);
      showToast("Session expired. Please login again.", "error");
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
      showToast("System Paused successfully", "success");
      fetchData();
    } catch {
      showToast("Failed to pause system", "error");
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
      showToast("System Resumed successfully", "success");
      fetchData();
    } catch {
      showToast("Failed to resume system", "error");
    }
  };

  const downloadReport = () => {
    showToast("Downloading Tamper Report...", "info");
    window.open("http://localhost:5000/tamper-report");
  };

  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  return (
    <div className="flex flex-col items-center py-12 min-h-screen bg-[#fdf6f0] px-6">
      
      <div className="max-w-7xl w-full">
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-500 font-medium">Real-time system health and transaction monitoring</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border shadow-sm flex items-center gap-2 ${
              data.systemStatus === "ACTIVE" 
                ? "bg-green-50 border-green-200 text-green-700" 
                : data.systemStatus === "PAUSED"
                ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                data.systemStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500"
              }`}></div>
              {data.systemStatus || "Syncing..."}
            </span>
            {data.freezeReason && (
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest leading-none bg-red-100 p-2 px-3 rounded-lg border border-red-200">
                {data.freezeReason}
              </span>
            )}
          </div>
        </div>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-pastry border-b-4 border-b-blue-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                <FaWallet className="text-blue-400" />
              </div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-50 p-1 px-2 rounded-lg">Available Funds</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-800 tracking-tight">₹{data.budget?.toLocaleString() || 0}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Remaining Budget</p>
            </div>
          </div>

          <div className="card-pastry border-b-4 border-b-pink-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center border border-pink-100">
                <FaHistory className="text-pink-400" />
              </div>
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest bg-pink-50 p-1 px-2 rounded-lg">Total Traffic</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-800 tracking-tight">{data.totalTransactions || 0}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Process Transactions</p>
            </div>
          </div>

          <div className="card-pastry border-b-4 border-b-[#acd1af] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-[#f1f8e9] rounded-xl flex items-center justify-center border border-[#dcedc8]">
                <FaChartPie className="text-[#689f38]" />
              </div>
              <span className="text-[10px] font-bold text-[#689f38] uppercase tracking-widest bg-[#f1f8e9] p-1 px-2 rounded-lg">Service Level</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-800 tracking-tight">{data.approvalRate || 0}%</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Success Rate</p>
            </div>
          </div>
        </div>

        {/* CONTROLS & TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ACTIONS (Left Sidebar) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-pastry">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                System Controls {role !== "OPERATOR" && <span className="text-[8px] bg-red-100 text-red-500 p-1 rounded">RESTRICTED</span>}
              </h3>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={pause}
                  disabled={role !== "OPERATOR" || data.systemStatus === "PAUSED"}
                  className="bg-red-50 text-red-500 w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 border border-red-100 hover:bg-red-100 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <FaPause className="text-xs" /> Emergency Pause
                </button>

                <button
                  onClick={resume}
                  disabled={role !== "OPERATOR" || data.systemStatus !== "PAUSED"}
                  className="bg-[#acd1af] text-[#2c4c2e] w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 border border-[#c5e1a5] hover:shadow-md transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <FaPlay className="text-xs" /> Resume System
                </button>

                <button
                  onClick={downloadReport}
                  disabled={role !== "OPERATOR" || data.systemStatus !== "FROZEN"}
                  className="bg-yellow-50 text-yellow-700 w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 border border-yellow-100 hover:bg-yellow-100 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <FaDownload className="text-xs" /> Tamper Report
                </button>
              </div>
            </div>

            <div className="card-pastry p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                Your Access Level
              </h3>
              <div className="bg-[#f5f5f5] p-4 rounded-2xl border border-gray-100">
                <p className="text-sm font-extrabold text-gray-700 capitalize flex items-center gap-3">
                  <FaUsers className="text-pink-400" /> {role?.toLowerCase() || "Guest"}
                </p>
                <p className="text-[10px] text-gray-400 mt-1 font-medium italic">
                  {role === "OPERATOR" ? "Full administrative authority enabled." : "Read-only access granted."}
                </p>
              </div>
            </div>
          </div>

          {/* TABLES (Right Side) */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="card-pastry overflow-hidden">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Recent Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-gray-50">
                      <th className="pb-4 font-bold">Citizen Hash</th>
                      <th className="pb-4 font-bold">Scheme</th>
                      <th className="pb-4 font-bold">Amount</th>
                      <th className="pb-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.last10?.map((tx: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-mono text-[10px] text-gray-500">{tx.CitizenHash?.slice(0, 16)}...</td>
                        <td className="py-4 font-bold text-gray-700">{tx.Scheme}</td>
                        <td className="py-4 font-bold text-gray-800">₹{tx.Amount}</td>
                        <td className="py-4 font-bold">
                          <span className={`px-3 py-1 rounded-full text-[10px] ${
                            tx.status === "SUCCESS" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!data.last10?.length && (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-gray-400 font-medium italic">No recent transactions discovered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-pastry">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Registry Insight</h3>
              <div className="max-h-60 overflow-auto space-y-4 pr-2 custom-scrollbar">
                {data.registry?.map((u: any, i: number) => (
                  <div key={i} className="bg-gray-50/50 p-4 rounded-2xl flex justify-between items-center border border-gray-100 hover:border-pink-100 transition-all">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{u.Citizen_ID}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Claims: {u.Claim_Count}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Last Sync</p>
                      <p className="text-[10px] font-bold text-gray-600">{u.Last_Claim_Date || "No Claims recorded"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}