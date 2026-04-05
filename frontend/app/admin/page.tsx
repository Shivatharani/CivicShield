"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchData = () => {
      axios.get("http://localhost:5000/dashboard")
        .then(res => setData(res.data));
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* STATUS */}
      <div className="mt-4 p-4 bg-white shadow rounded">
        <p><b>Status:</b> {data.status}</p>
        <p><b>Budget:</b> ₹{data.budget}</p>
      </div>

      {/* TRANSACTIONS */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Last 10 Transactions</h2>

        <div className="bg-white p-4 shadow mt-2 rounded">
          <pre className="text-sm">
            {JSON.stringify(data.transactions, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}