"use client";

import React, { useState } from "react";
import { 
  Phone, MapPin, Mail, User, Book, ChevronRight, CheckCircle, MessageSquare
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMessage("Please fill all required fields");
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
        setFormData({ name: "", phone: "", email: "", message: "" });
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative overflow-hidden flex items-center">
        {/* Square box background theme */}
        <div className="absolute inset-0 z-0 bg-blue-50/50"></div>
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex flex-col gap-16 items-center">
            
            {/* Top Side: Contact Information */}
            <div className="w-full text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-slate-900 leading-[1.1]">
                Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Journey Today</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 font-medium mb-12 leading-relaxed max-w-2xl mx-auto">
                Get personalized guidance, top-tier resources, and job placement assistance at Amogh Academy.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="flex items-start gap-5 group bg-white/60 p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="bg-blue-100 p-4 xl:p-5 rounded-2xl group-hover:scale-110 group-hover:bg-blue-600 transition-all group-hover:text-white text-blue-600">
                    <Phone className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black mb-1 text-slate-900">Call Us Now</h4>
                    <a href="tel:+919807737046" className="block text-slate-600 font-bold text-lg hover:text-blue-600 transition-colors mb-1">+91-9807737046</a>
                    <a href="tel:+917460008625" className="block text-slate-600 font-bold text-lg hover:text-blue-600 transition-colors">+91-7460008625</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-5 group bg-white/60 p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="bg-sky-100 p-4 xl:p-5 rounded-2xl group-hover:scale-110 group-hover:bg-sky-500 transition-all group-hover:text-white text-sky-600">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black mb-2 text-slate-900">Visit Our Campus</h4>
                    <p className="text-slate-600 font-medium text-lg leading-relaxed">
                      1st Floor, La-paradise Building,<br />
                      (Above Axis Bank) Panchkoshi Road,<br />
                      Ashok Nagar, Sarang Talab, Varanasi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Side: Contact Form Area */}
            <div className="relative w-full max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-sky-300 rounded-[2.5rem] transform rotate-1 scale-[1.02] blur-xl opacity-40"></div>
              
              <div className="bg-white/90 backdrop-blur-2xl p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white relative z-10 w-full">
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Drop a Message</h3>
                  <p className="text-slate-500 font-medium mt-2">Fill the form below and we will get back to you shortly.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white shadow-sm font-medium text-slate-900 placeholder-slate-400" placeholder="Full Name *" />
                    </div>

                    {/* Phone */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white shadow-sm font-medium text-slate-900 placeholder-slate-400" placeholder="Mobile Number *" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white shadow-sm font-medium text-slate-900 placeholder-slate-400" placeholder="Email Address *" />
                  </div>



                  {/* Message Field */}
                  <div className="relative group">
                    <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <textarea 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      rows={4}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white shadow-sm font-medium text-slate-900 placeholder-slate-400 resize-none" 
                      placeholder="Your Message (Optional)" 
                    />
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

                  <button type="submit" disabled={status === "loading"} className="w-full py-4 mt-6 rounded-xl bg-blue-600 text-white font-black text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-blue-600 flex justify-center items-center gap-2">
                    {status === "loading" ? "Sending..." : "Submit Message"}
                    {status !== "loading" && <ChevronRight className="w-5 h-5" />}
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
