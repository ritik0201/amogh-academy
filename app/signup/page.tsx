"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Lock, Mail, ArrowRight, CheckCircle, 
  Sparkles, GraduationCap, Loader2, AlertCircle, Phone, BookOpen,
  Briefcase, School, KeyRound, RefreshCw
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    role: "student",
    grade: "",
    subject: "",
    experience: "",
  });
  const [step, setStep] = useState<"details" | "otp">("details");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      setErrorMessage("Please fill all required fields");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, type: "signup" }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("idle");
        setStep("otp");
        setTimer(60);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      setErrorMessage("Please enter the verification code");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Signup failed");
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
        <div className="max-w-xl w-full">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all duration-500 ${
              formData.role === "student" ? "bg-blue-50 border-blue-100 text-blue-700" : "bg-indigo-50 border-indigo-100 text-indigo-700"
            }`}>
              <Sparkles className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">{formData.role === "student" ? "Student" : "Teacher"} Registration</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-6 mb-2">
              {step === "details" ? "Create Your Account" : "Verify Email"}
            </h1>
            <p className="text-slate-500 font-medium">
              {step === "details" ? "Join our community of learners and educators." : `Enter the 6-digit code sent to ${formData.email}`}
            </p>
          </div>

          <div className="relative group">
            <div className={`absolute inset-0 opacity-20 blur-[100px] rounded-full -z-10 transition-all duration-700 ${
              formData.role === "student" ? "bg-blue-400 translate-x-12" : "bg-indigo-400 -translate-x-12"
            }`}></div>
            
            <div className="bg-white/80 backdrop-blur-3xl rounded-[3rem] p-8 md:p-14 shadow-2xl border border-white relative overflow-hidden">
              
              {step === "details" && (
                <div className="flex bg-slate-100/50 p-1.5 rounded-[1.5rem] mb-10 border border-slate-200/50">
                  <button type="button" onClick={() => setFormData(p => ({ ...p, role: "student" }))} className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-[1.2rem] font-bold transition-all ${formData.role === "student" ? "bg-white text-blue-600 shadow-lg scale-100" : "text-slate-400 hover:text-slate-500"}`}>
                    <GraduationCap className="w-5 h-5" /> Student
                  </button>
                  <button type="button" onClick={() => setFormData(p => ({ ...p, role: "teacher" }))} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.2rem] font-bold transition-all ${formData.role === "teacher" ? "bg-white text-indigo-600 shadow-lg scale-100" : "text-slate-400 hover:text-slate-500"}`}>
                    <BookOpen className="w-5 h-5" /> Teacher
                  </button>
                </div>
              )}

              <form onSubmit={step === "details" ? handleSendOtp : handleSignup} className="space-y-6 relative z-10">
                {step === "details" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-black text-slate-700 ml-1">Full Name</label>
                      <div className="relative group/field">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/field:text-blue-500 transition-colors" />
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold" required />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-black text-slate-700 ml-1">Email</label>
                      <div className="relative group/field">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/field:text-blue-500 transition-colors" />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold" required />
                      </div>
                    </div>

                    {formData.role === "student" ? (
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-black text-slate-700 ml-1">Grade / Class</label>
                        <div className="relative group/field">
                          <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/field:text-blue-500 transition-colors" />
                          <select name="grade" value={formData.grade} onChange={handleChange} className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold appearance-none cursor-pointer">
                            <option value="">Select Grade</option>
                            {[6,7,8,9,10,11,12].map(g => <option key={g} value={g.toString()}>Grade {g}</option>)}
                            <option value="Graduate">Graduate</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-700 ml-1">Subject Expertise</label>
                          <div className="relative group/field">
                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors" />
                            <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Physics" className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-700 ml-1">Experience</label>
                          <div className="relative group/field">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors" />
                            <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5+ years" className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="relative group/field">
                    <label className="block text-sm font-black text-slate-700 mb-2 ml-1">Enter 6-Digit Code</label>
                    <div className="relative">
                      <KeyRound className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors ${formData.role === "student" ? "group-focus-within/field:text-blue-500" : "group-focus-within/field:text-indigo-500"}`} />
                      <input 
                        type="text" 
                        maxLength={6}
                        name="otp"
                        value={formData.otp} 
                        onChange={handleChange} 
                        placeholder="000000" 
                        className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-4 transition-all font-bold text-slate-900 shadow-sm tracking-[0.5em] text-center ${formData.role === "student" ? "focus:ring-blue-500/10 focus:border-blue-500" : "focus:ring-indigo-500/10 focus:border-indigo-500"}`}
                        required
                      />
                    </div>
                    <div className="flex justify-between items-center mt-4 px-1">
                      <button type="button" onClick={() => setStep("details")} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Edit Details</button>
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

                {errorMessage && <div className="flex items-center gap-3 text-red-600 text-sm font-bold bg-red-50 border border-red-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-1"><AlertCircle className="w-5 h-5 shrink-0" /> {errorMessage}</div>}
                
                {status === "success" && <div className="flex items-center gap-3 text-green-600 text-sm font-bold bg-green-50 border border-green-100 rounded-xl p-4 animate-in zoom-in"><CheckCircle className="w-5 h-5 shrink-0" /> Account created! Redirecting...</div>}

                <button 
                  type="submit" 
                  disabled={status === "loading" || status === "success"}
                  className={`w-full py-5 rounded-[2rem] text-white font-black text-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 ${
                    formData.role === "student" ? "bg-gradient-to-r from-blue-600 to-blue-700 shadow-blue-500/30" : "bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-indigo-500/30"
                  }`}
                >
                  {status === "loading" ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      {step === "details" ? "SEND VERIFICATION CODE" : `CREATE ${formData.role.toUpperCase()} ACCOUNT`}
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 text-center relative z-10">
                <p className="text-slate-500 font-bold">Already a member? <Link href="/login" className="text-blue-600 hover:text-blue-700 underline decoration-2 decoration-blue-100 underline-offset-4 transition-all">Sign In</Link></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
