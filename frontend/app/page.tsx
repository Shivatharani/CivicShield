"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [id, setId] = useState("");
  const [scheme, setScheme] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");

  const submit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/apply", {
        id,
        scheme,
        amount
      });

      setResult(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResult("Error connecting to backend");
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Apply for Welfare Scheme</h2>

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

      <pre className="bg-gray-100 mt-5 p-4 rounded">
        {result}
      </pre>
    </div>
  );
}