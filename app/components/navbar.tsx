"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, ArrowRight, Menu, X, ChevronRight, BookOpen, LogOut, LayoutDashboard, User, Settings, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


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
    { name: "Courses", href: "/courses", color: "bg-blue-400" },
    { name: "Contact", href: "/contact", color: "bg-blue-600" },
  ];

  return (
    <>
      <nav 
        className="fixed top-0 left-0 w-full z-[100] transition-all duration-300 ease-in-out translate-y-0"
      >
        <div className="w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 flex justify-between items-center py-4">
            <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity shrink-0">
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
            <div className="flex items-center gap-3">
              {status === "authenticated" ? (
                <div className="relative">
                   <button 
                     onClick={() => setIsProfileOpen(!isProfileOpen)}
                     className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-2xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                   >
                     <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
                       {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                     </div>
                     <span className="text-sm font-black text-slate-900 leading-none">{session?.user?.name?.split(' ')[0] || "User"}</span>
                     <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                   </button>

                   {/* Dropdown Menu */}
                   {isProfileOpen && (
                     <>
                       <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                       <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 py-4 z-20 animate-in fade-in slide-in-from-top-2">
                          <div className="px-6 py-4 border-b border-slate-50 mb-2">
                             <p className="text-sm font-black text-slate-900">{session?.user?.name}</p>
                             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{session?.user?.role || "Member"}</p>
                          </div>
                          
                          <div className="px-3 space-y-1">
                             <a 
                               href="/dashboard" 
                               className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold text-sm"
                               onClick={() => setIsProfileOpen(false)}
                             >
                                <LayoutDashboard className="w-5 h-5" />
                                My Dashboard
                             </a>
                             <a 
                               href="/profile" 
                               className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold text-sm"
                               onClick={() => setIsProfileOpen(false)}
                             >
                                <User className="w-5 h-5" />
                                Account Settings
                             </a>
                          </div>

                          <div className="px-3 mt-4 pt-4 border-t border-slate-50">
                             <button 
                               onClick={() => signOut({ callbackUrl: "/" })}
                               className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm text-left"
                             >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                             </button>
                          </div>
                       </div>
                     </>
                   )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2 mr-2">
                  <a 
                    href="/login" 
                    className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-black transition-all text-xs uppercase tracking-widest hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                  >
                     Portal Access
                  </a>
                </div>
              )}

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

            <div className="pt-6 space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Account Access</p>
              {status === "authenticated" ? (
                <>
                  <a 
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-5 rounded-2xl bg-blue-600 text-white font-black shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-5 h-5" />
                      <span>My Dashboard</span>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 p-5 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 transition-all text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <a 
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-blue-700 font-bold hover:bg-blue-100 transition-all"
                  >
                    <GraduationCap className="w-5 h-5" />
                    Student Login
                  </a>
                  <a 
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-indigo-700 font-bold hover:bg-indigo-100 transition-all"
                  >
                    <BookOpen className="w-5 h-5" />
                    Teacher Login
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Footer Branding */}
          <div className="p-6 border-t border-slate-100">
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Amogh Academy 2024-25</p>
          </div>
        </div>
      </div>
    </>
  );
}
