"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, Users, BookOpen, Calendar, 
  MessageSquare, User, LogOut, GraduationCap, 
  Search, Bell, ClipboardList, TrendingUp, Menu, X, ChevronRight, Video
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "../components/navbar";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "My Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
    { name: "My Courses", href: "/teacher/course", icon: Video },
    { name: "My Students", href: "/teacher/students", icon: Users },
    { name: "Curriculum", href: "/teacher/curriculum", icon: BookOpen },
    { name: "Schedules", href: "/teacher/schedules", icon: Calendar },
    { name: "Assignments", href: "/teacher/assignments", icon: ClipboardList },
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
          fixed lg:sticky top-[72px] left-0 h-[calc(100vh-72px)] w-72 bg-slate-900 border-r border-slate-800 
          flex flex-col shrink-0 z-40 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="p-8 flex items-center justify-between border-b border-slate-800 bg-slate-950/20">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tighter text-white leading-none text-slate-50">FACULTY</span>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1 tracking-wider">Academic Portal</span>
              </div>
            </div>
            <button className="lg:hidden p-2 text-slate-500" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-grow p-6 space-y-2 overflow-y-auto mt-4 text-slate-200">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-4">Faculty Menu</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                    isActive 
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-500"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-slate-800">
             <div className="bg-slate-800/50 rounded-3xl p-5 border border-slate-800/50 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 mb-3">
                   <TrendingUp className="w-6 h-6" />
                </div>
                <p className="text-xl font-black text-white">+12.5%</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Growth vs Last Sem</p>
             </div>
          </div>
        </aside>

        <div className="flex-grow flex flex-col min-w-0 bg-slate-50 relative">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed top-24 left-6 z-50 p-3 bg-indigo-600/90 backdrop-blur-sm text-white rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
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
