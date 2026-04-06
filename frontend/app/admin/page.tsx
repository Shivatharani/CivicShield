"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [data, setData] = useState<any>({});

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5000/dashboard",
        {
          headers: {
            Authorization: token, // 🔥 IMPORTANT
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.log(err);
      alert("Session expired. Login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000); // 🔁 auto refresh
    return () => clearInterval(interval);
  }, []);

  // ==========================
  // ADMIN ACTIONS
  // ==========================

  const pause = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/admin/pause",
      {},
      {
        headers: { Authorization: token },
      }
    );

    fetchData();
  };

  const resume = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/admin/unpause",
      {},
      {
        headers: { Authorization: token },
      }
    );

    fetchData();
  };

  const downloadReport = () => {
    window.open("http://localhost:5000/tamper-report");
  };

  // ==========================
  // UI
  // ==========================

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* 🔥 SYSTEM STATUS */}
      <div className="mb-4">
        <span
          className={`px-3 py-1 rounded text-white ${
            data.systemStatus === "ACTIVE"
              ? "bg-green-500"
              : data.systemStatus === "PAUSED"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        >
          {data.systemStatus || "UNKNOWN"}
        </span>

        {data.systemStatus !== "ACTIVE" && (
          <span className="ml-3 text-red-600">
            ({data.freezeReason || "N/A"})
          </span>
        )}
      </div>

      {/* 💰 BUDGET */}
      <div className="mb-2">💰 Budget: ₹{data.budget || 0}</div>

      {/* 📊 STATS */}
      <div>Total Transactions: {data.totalTransactions || 0}</div>
      <div>Approval Rate: {data.approvalRate || 0}%</div>

      {/* 🎛 CONTROLS */}
      <div className="mt-4 space-x-2">

        <button
          onClick={pause}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Emergency Pause
        </button>

        <button
          onClick={resume}
          disabled={data.systemStatus !== "PAUSED"} // ✅ rule
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Resume
        </button>

        {data.systemStatus === "FROZEN" && (
          <button
            onClick={downloadReport}
            className="bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Download Tamper Report
          </button>
        )}
      </div>

      {/* 📜 LAST 10 TRANSACTIONS */}
      <div className="mt-6">
        <h2 className="font-semibold">Last 10 Transactions</h2>

        {data.last10?.length ? (
          data.last10.map((tx: any, i: number) => (
            <div key={i} className="border-b py-2 text-sm">
              {tx.CitizenHash?.slice(0, 8)} | {tx.Scheme} | ₹{tx.Amount} |{" "}
              {tx.status} | {tx.gate}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No transactions yet</p>
        )}
      </div>

      {/* 📂 REGISTRY VIEWER */}
      <div className="mt-6">
        <h2 className="font-semibold">Registry Viewer</h2>

        <div className="max-h-40 overflow-auto text-xs">
          {data.registry?.length ? (
            data.registry.map((u: any, i: number) => (
              <div key={i} className="border-b py-1">
                {u.Citizen_ID} | Claims: {u.Claim_Count} | Last:{" "}
                {u.Last_Claim_Date}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No data</p>
          )}
        </div>
      </div>

    </div>
  );
}