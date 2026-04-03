"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  BookOpen, Video, Star, Award, TrendingUp, Calendar, 
  ArrowRight, Sparkles, GraduationCap, Loader2 
} from "lucide-react";

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching student stats:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold mb-6 text-xs uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight text-slate-50">
            Welcome back, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
              {session?.user?.name || "Student"}
            </span>
          </h1>
          <p className="text-slate-400 text-lg font-medium mb-8 leading-relaxed">
            Your progress is looking great this week. "The beautiful thing about learning is that no one can take it away from you."
          </p>
          <a href="/student/course" className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
            Resume Learning <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
             <Video className="w-6 h-6" />
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-lg"></div>
          ) : (
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {stats?.totalCourses || 0}
            </p>
          )}
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Video Courses</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
             <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">85%</p>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Engagement Rate</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
             <Star className="w-6 h-6" fill="currentColor" />
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">Top</p>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Student Status</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 mb-4">
             <Award className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">12</p>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Skills Mastered</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Learning Activity */}
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> Learning Schedule
               </h3>
               <button className="text-sm font-bold text-blue-600 hover:underline">View Full Calendar</button>
            </div>
            
            <div className="space-y-4">
               {!stats?.recentCourses || stats.recentCourses.length === 0 ? (
                 <div className="py-10 text-center">
                    <p className="text-slate-400 font-bold">You are not enrolled in any courses yet.</p>
                    <a href="/courses" className="text-blue-600 text-sm font-black uppercase tracking-widest hover:underline mt-2 inline-block">Browse Courses</a>
                 </div>
               ) : (
                 stats.recentCourses.map((item: any, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-6 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all cursor-pointer"
                      onClick={() => window.location.href = `/student/course`}
                    >
                       <div className="text-slate-400 font-bold text-xs uppercase w-24">Enrolled</div>
                       <div className="flex-grow">
                          <h4 className="font-bold text-slate-900 tracking-tight">{item.title}</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">By {item.teacher?.name || "Faculty"}</p>
                       </div>
                       <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-blue-100`}>
                          Active
                       </div>
                    </div>
                 ))
               )}
            </div>
         </div>

         {/* Achievement Section */}
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-600/30 transform rotate-6">
               <GraduationCap className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Academic Champion</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6 px-4">
               You are in the top 5% of students in Varanasi this month! Keep up the brilliant work.
            </p>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
               <div className="w-4/5 h-full bg-blue-600 rounded-full"></div>
            </div>
            <div className="flex justify-between w-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <span>Next Lvl: Scholar</span>
               <span>80% Done</span>
            </div>
         </div>
      </div>
    </div>
  );
}
