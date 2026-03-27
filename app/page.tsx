"use client";

import React, { useState } from "react";
import { 
  GraduationCap, Monitor, CheckCircle, 
  BookOpen, Award, Zap, ChevronRight, User, Phone, Mail, Book, Star
} from "lucide-react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
      <section className="relative z-10 pt-32 pb-16 lg:pt-40 lg:pb-24 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Text */}
            <div className="text-left relative z-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 text-blue-700 font-bold mb-8 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                </span>
                <span className="text-xs uppercase tracking-widest">Admissions Open 2024-25</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-[1.05] text-slate-900">
                Unlock Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">True Potential</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 font-medium mb-8 leading-relaxed max-w-lg border-l-4 border-blue-500 pl-5">
                Join Varanasi's premier institute for <span className="font-bold text-slate-800">expert K-12 coaching</span> and <span className="font-bold text-slate-800">advanced computer education</span>. We build careers, not just students.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <a href="#coaching" className="group px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 text-center flex items-center gap-2">
                  Explore Courses
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#contact" className="px-8 py-3.5 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 font-bold text-base hover:bg-white hover:border-slate-300 transition-all shadow-sm text-center">
                  Contact Us
                </a>
              </div>
              
              <div className="mt-12 flex items-center gap-6 text-sm font-bold text-slate-500">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200/50"><CheckCircle className="w-4 h-4 text-blue-500"/> Certified Tutors</div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200/50"><Award className="w-4 h-4 text-blue-500"/> Job Placement</div>
              </div>
            </div>

            {/* Right Column: Premium Inquiry Form */}
            <div className="relative z-20 flex justify-center lg:justify-end">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-sky-100 rounded-[2.5rem] transform rotate-3 scale-[1.02] blur-md opacity-50"></div>
              <div className="bg-white/80 backdrop-blur-2xl p-8 w-full max-w-[440px] rounded-[2rem] shadow-2xl border border-white relative relative">
                
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Claim Your Seat</h3>
                  <p className="text-slate-500 font-medium mt-2">Book a free demo class today and experience the Amogh difference.</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white/90 shadow-sm font-medium text-slate-900 placeholder-slate-400" placeholder="Full Name" />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white/90 shadow-sm font-medium text-slate-900 placeholder-slate-400" placeholder="Mobile Number" />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white/90 shadow-sm font-medium text-slate-900 placeholder-slate-400" placeholder="Email Address" />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Book className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <select name="course" value={formData.course} onChange={handleChange} required className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white/90 shadow-sm font-medium text-slate-700 appearance-none cursor-pointer">
                      <option value="" disabled hidden>Select Course of Interest</option>
                      <option value="Foundation (6th - 12th)">Foundation (6th - 12th)</option>
                      <option value="Competitive (CUET/NEET/JEE)">Competitive (CUET/NEET/JEE)</option>
                      <option value="Computer Science (MDCA/DCA/CCC)">Computer Science (MDCA/DCA/CCC)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                       <ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
                    </div>
                  </div>
                  
                  {errorMessage && (
                    <div className="text-red-500 text-sm font-medium px-2">{errorMessage}</div>
                  )}

                  {status === "success" && (
                    <div className="text-green-600 bg-green-50 border border-green-200 rounded-lg p-3 text-sm font-medium flex items-center gap-2">
                       <CheckCircle className="w-5 h-5 flex-shrink-0" />
                       Inquiry sent successfully! We'll contact you soon.
                    </div>
                  )}

                  <button type="submit" disabled={status === "loading"} className="w-full py-4 mt-4 rounded-xl bg-slate-900 text-white font-black text-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-slate-900">
                    {status === "loading" ? "Sending..." : "Submit Inquiry"}
                  </button>
                </form>
              </div>
            </div>

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
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50"></div>
                    <span className="font-bold text-slate-700">Arts</span>
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
            </div>
          </div>
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

      <Footer />
    </div>
  );
}
