"use client";

import React from "react";
import { 
  Users, GraduationCap, BookOpen, TrendingUp, 
  Clock, CheckCircle, AlertCircle, PlusCircle, 
  Calendar, FileText, Settings, 
  LayoutDashboard, ShieldAlert
} from "lucide-react";

const stats = [
  { label: "Total Students", value: "248", icon: GraduationCap, color: "blue" },
  { label: "Total Teachers", value: "32", icon: BookOpen, color: "indigo" },
  { label: "Active Classes", value: "18", icon: Clock, color: "sky" },
  { label: "Pending Approvals", value: "5", icon: AlertCircle, color: "red" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">System Overview</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Real-time Academy Analytics & Management</p>
        </div>
        <button className="flex items-center gap-3 px-6 py-3 bg-red-600 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-red-600/20 hover:scale-105 active:scale-95 transition-all">
          <PlusCircle className="h-4 w-4" />
          Add Resource
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative group hover:border-slate-700 transition-all shadow-lg hover:shadow-2xl">
            <div className={`shrink-0 w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-${stat.color}-500/80 mb-6 border border-slate-700 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Management Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/20 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-white tracking-tight">System Logs</h3>
            <button className="text-xs font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors">View All Activities</button>
          </div>
          
          <div className="space-y-6">
            {[
              { type: "signup", user: "Rahul Sharma", action: "joined as Student", time: "2 mins ago" },
              { type: "approval", user: "Ms. Priyanka", action: "approved as Teacher", time: "1 hour ago" },
              { type: "class", user: "JEE Adv. Batch B", action: "new class created", time: "5 hours ago" },
              { type: "security", user: "Admin Login", action: "successful verification", time: "Yesterday" }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-5 p-4 rounded-3xl bg-slate-800/30 border border-slate-800/50 hover:bg-slate-800/50 transition-all">
                <div className={`w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 shadow-sm transition-all`}>
                  {activity.type === 'signup' ? <GraduationCap className="w-5 h-5 text-blue-500" /> : 
                   activity.type === 'approval' ? <CheckCircle className="w-5 h-5 text-green-500" /> : 
                   activity.type === 'security' ? <ShieldAlert className="w-5 h-5 text-red-500" /> : 
                   <Calendar className="w-5 h-5 text-sky-500" />}
                </div>
                <div>
                   <p className="text-sm font-bold text-white"><span className="text-red-500">{activity.user}</span> {activity.action}</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-8">
           <div className="bg-gradient-to-br from-red-600 to-red-900 rounded-[3rem] p-10 shadow-2xl shadow-red-600/10">
             <h3 className="text-2xl font-black text-white tracking-tight mb-6">Master Controls</h3>
             <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Manage DB", icon: Settings },
                  { name: "Backup Data", icon: FileText },
                  { name: "Audit Logs", icon: TrendingUp },
                  { name: "System State", icon: LayoutDashboard }
                ].map((action, idx) => (
                  <button key={idx} className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] gap-3 text-white transition-all hover:bg-white/20 hover:scale-105">
                    <action.icon className="h-6 w-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center">{action.name}</span>
                  </button>
                ))}
             </div>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 text-center shadow-xl">
              <PlusCircle className="h-10 w-10 text-slate-500 mx-auto mb-4" />
              <h4 className="text-lg font-black text-white mb-2">New Site Section?</h4>
              <p className="text-sm text-slate-500 font-medium mb-6">Initialize a new route for the academy portal immediately.</p>
              <button className="w-full py-4 bg-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-all">Create Route</button>
           </div>
        </div>
      </div>
    </div>
  );
}
