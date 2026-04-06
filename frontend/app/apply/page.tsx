"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";
import { FaFileSignature } from "react-icons/fa";

export default function Apply() {
  const [id, setId] = useState("");
  const [scheme, setScheme] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<any>(null);
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
    }
  }, []);

  const submit = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5000/apply",
        { id, scheme, amount },
        {
          headers: { Authorization: token }
        }
      );

      setResult(res.data);

      if (res.data.status === "SUCCESS") {
        showToast("Application submitted successfully!", "success");
      } else {
        showToast(`Application error: ${res.data.status || "Check details"}`, "error");
      }
    } catch (err: any) {
      showToast("Server error. Please try again.", "error");
    }
  };

  return (
    <div className="flex flex-col items-center py-20 min-h-screen bg-[#fdf6f0] px-6">

      <div className="bg-white shadow-2xl p-10 rounded-3xl w-full max-w-xl border border-gray-100">

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center border border-pink-100">
            <FaFileSignature className="text-pink-400 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Apply for Scheme</h2>
            <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">Welfare Distribution Gate</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-bold text-xs uppercase tracking-widest text-gray-400 ml-1">Citizen ID</label>
            <input className="border border-gray-100 bg-gray-50 p-4 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium"
              placeholder="Enter Citizen ID"
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-xs uppercase tracking-widest text-gray-400 ml-1">Scheme Name</label>
            <input className="border border-gray-100 bg-gray-50 p-4 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium"
              placeholder="e.g. Health Support"
              onChange={(e) => setScheme(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-xs uppercase tracking-widest text-gray-400 ml-1">Requested Amount (₹)</label>
            <input className="border border-gray-100 bg-gray-50 p-4 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium text-lg"
              placeholder="0.00"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button onClick={submit}
            className="bg-[#acd1af] text-[#2c4c2e] w-full py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all active:scale-95 mt-6 border border-green-200">
            Submit Application
          </button>
        </div>

        {result && (
          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Response Data</h3>
            <pre className="bg-gray-50 p-4 rounded-xl text-xs font-mono border border-gray-100 max-h-40 overflow-auto whitespace-pre-wrap text-gray-700">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}