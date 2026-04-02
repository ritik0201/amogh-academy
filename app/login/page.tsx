"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, Lock, Mail, ArrowRight, ShieldCheck, 
  Sparkles, GraduationCap, Loader2, AlertCircle, BookOpen,
  KeyRound, RefreshCw
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "login" }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("idle");
        setStep("otp");
        setTimer(60); // 1 minute cooldown
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setErrorMessage("Please enter the OTP");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email,
        otp,
        redirect: false,
      });

      if (res?.error) {
        setStatus("error");
        setErrorMessage(res.error || "Invalid OTP");
      } else {
        setStatus("success");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white relative flex flex-col">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 pointer-events-none"></div>
      
      <Navbar />

      <main className="relative z-10 flex-grow flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all duration-500 ${
              role === "student" ? "bg-blue-50 border-blue-100 text-blue-700" : 
              role === "teacher" ? "bg-indigo-50 border-indigo-100 text-indigo-700" :
              "bg-slate-100 border-slate-200 text-slate-700"
            }`}>
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">{role} Portal</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-6 mb-2">
              {step === "email" ? "Welcome Back" : "Verify Identity"}
            </h1>
            <p className="text-slate-500 font-medium">
              {step === "email" ? "Enter your email to receive a secure login code." : `We've sent a 6-digit code to ${email}`}
            </p>
          </div>

          {step === "email" && (
            <div className="flex bg-white/50 backdrop-blur-xl p-1 rounded-3xl border border-white mb-8 shadow-sm">
              {[
                { id: "student", label: "Student", icon: GraduationCap },
                { id: "teacher", label: "Teacher", icon: BookOpen },
                { id: "admin", label: "Admin", icon: ShieldCheck }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${
                    role === r.id ? "bg-white text-slate-900 shadow-sm scale-100" : "text-slate-400 hover:text-slate-600 scale-95"
                  }`}
                >
                  <r.icon className="w-4 h-4" />
                  <span className="text-sm">{r.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="relative group">
            <div className={`absolute inset-0 opacity-20 blur-[80px] rounded-full -z-10 transition-all duration-700 ${
              role === "student" ? "bg-blue-400 translate-x-4" : role === "teacher" ? "bg-indigo-400 -translate-x-4" : "bg-slate-400"
            }`}></div>
            
            <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-8 -mt-8 transition-all duration-500 ${
                role === "student" ? "bg-blue-50" : role === "teacher" ? "bg-indigo-50" : "bg-slate-100"
              }`}></div>
              
              <form onSubmit={step === "email" ? handleSendOtp : handleVerifyOtp} className="space-y-6 relative z-10">
                {step === "email" ? (
                  <div className="relative group/field">
                    <label className="block text-sm font-black text-slate-700 mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors ${role === "student" ? "group-focus-within/field:text-blue-500" : "group-focus-within/field:text-indigo-500"}`} />
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="name@example.com" 
                        className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-4 transition-all font-bold text-slate-900 shadow-sm ${role === "student" ? "focus:ring-blue-500/10 focus:border-blue-500" : "focus:ring-indigo-500/10 focus:border-indigo-500"}`}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative group/field">
                    <label className="block text-sm font-black text-slate-700 mb-2 ml-1">Enter 6-Digit Code</label>
                    <div className="relative">
                      <KeyRound className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors ${role === "student" ? "group-focus-within/field:text-blue-500" : "group-focus-within/field:text-indigo-500"}`} />
                      <input 
                        type="text" 
                        maxLength={6}
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        placeholder="000000" 
                        className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-4 transition-all font-bold text-slate-900 shadow-sm tracking-[0.5em] text-center ${role === "student" ? "focus:ring-blue-500/10 focus:border-blue-500" : "focus:ring-indigo-500/10 focus:border-indigo-500"}`}
                        required
                      />
                    </div>
                    <div className="flex justify-between items-center mt-4 px-1">
                      <button type="button" onClick={() => setStep("email")} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Change Email</button>
                      <button 
                        type="button" 
                        disabled={timer > 0} 
                        onClick={handleSendOtp} 
                        className={`text-xs font-bold transition-colors flex items-center gap-1 ${timer > 0 ? "text-slate-300 cursor-not-allowed" : "text-blue-600 hover:text-blue-700"}`}
                      >
                        {timer > 0 ? `Resend in ${timer}s` : <><RefreshCw className="w-3 h-3" /> Resend Code</>}
                      </button>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="flex items-center gap-3 text-red-600 text-sm font-bold bg-red-50 border border-red-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className={`w-full py-5 rounded-2xl text-white font-black text-lg hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 ${
                    role === "student" ? "bg-gradient-to-r from-blue-600 to-blue-700 shadow-blue-500/20" :
                    role === "teacher" ? "bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-indigo-500/20" :
                    "bg-gradient-to-r from-slate-700 to-slate-800 shadow-slate-500/20"
                  }`}
                >
                  {status === "loading" ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      {step === "email" ? "SEND VERIFICATION CODE" : `LOGIN AS ${role.toUpperCase()}`}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center relative z-10">
                <p className="text-slate-500 font-bold">Don't have an account? <Link href="/signup" className="text-blue-600 hover:text-blue-700 underline decoration-2 decoration-blue-100 underline-offset-4 transition-all">Sign Up</Link></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
