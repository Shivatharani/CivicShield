"use client";

import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "../../context/ToastContext";

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const validate = () => {
    if (!email.includes("@")) return "Invalid email";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const login = async () => {
    const err = validate();
    if (err) {
      setError(err);
      showToast(err, "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        username: email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      
      showToast(`Welcome back, ${email}!`, "success");
      
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);

    } catch {
      setError("Invalid credentials");
      showToast("Login failed. Please check your credentials.", "error");
    }
  };

  return (
    <div className="flex justify-center items-center py-20 min-h-screen bg-[#fdf6f0]">

      <div className="bg-white shadow-2xl p-10 rounded-3xl w-full max-w-md border border-gray-100 flex flex-col items-center">

        <div className="w-16 h-16 bg-[#fce4ec] rounded-2xl flex items-center justify-center mb-6">
          <FaLock className="text-pink-400 text-2xl" />
        </div>

        <h2 className="text-3xl font-extrabold mb-1 text-gray-900 text-center">
          Login
        </h2>
        <p className="text-gray-500 mb-8 text-center text-sm font-medium">
          Access your secure dashboard
        </p>

        {/* EMAIL */}
        <input
          className="border border-gray-100 bg-gray-50 p-4 w-full mb-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="relative mb-6 w-full">
          <input
            type={show ? "text" : "password"}
            className="border border-gray-100 bg-gray-50 p-4 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="absolute right-4 top-4.5 cursor-pointer text-gray-400 hover:text-pink-400 transition-colors"
            onClick={() => setShow(!show)}
          >
            {show ? <FaEyeSlash className="mt-1" /> : <FaEye className="mt-1" />}
          </span>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-500 mb-4 text-xs font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          className="bg-[#acd1af] text-[#2c4c2e] w-full py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all mb-6 active:scale-95"
        >
          Login
        </button>

        <div className="w-full flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-gray-100 flex-grow"></div>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Or login with</span>
          <div className="h-[1px] bg-gray-100 flex-grow"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await axios.post(
                  "http://localhost:5000/google-login",
                  { credential: credentialResponse.credential }
                );

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.role);
                
                showToast("Google login successful!", "success");
                
                setTimeout(() => {
                  window.location.href = "/admin";
                }, 1000);

              } catch {
                showToast("Google login failed", "error");
              }
            }}
          />
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Don't have an account? <a href="/signup" className="text-pink-400 font-bold hover:underline">Sign up</a>
        </p>

      </div>
    </div>
  );
}