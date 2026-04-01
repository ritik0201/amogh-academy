"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, ArrowRight, Menu, X, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY); //
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Coaching", href: "/coaching", color: "bg-blue-500" },
    { name: "Classes", href: "/classes", color: "bg-sky-500" },
    { name: "Faculty", href: "/faculty", color: "bg-slate-700" },
    { name: "Computer Edu", href: "/computer-edu", color: "bg-blue-400" },
    { name: "Contact", href: "/contact", color: "bg-blue-600" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
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

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  className="text-slate-600 hover:text-blue-600 font-bold transition-colors text-xs uppercase tracking-wider relative group"
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${link.color} transition-all group-hover:w-full`}></span>
                </a>
              ))}
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <a href="/join-us" className="group relative inline-flex items-center justify-center px-5 py-2 font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-700 border border-transparent rounded-full hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 focus:outline-none text-sm">
                  <span>Join Now</span>
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all active:scale-90"
              >
                {isMenuOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {/* Sidebar Container */}
        <div 
          className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-black text-slate-900 text-lg tracking-tighter">AMOGH</span>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 bg-white text-slate-400 hover:text-slate-600 rounded-xl shadow-sm border border-slate-200 transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Navigations</p>
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
              >
                <span className="text-slate-700 font-bold group-hover:text-blue-600">{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="p-6 border-t border-slate-100 space-y-4">
            <a 
              href="/join-us"
              onClick={() => setIsMenuOpen(false)}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-black text-lg shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              <span>Join Academy</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admissions Open 2024-25</p>
          </div>
        </div>
      </div>
    </>
  );
}
