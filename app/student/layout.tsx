"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, BookOpen, User, LogOut, 
  GraduationCap, Search, Bell, Menu, X, ChevronRight, Video, Star, Award
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "../components/navbar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "My Learning", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "My Courses", href: "/student/course", icon: Video },
    { name: "Achievements", href: "/student/achievements", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Global Navbar */}
      <Navbar />

      <div className="flex flex-grow pt-[72px] relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-[72px] left-0 h-[calc(100vh-72px)] w-72 bg-white border-r border-slate-200 
          flex flex-col shrink-0 z-40 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="p-8 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20 text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tighter text-slate-900 leading-none">STUDENT</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Learning Hub</span>
              </div>
            </div>
            <button className="lg:hidden p-2 text-slate-500" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-grow p-6 space-y-2 overflow-y-auto mt-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-4">Study Room</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                    isActive 
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                    : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-slate-100">
             <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-3xl p-5 border border-blue-100/50 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm mb-3">
                   <Star className="w-6 h-6" fill="currentColor" />
                </div>
                <p className="text-sm font-black text-slate-900 leading-tight">Keep Pushing, {session?.user?.name?.split(' ')[0] || "Student"}!</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">You're doing great</p>
             </div>
          </div>
        </aside>

        <div className="flex-grow flex flex-col min-w-0 bg-slate-50 relative">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed top-24 left-6 z-50 p-3 bg-blue-600/90 backdrop-blur-sm text-white rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>

          <main className="flex-grow p-6 lg:p-10 overflow-y-auto">
             <div className="max-w-7xl mx-auto">
               {children}
             </div>
          </main>
        </div>
      </div>
    </div>
  );
}
