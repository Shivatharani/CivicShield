"use client";

import { useState } from "react";
import axios from "axios";
import { FaUserPlus, FaChevronRight, FaTerminal, FaGlasses, FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "../../context/ToastContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Signup() {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    role: "OPERATOR"
  });

  const validate = () => {
    if (!form.email.includes("@")) return "Invalid email format";
    if (form.password.length < 6) return "Requirements: 6+ characters";
    if (form.password !== form.confirm) return "Verification mismatch";
    return null;
  };

  const signup = async () => {
    const err = validate();
    if (err) {
      showToast(err, "error");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/signup", {
        username: form.email,
        password: form.password,
        role: form.role
      });

      showToast("Access Level Created Successfully", "success");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch {
      showToast("System Error: Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20 min-h-screen bg-[#f8fafc] relative overflow-hidden text-slate-900">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-50 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 blur-[120px] rounded-full"></div>

      <Card className="w-full max-w-md animate-fade-in-up z-10 border-2 border-amber-100 shadow-2xl shadow-amber-100/50 rounded-[32px] overflow-hidden">
        <CardContent className="p-10 flex flex-col items-center">
          <div className="flex flex-col items-center mb-10 w-full">
             <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 border border-amber-100">
                <FaUserPlus className="text-amber-600 text-2xl" />
             </div>
             <h2 className="text-3xl font-black tracking-tight uppercase">Sign Up</h2>
             <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Create Your Security Identity</p>
          </div>

          <div className="space-y-6 w-full text-left">
            <div>
              <Label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</Label>
              <Input
                className="bg-white border border-slate-200 h-14 w-full rounded-xl focus-visible:ring-amber-600 transition-all font-medium placeholder-slate-300"
                placeholder="email@example.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <Label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</Label>
              <div className="relative">
                 <Input
                   type={show ? "text" : "password"}
                   className="bg-white border border-slate-200 h-14 w-full rounded-xl focus-visible:ring-amber-600 transition-all font-medium placeholder-slate-300 pr-12"
                   placeholder="••••••••"
                   onChange={(e) => setForm({ ...form, password: e.target.value })}
                 />
                 <span
                   className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-300 hover:text-amber-600 transition-colors z-10"
                   onClick={() => setShow(!show)}
                 >
                   {show ? <FaEyeSlash /> : <FaEye />}
                 </span>
              </div>
            </div>

            <div>
              <Label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  className="bg-white border border-slate-200 h-14 w-full rounded-xl focus-visible:ring-amber-600 transition-all font-medium placeholder-slate-300 pr-12"
                  placeholder="••••••••"
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                />
                <span
                   className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-300 hover:text-amber-600 transition-colors z-10"
                   onClick={() => setShowConfirm(!showConfirm)}
                 >
                   {showConfirm ? <FaEyeSlash /> : <FaEye />}
                 </span>
              </div>
            </div>

            <div>
              <Label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Engagement Level</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setForm({ ...form, role: "OPERATOR" })}
                  className={`h-auto p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    form.role === "OPERATOR" 
                    ? "bg-amber-50 border-amber-600 text-amber-600 shadow-sm" 
                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  <FaTerminal className="text-lg" />
                  <span className="text-[10px] font-black">OPERATOR</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setForm({ ...form, role: "VIEWER" })}
                  className={`h-auto p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    form.role === "VIEWER" 
                    ? "bg-slate-900 border-slate-900 text-white shadow-lg lg:hover:bg-slate-800 lg:hover:text-white" 
                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  <FaGlasses className="text-lg" />
                  <span className="text-[10px] font-black">VIEWER</span>
                </Button>
              </div>
            </div>

            <Button
              onClick={signup}
              disabled={loading}
              className="w-full h-14 text-lg bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-200 transition-all active:scale-95 mt-4"
            >
              {loading ? "Signing Up..." : "Sign Up"} <FaChevronRight className="text-sm ml-2" />
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Existing Identity? <Link href="/login" className="text-amber-600 font-black hover:underline">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
