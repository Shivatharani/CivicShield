"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { FaShieldAlt, FaPowerOff, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    showToast("Session Terminated", "info");
    setTimeout(() => {
        window.location.href = "/";
    }, 500);
  };

  return (
    <nav className="w-full transition-all duration-500 px-6 pt-6 pb-2">
      <div className="max-w-7xl mx-auto glass-card-light flex justify-between items-center px-8 py-4 border-slate-200/50 rounded-2xl shadow-sm">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform">
             <FaShieldAlt />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Civic<span className="text-amber-600">Shield</span>
          </span>
        </Link>

        <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {isLoggedIn ? (
            <>
              <Link href="/apply" className="hover:text-amber-600 transition-colors">Gateway</Link>
              <Link href="/admin" className="hover:text-amber-600 transition-colors">Command Center</Link>
              <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <FaPowerOff className="text-sm" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/login" className="hover:text-amber-600 transition-colors">Login</Link>
              <Link 
                href="/signup" 
                className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-100 text-[10px] font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}