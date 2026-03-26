"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex justify-between items-center bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl px-5 py-3 shadow-md">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tighter text-slate-900 leading-none">AMOGH</span>
              <span className="font-bold text-[9px] text-blue-600 tracking-[0.2em] uppercase leading-none mt-1">Academy</span>
            </div>
          </a>
          <div className="hidden md:flex space-x-8">
            <a href="/#coaching" className="text-slate-600 hover:text-blue-600 font-bold transition-colors text-xs uppercase tracking-wider relative group">
              Coaching
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
            </a>
            <a href="/#computer-edu" className="text-slate-600 hover:text-blue-600 font-bold transition-colors text-xs uppercase tracking-wider relative group">
              Computer Edu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="/contact" className="text-slate-600 hover:text-blue-600 font-bold transition-colors text-xs uppercase tracking-wider relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </a>
          </div>
          <div>
            <a href="/contact" className="group relative inline-flex items-center justify-center px-5 py-2 font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-700 border border-transparent rounded-full hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 focus:outline-none text-sm">
              <span>Join Now</span>
              <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
