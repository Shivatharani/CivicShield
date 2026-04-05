"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [id, setId] = useState("");
  const [scheme, setScheme] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<any>(null);

  const submit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/apply", {
        id,
        scheme,
        amount
      });

      setResult(res.data);
    } catch (err) {
      setResult({ status: "ERROR", message: "Backend not reachable" });
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">
        Apply for Welfare Scheme
      </h2>

      {/* 🚨 SYSTEM FREEZE ALERT */}
      {result?.status === "SYSTEM_FROZEN" && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">
          🚨 SYSTEM FROZEN: {result.reason}
        </div>
      )}

      {/* ✅ SUCCESS MESSAGE */}
      {result?.status === "SUCCESS" && (
        <div className="bg-green-600 text-white p-4 rounded mb-4">
          ✅ Transaction Successful
        </div>
      )}

      {/* ⚠️ ERROR / FRAUD MESSAGE */}
      {result &&
        result.status !== "SUCCESS" &&
        result.status !== "SYSTEM_FROZEN" && (
          <div className="bg-yellow-500 text-white p-4 rounded mb-4">
            ⚠️ {result.status}
          </div>
        )}

      <input
        className="border p-2 w-full mb-3"
        placeholder="Citizen ID"
        onChange={(e) => setId(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Scheme"
        onChange={(e) => setScheme(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Request
      </button>

      {/* 🔍 RAW RESPONSE (for debugging/demo) */}
      <pre className="bg-gray-100 mt-5 p-4 rounded text-xs">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}