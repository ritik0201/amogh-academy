"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  Users, UserCheck, Settings, LayoutDashboard, 
  LogOut, ShieldAlert, GraduationCap, BookOpen, 
  Search, Bell, Menu, X, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "../components/navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Courses", href: "/admin/course", icon: BookOpen },
    { name: "Students", href: "/admin/students", icon: GraduationCap },
    { name: "Teachers", href: "/admin/teachers", icon: Users },
    { name: "Approvals", href: "/admin/approvals", icon: UserCheck },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Global Navbar */}
      <Navbar />

      <div className="flex flex-grow pt-[72px] relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-30 lg:hidden animate-in fade-in duration-300"
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
              <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-600/20">
                <ShieldAlert className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tighter text-white leading-none">ADMIN</span>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">Master Portal</span>
              </div>
            </div>
            <button className="lg:hidden p-2 text-slate-500" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-4">Management</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                    isActive 
                    ? "bg-red-600 text-white shadow-xl shadow-red-600/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-slate-800">
             <div className="bg-slate-950/40 rounded-[2rem] p-6 border border-slate-800 shadow-inner">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500 border border-red-500/20">
                      <ShieldCheck className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Security</p>
                      <p className="text-sm font-bold text-white">Lvl. 10 Active</p>
                   </div>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full w-[100%] bg-red-600 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>
             </div>
          </div>
        </aside>

        <div className="flex-grow flex flex-col min-w-0 bg-slate-950 relative">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed top-24 left-6 z-50 p-3 bg-red-600/90 backdrop-blur-sm text-white rounded-xl shadow-lg shadow-red-600/20 active:scale-95 transition-all"
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
