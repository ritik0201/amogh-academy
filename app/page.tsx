"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, FlaskConical, Calculator, Globe, Microscope, Atom, ArrowRight, Sparkles, Loader2, Play,
  Quote, MessageSquare, HelpCircle, ChevronDown, Monitor, CheckCircle, BookOpen, Award, Zap, ChevronRight, User, Phone, Mail, Book, Star, Clock, Video, GraduationCap
} from "lucide-react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [buyingCourseId, setBuyingCourseId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (res.ok) setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (course: any) => {
    if (!session) {
      router.push("/login");
      return;
    }

    setBuyingCourseId(course._id);
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setBuyingCourseId(null);
      return;
    }

    try {
      // 1. Create order on server
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: course.price || 5, 
          courseId: course._id 
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order");

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RP_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Amogh Academy",
        description: `Purchase ${course.title}`,
        image: "/logo.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify payment on server
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            alert("Payment Successful! Welcome to the course.");
            router.push("/student/course");
          } else {
            alert("Verification failed: " + verifyData.error);
          }
        },
        prefill: {
          name: session.user?.name,
          email: session.user?.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setBuyingCourseId(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.course) {
      setErrorMessage("Please fill all fields");
      return;
    }
    
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", phone: "", email: "", course: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to submit form. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white scroll-smooth overflow-x-hidden relative">
      
      {/* Universal Grid Background across the entire page */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 pointer-events-none"></div>
      
      {/* Soft Glows behind grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-sky-200/40 blur-[150px]"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 lg:pt-48 lg:pb-32 flex items-center min-h-screen">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 w-full text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Text */}
            <div className="lg:col-span-7 space-y-10 relative z-20">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-blue-100/50 text-blue-700 font-black shadow-xl shadow-blue-500/5 animate-in fade-in slide-in-from-left-5 duration-700">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em]">Admissions Open 2024-25</span>
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-slate-900 animate-in fade-in slide-in-from-bottom-5 duration-700">
                Reshaping <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400">Future Minds.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-500 font-bold max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000">
                Varanasi's #1 integrated learning hub for <span className="text-blue-600">K-12 Board Foundation</span>, <span className="text-blue-600">Competitive Targets</span>, and <span className="text-blue-600">Advanced Computer Skillset</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 items-center justify-center lg:justify-start pt-6 animate-in fade-in zoom-in-95 duration-1000">
                <a href="/courses" className="group w-full sm:w-auto px-10 py-5 rounded-[2rem] bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 active:scale-95">
                  Explore Courses
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="/contact" className="w-full sm:w-auto px-10 py-5 rounded-[2rem] bg-white border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg flex items-center justify-center hover:border-blue-200">
                  Connect w/ Us
                </a>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 pt-12 border-t border-slate-200/50">
                 {[
                   { label: "Students Trained", value: "5000+" },
                   { label: "Expert Faculty", value: "25+" },
                   { label: "Success Rate", value: "98%" }
                 ].map((metric) => (
                   <div key={metric.label}>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{metric.value}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
                   </div>
                 ))}
              </div>
            </div>

            {/* Right Column: Glassmorphism Inquiry Form */}
            <div className="lg:col-span-5 relative z-20 animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
              <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full scale-125 opacity-50"></div>
              <div className="relative bg-white/60 backdrop-blur-3xl p-10 lg:p-12 rounded-[3.5rem] shadow-2xl border border-white/60 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-full"></div>
                
                <div className="mb-10 text-center lg:text-left">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">Register Demo</h3>
                  <p className="text-slate-500 font-bold mt-2">Start your journey with a free demo session.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="relative group">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-6 pr-6 py-4.5 rounded-[1.5rem] border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white/80 shadow-inner font-bold text-slate-900 placeholder-slate-400" placeholder="Student Name" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="relative group">
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full pl-6 pr-6 py-4.5 rounded-[1.5rem] border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white/80 shadow-inner font-bold text-slate-900 placeholder-slate-400" placeholder="Mobile" />
                    </div>
                    <div className="relative group">
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-6 pr-6 py-4.5 rounded-[1.5rem] border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white/80 shadow-inner font-bold text-slate-900 placeholder-slate-400" placeholder="Email" />
                    </div>
                  </div>

                  <div className="relative group">
                    <select name="course" value={formData.course} onChange={handleChange} required className="w-full pl-6 pr-12 py-4.5 rounded-[1.5rem] border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white/80 shadow-inner font-bold text-slate-700 appearance-none cursor-pointer">
                      <option value="" disabled hidden>Desired Track</option>
                      <option value="Foundation">Foundation (6th-12th)</option>
                      <option value="Competitive">Target (JEE/NEET/CUET)</option>
                      <option value="Computer">Advanced Computer Skill</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                  
                  {status === "success" && (
                    <div className="text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm font-bold flex items-center gap-2 animate-in zoom-in-95">
                       <CheckCircle className="w-5 h-5 shrink-0" />
                       Success! We'll contact you in 24 hours.
                    </div>
                  )}

                  <button type="submit" disabled={status === "loading"} className="group w-full py-5 mt-4 rounded-[1.5rem] bg-blue-600 text-white font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 disabled:opacity-70 h-16 flex items-center justify-center gap-3">
                    {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Book Free Demo
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Indicators [NEW] */}
      <section className="relative z-10 py-12 lg:py-24 bg-white/40 border-y border-slate-200/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Learning Hours", value: "250K+", icon: Clock, color: "text-blue-500" },
                { label: "Active Faculty", value: "25+", icon: Users, color: "text-indigo-500" },
                { label: "Digital Courses", value: "40+", icon: Video, color: "text-sky-500" },
                { label: "Satisfaction", value: "4.9/5", icon: Star, color: "text-amber-500" }
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-6 bg-white/60 rounded-3xl border border-slate-100 shadow-sm">
                   <div className={`p-4 bg-white rounded-2xl shadow-sm border border-slate-50 mb-4 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Coaching Section */}
      <section id="coaching" className="relative z-10 py-24 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col flex-col-reverse md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
            <div className="max-w-2xl mx-auto md:mx-0">
              <div className="flex items-center justify-center md:justify-start gap-3 text-blue-600 font-black tracking-widest uppercase mb-4 text-sm">
                <BookOpen className="w-5 h-5" /> Academic Excellence
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                Coaching Classes
              </h2>
            </div>
            <p className="text-slate-600 text-lg max-w-md font-medium mx-auto md:mx-0">
              For classes <span className="text-slate-900 font-bold">6th to 12th (C.B.S.E., I.C.S.E.)</span> preparing students for board exams.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Class Card */}
            <div className="lg:col-span-2 group relative bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-1 border border-slate-200 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl">
              <div className="relative h-full bg-white/60 rounded-[1.4rem] p-8 md:p-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] group-hover:bg-blue-200 transition-all duration-500 pointer-events-none"></div>
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div className="bg-white px-4 py-1.5 rounded-full text-sm font-bold text-blue-700 border border-blue-100 shadow-sm">
                    Hybrid Mode
                  </div>
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900 relative z-10">Class 6th to 12th Foundation</h3>
                <p className="text-slate-600 font-medium mb-8 max-w-lg relative z-10">
                  Highly experienced faculty offering comprehensive coaching tailored for Science, Commerce, and Arts segments.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-slate-200 pt-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
                    <span className="font-bold text-slate-700">Science</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50"></div>
                    <span className="font-bold text-slate-700">Commerce</span>
                  </div>
                  <div className="flex items-center gap-3 flex-grow">
                    <a href="/coaching" className="inline-flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-wider hover:translate-x-1 transition-transform">
                      View Details <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Competitive Target */}
            <div className="group relative bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-1 border border-slate-200 hover:border-sky-300 transition-all duration-500 hover:shadow-2xl">
              <div className="relative h-full bg-sky-50/50 rounded-[1.4rem] p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-sky-200/50 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="bg-white text-sky-600 p-4 rounded-2xl inline-block mb-8 shadow-sm border border-sky-100 relative z-10">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-6 text-slate-900 relative z-10">Competitive Prep</h3>
                <ul className="space-y-4 relative z-10">
                  <li className="flex items-center gap-4 bg-white/80 p-4 rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                    <CheckCircle className="text-sky-500 w-6 h-6 shrink-0" />
                    <span className="font-black text-lg text-slate-800 tracking-wide">CUET</span>
                  </li>
                  <li className="flex items-center gap-4 bg-white/80 p-4 rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                    <CheckCircle className="text-sky-500 w-6 h-6 shrink-0" />
                    <span className="font-black text-lg text-slate-800 tracking-wide">NEET</span>
                  </li>
                  <li className="flex items-center gap-4 bg-white/80 p-4 rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                    <CheckCircle className="text-sky-500 w-6 h-6 shrink-0" />
                    <span className="font-black text-lg text-slate-800 tracking-wide">IIT-JEE</span>
                  </li>
                </ul>
                <div className="mt-8 pt-6 border-t border-sky-100 relative z-10 text-center">
                  <a href="/classes" className="inline-flex items-center gap-2 text-sky-600 font-black text-sm uppercase tracking-wider hover:translate-x-1 transition-transform">
                    Check Syllabuss <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Features List */}
            <div className="lg:col-span-3 mt-4">
              <div className="bg-white/40 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-inner">
                <h4 className="text-xl font-black mb-8 text-center text-slate-800 tracking-wide uppercase">Why Choose Amogh Academy?</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center text-center gap-4 group">
                    <div className="bg-white p-5 rounded-full text-blue-500 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform"><Monitor className="w-8 h-8" /></div>
                    <span className="font-bold text-slate-700">Smart Classroom w/ PPT</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-4 group">
                    <div className="bg-white p-5 rounded-full text-blue-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform"><Award className="w-8 h-8" /></div>
                    <span className="font-bold text-slate-700">Regular Tests & Assessment</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-4 group">
                    <div className="bg-white p-5 rounded-full text-sky-500 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform"><BookOpen className="w-8 h-8" /></div>
                    <span className="font-bold text-slate-700">Doubt Classes & Mentorship</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-4 group">
                    <div className="bg-white p-5 rounded-full text-blue-400 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform"><CheckCircle className="w-8 h-8" /></div>
                    <span className="font-bold text-slate-700">Free Demo Classes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Offered Section */}
      <section id="classes" className="relative z-10 py-24 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-sky-600 text-white rounded-2xl shadow-lg shadow-blue-500/20 mb-8">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-4">
              Classes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Offered</span>
            </h2>
            <p className="text-slate-600 text-lg font-medium">Comprehensive curriculum designed for every stage of your academic journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Class 6th - 8th */}
            <div className="group relative bg-white/80 backdrop-blur-md rounded-[2rem] overflow-hidden border border-slate-200 hover:border-blue-300 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl shadow-lg flex flex-col">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px] -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <div className="text-5xl font-black text-white drop-shadow-lg">6<sup className="text-3xl">th</sup> – 8<sup className="text-3xl">th</sup></div>
                  <div className="mt-3 inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-blue-700 text-xs font-black shadow-sm tracking-wider uppercase">All Subjects</div>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <p className="text-slate-600 font-medium mb-6 leading-relaxed">Strong foundational coaching across all subjects to build academic confidence from the ground up.</p>
                <ul className="space-y-3">
                  {["Mathematics", "Science", "Social Studies", "English & Hindi", "Computer Basics"].map((sub) => (
                    <li key={sub} className="flex items-center gap-3 text-slate-700 font-bold">
                      <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />{sub}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Class 9th - 10th */}
            <div className="group relative bg-white/80 backdrop-blur-md rounded-[2rem] overflow-hidden border border-slate-200 hover:border-sky-300 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl shadow-lg flex flex-col">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px] -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <div className="text-5xl font-black text-white drop-shadow-lg">9<sup className="text-3xl">th</sup> – 10<sup className="text-3xl">th</sup></div>
                  <div className="mt-3 inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-sky-700 text-xs font-black shadow-sm tracking-wider uppercase">Board Foundation</div>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <p className="text-slate-600 font-medium mb-6 leading-relaxed">Focused preparation for board exams with expert coaching in core subjects.</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-700 font-bold"><Calculator className="w-5 h-5 text-sky-500 shrink-0" />Mathematics</li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold"><FlaskConical className="w-5 h-5 text-sky-500 shrink-0" />Science</li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold"><Globe className="w-5 h-5 text-sky-500 shrink-0" />Social Science (S.S.T)</li>
                </ul>
              </div>
            </div>

            {/* Class 11th - 12th */}
            <div className="group relative bg-white/80 backdrop-blur-md rounded-[2rem] overflow-hidden border border-slate-200 hover:border-blue-400 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl shadow-lg flex flex-col">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px] -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <div className="text-5xl font-black text-white drop-shadow-lg">11<sup className="text-3xl">th</sup> – 12<sup className="text-3xl">th</sup></div>
                  <div className="mt-3 inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-blue-700 text-xs font-black shadow-sm tracking-wider uppercase">Stream Specialization</div>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <p className="text-slate-600 font-medium mb-6 leading-relaxed">Choose your stream and get specialized coaching by subject experts.</p>
                <div className="space-y-5">
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                    <div className="text-blue-700 font-black mb-2 tracking-wider uppercase text-sm">PCM Stream</div>
                    <div className="flex flex-wrap gap-2">
                      {["Physics", "Chemistry", "Maths"].map((s) => (
                        <span key={s} className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
                    <div className="text-sky-700 font-black mb-2 tracking-wider uppercase text-sm">PCB Stream</div>
                    <div className="flex flex-wrap gap-2">
                      {["Physics", "Chemistry", "Biology"].map((s) => (
                        <span key={s} className="bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Faculty Section */}
      <section id="faculty" className="relative z-10 py-24 border-t border-slate-200/50 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-2xl shadow-lg mb-8">
              <Users className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-4">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Faculty</span>
            </h2>
            <p className="text-slate-600 text-lg font-medium">Experienced, passionate educators dedicated to your success.</p>
          </div>

          {/* Director + Co-Founder Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

            {/* Ayush Upadhyay - Founder */}
            <div className="group relative bg-white/90 backdrop-blur-md rounded-[2rem] p-8 border border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-lg">
              <div className="flex items-start gap-6">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/30">
                    A
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">FOUNDER</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-slate-900 mb-1">Ayush Upadhyay</h3>
                  <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-3">Founder & Director</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Mathematics</span>
                    <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">10 Yrs Experience</span>
                  </div>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">Expert Mathematics educator with a decade of coaching experience. Leads the vision and academic excellence of Amogh Academy.</p>
                </div>
              </div>
            </div>

            {/* Madhumita Upadhyay - Co-Founder */}
            <div className="group relative bg-white/90 backdrop-blur-md rounded-[2rem] p-8 border border-slate-200 hover:border-sky-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-lg">
              <div className="flex items-start gap-6">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-sky-500/30">
                    M
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-sky-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">CO-FOUNDER</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-slate-900 mb-1">Madhumita Upadhyay</h3>
                  <p className="text-sky-600 font-bold text-sm uppercase tracking-wider mb-3">Co-Founder</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-sky-50 border border-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full">Chemistry</span>
                    <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">M.Sc Chemistry</span>
                    <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">B.Ed</span>
                    <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">6 Yrs Experience</span>
                  </div>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">M.Sc Chemistry graduate and B.Ed holder with 6 years of teaching experience, nurturing a deep understanding of Chemistry.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of Team - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Rohit Pathak */}
            <div className="group relative bg-white/90 backdrop-blur-md rounded-[2rem] p-7 border border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-md">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                    R
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-700 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">ACAD HEAD</div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Rohit Pathak</h3>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-4">Academic & Management Head</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <span className="bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Physics</span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">M.Sc Physics</span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">B.Ed</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">5 years of Physics teaching experience. Manages academic operations and ensures quality education standards.</p>
              </div>
            </div>

            {/* Sanitri Dubey */}
            <div className="group relative bg-white/90 backdrop-blur-md rounded-[2rem] p-7 border border-slate-200 hover:border-green-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-md">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                    S
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">FACULTY</div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Sanitri Dubey</h3>
                <p className="text-green-600 font-bold text-xs uppercase tracking-wider mb-4">Team Member</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <span className="bg-green-50 border border-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Biology</span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">M.Sc Biology</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">M.Sc Biology specialist with 4 years of teaching experience, making life sciences engaging and approachable.</p>
              </div>
            </div>

            {/* Kiran Kannojiya */}
            <div className="group relative bg-white/90 backdrop-blur-md rounded-[2rem] p-7 border border-slate-200 hover:border-purple-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-md">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                    K
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">FACULTY</div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Kiran Kannojiya</h3>
                <p className="text-purple-600 font-bold text-xs uppercase tracking-wider mb-4">Team Member</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <span className="bg-purple-50 border border-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">B.Sc BZC</span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">M.A. Education</span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">B.Ed & M.Ed</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">5+ years of teaching experience with advanced qualifications in Education — B.Ed & M.Ed — bringing pedagogy expertise to every class.</p>
              </div>
            </div>
          </div>
          
          {/* View All Faculty CTA */}
          <div className="text-center mt-16">
             <a href="/faculty" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1">
               View Full Faculty Profiles <ArrowRight className="w-5 h-5" />
             </a>
          </div>
        </div>
      </section>

      {/* Computer Education Section */}
      <section id="computer-edu" className="relative z-10 py-24 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/20 mb-8 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <Monitor className="w-10 h-10" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 mb-6 pb-2">
              Computer Education
            </h2>
            <div className="inline-block px-6 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-sm font-black tracking-widest text-blue-700 mb-8 shadow-sm">
              APPROVED BY MINISTRY OF CORPORATE AFFAIRS
            </div>
            
            <div className="bg-gradient-to-r from-blue-50/80 to-sky-50/80 backdrop-blur-md border border-blue-100 p-6 rounded-2xl shadow-sm">
              <p className="text-xl font-bold text-slate-700 mb-2">बस एक परीक्षा दीजिए और करिए निःशुल्क या कम से कम फीस में कम्प्यूटर कोर्स</p>
              <p className="text-blue-600 font-black text-2xl drop-shadow-sm">आमोघ एकेडमी आपको देगा कोर्स पूरा होने पर जॉब भी</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-blue-200/50 blur-[120px] rounded-full pointer-events-none"></div>

            {/* MDCA Card */}
            <div className="group relative flex flex-col bg-white/80 backdrop-blur-md rounded-[2rem] overflow-hidden border border-slate-200 hover:border-blue-300 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl shadow-lg">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px] -mr-10 -mt-10"></div>
                <h4 className="text-4xl font-black text-white tracking-widest relative z-10 drop-shadow-lg">MDCA</h4>
                <div className="mt-4 inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 text-blue-700 text-sm font-black shadow-sm">
                  <span>12 Months Course</span>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4 text-slate-600 font-bold">
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-blue-500 shrink-0" /> Basic Concept of Computer, Win 7, 10 & 11</li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-blue-500 shrink-0" /> MS Office 07, 10 & 13</li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-blue-500 shrink-0" /> Tally with GST, Accounts with Inventory</li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-blue-500 shrink-0" /> Desk Top Publication, Photoshop CS, Corel Draw X7</li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-blue-500 shrink-0" /> Job Placement Training</li>
                </ul>
              </div>
            </div>

            {/* DCA Card */}
            <div className="group relative flex flex-col bg-white/80 backdrop-blur-md rounded-[2rem] overflow-hidden border border-slate-200 hover:border-sky-300 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl shadow-lg">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px] -mr-10 -mt-10"></div>
                <h4 className="text-4xl font-black text-white tracking-widest relative z-10 drop-shadow-lg">DCA</h4>
                <div className="mt-4 inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 text-blue-600 text-sm font-black shadow-sm">
                  <span>6 Months Course</span>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4 text-slate-600 font-bold">
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-sky-500 shrink-0" /> Basic Concept of Computer, Win 7, 10 & 11</li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-sky-500 shrink-0" /> MS Office 10</li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-sky-500 shrink-0" /> Tally with GST, Accounts with Inventory</li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-sky-500 shrink-0" /> Typing Hindi & English</li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-sky-500 shrink-0" /> Job Placement Training</li>
                </ul>
              </div>
            </div>

            {/* CCC Card */}
            <div className="group relative flex flex-col bg-white/80 backdrop-blur-md rounded-[2rem] overflow-hidden border border-slate-200 hover:border-blue-400 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl shadow-lg">
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px] -mr-10 -mt-10"></div>
                <h4 className="text-4xl font-black text-white tracking-widest relative z-10 drop-shadow-lg">CCC</h4>
                <div className="mt-4 inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 text-blue-500 text-sm font-black shadow-sm">
                  <span>3 Months Course</span>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4 text-slate-600 font-bold">
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-blue-400 shrink-0" /> Basic Concept of Computer, Win 7, 10 & 11</li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-blue-400 shrink-0" /> Libre Office (Writer, Calc, Impress)</li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-blue-400 shrink-0" /> Typing</li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-blue-400 shrink-0" /> Internet & E-mail</li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-blue-400 shrink-0" /> Online CCC Exam</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto">
                 <a href="/computer-edu" className="w-full py-3 rounded-xl border border-blue-100 flex items-center justify-center gap-2 text-blue-600 font-black text-sm uppercase tracking-wider hover:bg-blue-50 transition-all">
                    Course Details <ChevronRight className="w-4 h-4" />
                 </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Courses Section */}
      <section id="online-courses" className="relative z-10 py-24 bg-slate-950 overflow-hidden">
        {/* Animated Background for Cinematic effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#1e3a8a_0%,transparent_50%)] opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,#1e40af_0%,transparent_50%)] opacity-30"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold mb-4 text-xs uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> Digital Learning
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                Online <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Courses</span>
              </h2>
            </div>
            <p className="text-slate-400 text-lg max-w-md font-medium">
              Access premium video lectures and material from the comfort of your home.
            </p>
          </div>

          {loadingCourses ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course._id} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-4 left-6 py-1 px-3 bg-blue-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Play className="w-3 h-3" fill="white" /> Video Course
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-2xl font-black text-white mb-2 line-clamp-1">{course.title}</h3>
                      <p className="text-slate-400 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">
                        {course.description || "Comprehensive online module covering all core concepts with expert guidance."}
                      </p>
                      
                      {course.isEnrolled ? (
                        <div className="pt-6 border-t border-white/10 w-full mt-auto">
                          <button 
                            onClick={() => router.push("/student/course")}
                            className="w-full px-6 py-3.5 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Play className="w-4 h-4" fill="currentColor" /> Start Learning
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price</span>
                            <span className="text-3xl font-black text-white">₹{course.price || 5}</span>
                          </div>
                          
                          <button 
                            onClick={() => handlePayment(course)}
                            disabled={buyingCourseId === course._id}
                            className="px-6 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                          >
                            {buyingCourseId === course._id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                Enroll Now <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-slate-500 font-bold border-2 border-dashed border-white/5 rounded-[3rem]">
                  No online courses available at the moment.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Wall of Fame / Achievements Section */}
      <section id="achievements" className="relative z-10 py-24 bg-slate-900 border-t border-slate-800 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-white/5 backdrop-blur-sm rounded-2xl mb-6 shadow-xl border border-white/10">
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Our Wall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Fame</span>
            </h2>
            <p className="text-lg font-medium text-slate-300">
              Meet our star performers who have set new benchmarks in academics and career placements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Achievement 1 */}
            <div className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300 text-center hover:-translate-y-2">
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-slate-800 group-hover:border-blue-500 transition-colors shadow-2xl">
                <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Vivek Sharma" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <h4 className="text-xl font-bold text-white mb-1">Vivek Sharma</h4>
              <p className="text-blue-400 font-bold text-sm mb-4">Class 12th CBSE</p>
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl py-2 px-4 shadow-inner">
                <span className="text-white font-black text-lg">98.5%</span>
                <span className="block text-blue-100 text-xs font-medium uppercase tracking-wider">District Topper</span>
              </div>
            </div>

            {/* Achievement 2 */}
            <div className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-yellow-400/50 hover:bg-white/10 transition-all duration-300 text-center hover:-translate-y-2">
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full shadow-lg transform rotate-12 z-20">JEE Advanced</div>
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-slate-800 group-hover:border-yellow-400 transition-colors shadow-2xl">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Ananya Singh" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-yellow-600/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <h4 className="text-xl font-bold text-white mb-1">Ananya Singh</h4>
              <p className="text-yellow-400 font-bold text-sm mb-4">Foundation Batch</p>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl py-2 px-4 shadow-inner">
                <span className="text-white font-black text-lg">AIR 1420</span>
                <span className="block text-yellow-100 text-xs font-medium uppercase tracking-wider">Selected for IIT</span>
              </div>
            </div>

            {/* Achievement 3 */}
            <div className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-sky-400/50 hover:bg-white/10 transition-all duration-300 text-center hover:-translate-y-2">
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-slate-800 group-hover:border-sky-400 transition-colors shadow-2xl">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Rohan Gupta" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-sky-600/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <h4 className="text-xl font-bold text-white mb-1">Rohan Gupta</h4>
              <p className="text-sky-400 font-bold text-sm mb-4">MDCA Course</p>
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl py-2 px-4 shadow-inner">
                <span className="text-white font-black text-lg">TCS Ninja</span>
                <span className="block text-sky-100 text-xs font-medium uppercase tracking-wider">Campus Placed</span>
              </div>
            </div>

            {/* Achievement 4 */}
            <div className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-green-400/50 hover:bg-white/10 transition-all duration-300 text-center hover:-translate-y-2">
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-slate-800 group-hover:border-green-400 transition-colors shadow-2xl">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Megha Patel" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-green-600/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <h4 className="text-xl font-bold text-white mb-1">Megha Patel</h4>
              <p className="text-green-400 font-bold text-sm mb-4">Class 10th ICSE</p>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl py-2 px-4 shadow-inner">
                <span className="text-white font-black text-lg">96.8%</span>
                <span className="block text-green-100 text-xs font-medium uppercase tracking-wider">School Topper</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section id="reviews" className="relative z-10 py-24 bg-white border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Loved by Students & Parents
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl font-black text-slate-900">4.9</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-7 h-7 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-lg font-medium text-slate-500">
              Based on genuine Google Reviews from our successful students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 font-medium leading-relaxed italic">
                "Amogh Academy transformed my approach to studies. The faculty is incredibly supportive and the smart classroom setup makes learning complex topics easy. Highly recommend for JEE preparation!"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Aarav Singh</h4>
                  <p className="text-sm text-slate-500 font-medium">Class 12th Student</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 font-medium leading-relaxed italic">
                "Completed my MDCA course here. The practical labs and knowledgeable instructors helped me gain confidence. Best computer institute in Varanasi with actual placement assistance."
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-lg">
                  P
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Priya Sharma</h4>
                  <p className="text-sm text-slate-500 font-medium">MDCA Batch</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 font-medium leading-relaxed italic">
                "The environment is perfect for focused study. Regular tests and doubt-clearing sessions kept me on track for my board exams. Thanks to the entire team at Amogh Academy."
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                  R
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Rahul Verma</h4>
                  <p className="text-sm text-slate-500 font-medium">Foundation Course</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section [NEW] */}
      <section className="relative z-10 py-32 border-t border-slate-200/50 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                 Community Feedback
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">Voices of Success</h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">Hear from the students and parents who have experienced the Amogh transformation.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Rahul Singh", role: "JEE Aspirant", quote: "Amogh Academy completely changed my outlook on Physics. The teachers go above and beyond." },
                { name: "Suman Tiwari", role: "Parent", quote: "The foundation course for class 10 was excellent. My daughter showed significant improvement in her boards." },
                { name: "Priya Verma", role: "MDCA Student", quote: "Professional environment and practical training. I secured a job right after course completion." }
              ].map((testi, idx) => (
                <div key={idx} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm relative group hover:shadow-2xl transition-all h-full flex flex-col">
                   <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Quote className="h-12 w-12 text-blue-600" />
                   </div>
                   <div className="flex gap-1 mb-6">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                   </div>
                   <p className="text-xl font-bold text-slate-800 leading-relaxed mb-8 flex-grow italic">"{testi.quote}"</p>
                   <div className="flex items-center gap-4 border-t border-slate-200/50 pt-8 mt-auto">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black">{testi.name.charAt(0)}</div>
                      <div>
                         <p className="font-black text-slate-900 tracking-tight">{testi.name}</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{testi.role}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* FAQ Section [NEW] */}
      <section className="relative z-10 py-32 border-t border-slate-200/50 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-20 space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-slate-700 font-black text-[10px] uppercase tracking-widest">
                 Information Center
              </div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">Common Questions</h2>
           </div>

           <div className="space-y-4">
              {[
                { q: "What boards do you cover in your coaching?", a: "We provide comprehensive coaching for C.B.S.E. and I.C.S.E. boards from classes 6th to 12th." },
                { q: "Do you offer job placement after computer courses?", a: "Yes, our MDCA and DCA graduates receive dedicated placement training and assistance to secure relevant roles." },
                { q: "Are there free demo classes available?", a: "Absolutely! We encourage all parents and students to book a free demo session to experience our teaching methodology." },
                { q: "Do you provide online learning materials?", a: "Yes, our registered students get exclusive access to our premium digital portal featuring video lectures and sample papers." }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all group">
                   <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <HelpCircle className="h-5 w-5" />
                         </div>
                         <h4 className="text-xl font-black text-slate-900 tracking-tight">{faq.q}</h4>
                      </div>
                   </div>
                   <div className="mt-6 pl-15">
                      <p className="text-slate-500 font-medium leading-relaxed border-l-2 border-slate-100 pl-6 ml-5">
                        {faq.a}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <div className="bg-slate-950 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#2563eb30_0%,transparent_60%)] group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10 space-y-10">
                 <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                    Ready to Start Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Journey to Success?</span>
                 </h2>
                 <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
                   Join thousands of successful learners today. Admissions are now active for the upcoming academic session.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-12 py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95">
                       Register For Demo
                    </button>
                    <a href="/contact" className="px-12 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-white/20 transition-all">
                       Contact Support
                    </a>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
