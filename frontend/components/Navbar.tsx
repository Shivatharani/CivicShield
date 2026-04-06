"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    showToast("Logged out successfully", "info");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex justify-between items-center border-b border-gray-100 shadow-sm">
      <Link href="/" className="text-xl font-bold tracking-tight text-gray-800">
        Civic<span className="text-pink-400">Shield</span>
      </Link>

      <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link href="/" className="hover:text-pink-400 transition-colors">Home</Link>
        
        {isLoggedIn ? (
          <>
            <Link href="/apply" className="hover:text-pink-400 transition-colors">Apply</Link>
            <Link href="/admin" className="hover:text-pink-400 transition-colors">Dashboard</Link>
            <button 
              onClick={logout}
              className="bg-red-50 text-red-500 px-4 py-2 rounded-xl hover:bg-red-100 transition-all border border-red-100"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-pink-400 transition-colors self-center">Login</Link>
            <Link 
              href="/signup" 
              className="bg-mint-100 bg-[#e0f2f1] text-[#2e7d32] px-5 py-2.5 rounded-xl hover:bg-[#c8e6c9] transition-all border border-green-100"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}