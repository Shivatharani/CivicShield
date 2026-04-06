"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Apply() {
  const [id, setId] = useState("");
  const [scheme, setScheme] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      window.location.href = "/login";
    }
  }, []);

  const submit = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:5000/apply",
      { id, scheme, amount },
      {
        headers: { Authorization: token }
      }
    );

    setResult(res.data);
  };

  return (
    <div className="p-10 max-w-xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">Apply for Scheme</h2>

      <input className="border p-2 w-full mb-3"
        placeholder="Citizen ID"
        onChange={(e) => setId(e.target.value)}
      />

      <input className="border p-2 w-full mb-3"
        placeholder="Scheme"
        onChange={(e) => setScheme(e.target.value)}
      />

      <input className="border p-2 w-full mb-3"
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={submit}
        className="bg-blue-600 text-white px-4 py-2">
        Submit
      </button>

      <pre className="mt-4 bg-gray-100 p-3 text-xs">
        {JSON.stringify(result, null, 2)}
      </pre>

    </div>
  );
}