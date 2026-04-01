"use client";

import React, { useState } from "react";
import { 
  User, Phone, Mail, Book, CheckCircle, 
  ArrowRight, ShieldCheck, Sparkles, GraduationCap, Monitor
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function JoinUsPage() {
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white relative">
      {/* Universal Grid Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 pointer-events-none"></div>
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Column: Why Join Us */}
            <div className="space-y-12">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold mb-6 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">Join Amogh Academy</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
                  Begin Your Journey <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">to Excellence</span>
                </h1>
                <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
                  Take the first step towards a brighter future. Join a community of achievers and learn from the best in the industry.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Quality Guaranteed",
                    desc: "Our courses are designed and taught by industry experts with deep pedagogical knowledge.",
                    color: "blue"
                  },
                  {
                    icon: GraduationCap,
                    title: "Certified Curriculum",
                    desc: "Academic paths aligned with CBSE/ICSE boards and national competitive standards.",
                    color: "sky"
                  },
                  {
                    icon: Monitor,
                    title: "Modern Infrastructure",
                    desc: "Experience learning through smart classrooms, practical labs, and interactive sessions.",
                    color: "indigo"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className={`shrink-0 w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                      ${item.color === 'blue' ? 'text-blue-500' : ''}
                      ${item.color === 'sky' ? 'text-sky-500' : ''}
                      ${item.color === 'indigo' ? 'text-indigo-500' : ''}
                    `}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-8 border-t border-slate-200">
                <div className="flex items-center gap-4 text-slate-500 font-bold">
                   <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                          <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" className="w-full h-full object-cover" />
                       </div>
                     ))}
                   </div>
                   <span className="text-sm">Join 500+ successful students from Varanasi!</span>
                </div>
              </div>
            </div>

            {/* Right Column: Inquiry Form Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 opacity-20 blur-[100px] rounded-full -z-10 translate-x-1/4 -translate-y-1/4"></div>
              <div className="absolute inset-0 bg-sky-400 opacity-20 blur-[100px] rounded-full -z-10 -translate-x-1/4 translate-y-1/4"></div>
              
              <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 md:p-14 shadow-2xl border border-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-12 -mt-12 transition-all"></div>
                
                <div className="mb-10 text-center relative z-10">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Claim Your Seat</h3>
                  <p className="text-slate-500 font-medium">Book a free demo class today and experience the difference.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Your Full Name" 
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-900 shadow-sm"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="WhatsApp Mobile Number" 
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-900 shadow-sm"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="Email Address" 
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-900 shadow-sm"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <select 
                      name="course" 
                      value={formData.course} 
                      onChange={handleChange} 
                      className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700 shadow-sm appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Interested Course</option>
                      <option value="Foundation (6th - 10th)">Foundation (6th - 10th)</option>
                      <option value="Advanced (11th - 12th)">Advanced (11th - 12th)</option>
                      <option value="CUET/NEET/JEE">Competitive (CUET/NEET/JEE)</option>
                      <option value="Computer DCA/ADCA/CCC">Computer (DCA/ADCA/CCC)</option>
                    </select>
                  </div>

                  {errorMessage && (
                    <div className="text-red-500 text-sm font-bold bg-red-50 border border-red-100 rounded-xl p-4">{errorMessage}</div>
                  )}

                  {status === "success" && (
                    <div className="text-green-600 text-sm font-bold bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" />
                      Inquiry received! We will contact you within 24 hours.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={status === "loading"}
                    className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-blue-600 to-blue-800 text-white font-black text-xl hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {status === "loading" ? "SENDING..." : "SUBMIT INQUIRY"}
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
