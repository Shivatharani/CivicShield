"use client";

import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    role: "VIEWER"
  });

  const [error, setError] = useState("");

  const validate = () => {
    if (!form.email.includes("@")) {
      return "Invalid email format";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (form.password !== form.confirm) {
      return "Passwords do not match";
    }

    return null;
  };

  const signup = async () => {
    const err = validate();

    if (err) {
      setError(err);
      return;
    }

    try {
      await axios.post("http://localhost:5000/signup", {
        username: form.email,
        password: form.password,
        role: form.role
      });

      alert("Signup successful!");
      window.location.href = "/login";

    } catch {
      setError("Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded shadow-lg w-96">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {/* EMAIL */}
        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <div className="relative mb-3">
          <input
            type={show ? "text" : "password"}
            className="border p-2 w-full"
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShow(!show)}
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <input
          type={show ? "text" : "password"}
          className="border p-2 w-full mb-3"
          placeholder="Confirm Password"
          onChange={(e) =>
            setForm({ ...form, confirm: e.target.value })
          }
        />

        {/* ROLE */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">
            Select Role
          </label>

          <select
            className="border p-2 w-full"
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="VIEWER">Viewer (Read-only)</option>
            <option value="OPERATOR">Operator (Full Control)</option>
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-500 mb-3 text-sm">
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={signup}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Signup
        </button>

      </div>
    </div>
  );
}