"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, BookOpen, Calendar, ClipboardList, 
  ArrowRight, PlusCircle, CheckCircle2, TrendingUp,
  Award, Clock, Loader2
} from "lucide-react";

export default function TeacherDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teacher/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching teacher stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Assigned Courses", value: stats?.totalCourses || 0, icon: BookOpen, color: "blue" },
    { label: "Total Students", value: stats?.totalStudents || 0, icon: Users, color: "indigo" },
    { label: "Average Rating", value: "4.9/5", icon: Award, color: "amber" }
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 underline decoration-indigo-200 underline-offset-8">Faculty Hub</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Academic Management & Student Engagement</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-[2rem] font-black text-xs uppercase tracking-widest text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all">
             <Calendar className="h-4 w-4" />
             My Schedule
           </button>
           <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 rounded-[2rem] font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
             <PlusCircle className="h-4 w-4" />
             New Assignment
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 border border-${stat.color}-100 mb-8 transition-transform group-hover:scale-110 group-hover:-rotate-3`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            {loading ? (
               <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            ) : (
               <h3 className="text-4xl font-black text-slate-900">{stat.value}</h3>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Today's Lectures</h3>
            <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Full Schedule</button>
          </div>
          
          <div className="space-y-6">
            {!stats?.recentCourses || stats.recentCourses.length === 0 ? (
              <div className="p-10 border border-dashed border-slate-200 rounded-[2.5rem] text-center">
                 <p className="text-slate-400 font-bold tracking-tight">No active courses assigned yet.</p>
              </div>
            ) : (
              stats.recentCourses.map((cls: any, idx: number) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm flex flex-wrap items-center justify-between gap-8 hover:shadow-2xl hover:border-indigo-100 transition-all group">
                  <div className="flex gap-6 items-center">
                    <div className={`w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm`}>
                       <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 mb-1">{cls.title}</h4>
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-500">Live Course</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-12 items-center">
                     <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Students</p>
                        <p className="text-lg font-black text-slate-800">{cls.enrolledStudents?.length || 0}</p>
                     </div>
                     <button 
                       onClick={() => window.location.href = `/teacher/course`}
                       className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform"
                     >
                        <ArrowRight className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-10">
           <div className="bg-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[4rem] group-hover:scale-110 transition-transform"></div>
              <h3 className="text-2xl font-black mb-8">Announcements</h3>
              <div className="space-y-8">
                 {[
                   { title: "Syllabus Update: Unit 4", type: "Urgent", date: "Today" },
                   { title: "Doubt Clearing Session", type: "General", date: "Wed" }
                 ].map((ann, idx) => (
                   <div key={idx} className="border-l-2 border-indigo-400/30 pl-5">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${ann.type === 'Urgent' ? 'text-red-400' : 'text-indigo-300'}`}>{ann.type}</span>
                      <h4 className="font-bold text-sm mt-1">{ann.title}</h4>
                      <p className="text-[10px] font-black text-indigo-400/80 uppercase tracking-widest mt-2">{ann.date}</p>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-5 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                 Public Notice Board
              </button>
           </div>

           <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm">
             <h3 className="text-2xl font-black text-slate-900 mb-8">Quick Eval</h3>
             <div className="space-y-6">
                {[
                  { name: "Assignment #4", pending: 12, total: 45 },
                  { name: "Weekly Quiz", pending: 5, total: 28 }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-sm font-black text-slate-800 mb-4">{item.name}</p>
                    <div className="flex justify-between items-end">
                       <span className="text-xs font-bold text-slate-500">{item.pending} Pending</span>
                       <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Grade Now</button>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
