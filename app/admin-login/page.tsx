"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, Lock, Mail, ArrowRight, 
  Loader2, AlertCircle, ShieldAlert, KeyRound, RefreshCw 
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
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
      setErrorMessage("Please enter administrator email");
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
        setTimer(60);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Authorization failed");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("System error. Access denied.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setErrorMessage("OTP is required for verification");
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
        setErrorMessage(res.error || "Invalid security token");
      } else {
        setStatus("success");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Verification system failure.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-red-500 selection:text-white relative flex flex-col">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none"></div>
      <div className="fixed inset-0 z-0 bg-radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%) pointer-events-none"></div>
      
      <Navbar />

      <main className="relative z-10 flex-grow flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-black mb-6 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">Admin Control Center</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              {step === "email" ? "Restricted Access" : "Verify Authorization"}
            </h1>
            <p className="text-slate-500 font-medium">
              {step === "email" ? "Provide administrator credentials to continue." : `A security token has been dispatched to ${email}`}
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-red-500 opacity-10 blur-[100px] rounded-full -z-10 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="bg-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full -mr-8 -mt-8"></div>
              
              <form onSubmit={step === "email" ? handleSendOtp : handleVerifyOtp} className="space-y-6 relative z-10">
                {step === "email" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Admin ID / Email</label>
                    <div className="relative group/field">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/field:text-red-500 transition-colors" />
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="admin@amogh.edu" 
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-800/50 border border-slate-700 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold text-white placeholder:text-slate-700"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Security Token (OTP)</label>
                    <div className="relative group/field">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/field:text-red-500 transition-colors" />
                      <input 
                        type="text" 
                        maxLength={6}
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        placeholder="000000" 
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-800/50 border border-slate-700 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold text-white tracking-[0.5em] text-center"
                        required
                      />
                    </div>
                    <div className="flex justify-between items-center mt-6 px-1">
                      <button type="button" onClick={() => setStep("email")} className="text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors">Abort Access</button>
                      <button 
                        type="button" 
                        disabled={timer > 0} 
                        onClick={handleSendOtp} 
                        className={`text-xs font-bold transition-colors flex items-center gap-1 ${timer > 0 ? "text-slate-700 cursor-not-allowed" : "text-red-500 hover:text-red-400"}`}
                      >
                        {timer > 0 ? `Retry in ${timer}s` : <><RefreshCw className="w-3 h-3" /> Resend Token</>}
                      </button>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="flex items-center gap-3 text-red-500 text-sm font-bold bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-in shake-1">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={status === "loading" || status === "success"}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 text-white font-black text-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {status === "loading" ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      {step === "email" ? "REQUEST TOKEN" : "AUTHORIZE ACCESS"}
                      <ShieldCheck className="w-6 h-6" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="mt-8 text-center text-slate-600 font-bold text-xs uppercase tracking-widest">
            Unauthorized attempt will be logged and monitored.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
