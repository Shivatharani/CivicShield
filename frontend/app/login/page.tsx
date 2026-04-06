"use client";

import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaLock, FaUserShield, FaUser, FaChevronRight, FaTerminal, FaGlasses } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "../../context/ToastContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Login() {
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Login Form
  const [role, setRole] = useState("");
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const validate = () => {
    if (!email.includes("@")) return "Invalid email format";
    if (password.length < 6) return "Password requirement: 6+ characters";
    return null;
  };

  const login = async () => {
    const err = validate();
    if (err) {
      showToast(err, "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/login", {
        username: email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      
      showToast(`Access Authorized: ${email}`, "success");
      
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);

    } catch {
      showToast("Authorization Denied: Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20 min-h-screen bg-[#f8fafc] relative overflow-hidden">
      
      {/* Structural Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-50 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-100 blur-[120px] rounded-full"></div>

      <Card className="w-full max-w-md animate-fade-in-up z-10 border-2 border-amber-100 shadow-2xl shadow-amber-100/50 rounded-[32px] overflow-hidden">
        <CardContent className="p-10 flex flex-col items-center">
          {step === 1 ? (
            <>
              <div className="w-16 h-16 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <FaLock className="text-amber-600 text-2xl" />
              </div>

              <h2 className="text-3xl font-black mb-2 text-slate-900 text-center uppercase tracking-tight">
                Login to Portal
              </h2>
              <p className="text-slate-500 mb-10 text-center text-sm font-medium">
                Identify your access level to proceed
              </p>

              <div className="w-full space-y-4">
                <Button 
                  variant="outline"
                  onClick={() => { setRole("OPERATOR"); setStep(2); }}
                  className="w-full h-auto p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-600 hover:shadow-md transition-all flex items-center gap-4 group text-left justify-start"
                >
                  <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shrink-0">
                    <FaTerminal />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-slate-900">Operator</p>
                    <p className="text-xs text-slate-500">System management and distribution</p>
                  </div>
                  <FaChevronRight className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </Button>

                <Button 
                  variant="outline"
                  onClick={() => { setRole("VIEWER"); setStep(2); }}
                  className="w-full h-auto p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-600 hover:shadow-md transition-all flex items-center gap-4 group text-left justify-start"
                >
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shrink-0">
                    <FaGlasses />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-slate-900">Viewer</p>
                    <p className="text-xs text-slate-500">Public ledger monitoring and verification</p>
                  </div>
                  <FaChevronRight className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-full flex justify-between items-center mb-8 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg text-white shadow-md ${role === "OPERATOR" ? "bg-amber-600" : "bg-slate-900"}`}>
                    {role === "OPERATOR" ? <FaTerminal /> : <FaGlasses />}
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest leading-none mb-1">Authorization</p>
                    <p className="text-xs font-black text-slate-900 uppercase">{role}</p>
                  </div>
                </div>
                <button onClick={() => setStep(1)} className="text-xs font-bold text-amber-600 hover:text-amber-700 underline underline-offset-4">Reset</button>
              </div>

              <h2 className="text-2xl font-black mb-8 text-slate-900 w-full text-left tracking-tight uppercase">
                Secure Auth
              </h2>

              {/* EMAIL */}
              <div className="w-full mb-5">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email</Label>
                <Input
                  className="bg-white border border-slate-200 h-14 w-full rounded-xl focus-visible:ring-amber-600 transition-all text-slate-900 placeholder-slate-300 font-medium"
                  placeholder="email@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* PASSWORD */}
              <div className="w-full mb-8">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Password</Label>
                <div className="relative">
                  <Input
                    type={show ? "text" : "password"}
                    className="bg-white border border-slate-200 h-14 w-full rounded-xl focus-visible:ring-amber-600 transition-all text-slate-900 placeholder-slate-300 font-medium pr-12"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-300 hover:text-amber-600 transition-colors z-10"
                    onClick={() => setShow(!show)}
                  >
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <Button
                onClick={login}
                disabled={loading}
                className="w-full h-14 text-lg bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-200 transition-all active:scale-95"
              >
                {loading ? "Signing In..." : "Sign In"} <FaChevronRight className="text-sm ml-2" />
              </Button>

              <div className="w-full flex items-center gap-4 my-8">
                <div className="h-[1px] bg-slate-200 flex-grow"></div>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest whitespace-nowrap">Cloud Identity</span>
                <div className="h-[1px] bg-slate-200 flex-grow"></div>
              </div>

              {/* GOOGLE LOGIN */}
              <div className="flex justify-center w-full">
                <div className="w-full border border-slate-200 hover:border-amber-600 transition-all p-0.5 rounded-[16px] flex justify-center bg-white">
                  <GoogleLogin
                    theme="outline"
                    shape="rectangular"
                    onSuccess={async (credentialResponse) => {
                      try {
                        const res = await axios.post(
                          "http://localhost:5000/google-login",
                          { 
                             credential: credentialResponse.credential,
                             role: role // PASSING THE SELECTED ROLE
                          }
                        );

                        localStorage.setItem("token", res.data.token);
                        localStorage.setItem("role", res.data.role);
                        showToast("Google Authentication successful", "success");
                        setTimeout(() => { window.location.href = "/admin"; }, 1000);
                      } catch {
                        showToast("Google Authentication failed", "error");
                      }
                    }}
                  />
                </div>
              </div>

              <p className="mt-10 text-sm text-slate-500 font-medium">
                Unauthorized? <Link href="/signup" className="text-amber-600 font-black hover:underline">Sign Up</Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
