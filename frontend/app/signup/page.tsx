"use client";

import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import { useToast } from "../../context/ToastContext";

export default function Signup() {
  const [show, setShow] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    role: "VIEWER"
  });

  const [error, setError] = useState("");

  const validate = () => {
    if (!form.email.includes("@")) return "Invalid email format";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirm) return "Passwords do not match";
    return null;
  };

  const signup = async () => {
    const err = validate();
    if (err) {
      setError(err);
      showToast(err, "error");
      return;
    }

    try {
      await axios.post("http://localhost:5000/signup", {
        username: form.email,
        password: form.password,
        role: form.role
      });

      showToast("Signup successful! You can now login.", "success");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

    } catch {
      setError("Signup failed");
      showToast("Signup failed. Please try again.", "error");
    }
  };

  return (
    <div className="flex justify-center items-center py-20 min-h-screen bg-[#fdf6f0]">

      <div className="bg-white shadow-2xl p-10 rounded-3xl w-full max-w-md border border-gray-100 flex flex-col items-center">

        <div className="w-16 h-16 bg-[#e1f5fe] rounded-2xl flex items-center justify-center mb-6">
          <FaUserPlus className="text-blue-400 text-2xl" />
        </div>

        <h2 className="text-3xl font-extrabold mb-1 text-gray-900 text-center">
          Create Account
        </h2>
        <p className="text-gray-500 mb-8 text-center text-sm font-medium">
          Join the CivicShield ecosystem
        </p>

        {/* EMAIL */}
        <input
          className="border border-gray-100 bg-gray-50 p-4 w-full mb-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          placeholder="Email Address"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <div className="relative mb-4 w-full">
          <input
            type={show ? "text" : "password"}
            className="border border-gray-100 bg-gray-50 p-4 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <span
            className="absolute right-4 top-4.5 cursor-pointer text-gray-400 hover:text-blue-400 transition-colors"
            onClick={() => setShow(!show)}
          >
            {show ? <FaEyeSlash className="mt-1" /> : <FaEye className="mt-1" />}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <input
          type={show ? "text" : "password"}
          className="border border-gray-100 bg-gray-50 p-4 w-full mb-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          placeholder="Confirm Password"
          onChange={(e) =>
            setForm({ ...form, confirm: e.target.value })
          }
        />

        {/* ROLE */}
        <div className="mb-6 w-full">
          <label className="block mb-2 font-bold text-xs uppercase tracking-widest text-gray-400 ml-1">
            Assign Role
          </label>

          <select
            className="border border-gray-100 bg-gray-50 p-4 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="VIEWER">Viewer (Dashboard Only)</option>
            <option value="OPERATOR">Operator (Full Control)</option>
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-500 mb-4 text-xs font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={signup}
          className="bg-[#acd1af] text-[#2c4c2e] w-full py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all mb-4 active:scale-95"
        >
          Create Account
        </button>

        <p className="mt-8 text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-blue-400 font-bold hover:underline">Login</a>
        </p>

      </div>
    </div>
  );
}