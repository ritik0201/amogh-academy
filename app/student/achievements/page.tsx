"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { 
  Award, Star, Zap, Target, BookOpen, 
  Video, Clock, ShieldCheck, Trophy, Sparkles, 
  ChevronRight, ArrowUpRight
} from "lucide-react";

export default function AchievementsPage() {
  const { data: session } = useSession();

  const achievements = [
    { 
      id: 1, 
      title: "Fast Learner", 
      desc: "Completed your first 5 lectures in a single day.", 
      icon: Zap, 
      color: "amber",
      unlocked: true,
      progress: 100
    },
    { 
      id: 2, 
      title: "Course Crusher", 
      desc: "Fully completed a certified course.", 
      icon: Trophy, 
      color: "blue",
      unlocked: false,
      progress: 45
    },
    { 
      id: 3, 
      title: "Early Bird", 
      desc: "Attended a 7:00 AM live session.", 
      icon: Sparkles, 
      color: "sky",
      unlocked: true,
      progress: 100
    },
    { 
      id: 4, 
      title: "Dedicated Student", 
      desc: "Logged in for 7 consecutive days.", 
      icon: ShieldCheck, 
      color: "emerald",
      unlocked: false,
      progress: 80
    },
  ];

  const stats = [
    { label: "Learning Points", value: "1,250", icon: Star, color: "text-amber-500" },
    { label: "Rank", value: "Silver II", icon: Target, color: "text-blue-500" },
    { label: "Badges", value: "12", icon: Award, color: "text-purple-500" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-10 md:p-14 text-white shadow-2xl">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40 animate-pulse"></div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] mb-6">
               <Trophy className="w-3 h-3" /> Player Stats
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Your Achievements</h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
              Every lecture you watch and every quiz you solve brings you closer to mastery. 
              Keep pushing, <span className="text-white">{session?.user?.name?.split(' ')[0] || "Student"}!</span>
            </p>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[3rem] -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} mb-6 relative z-10`}>
               <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 relative z-10">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Achievement List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Milestones</h3>
           <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
             Leaderboard <ArrowUpRight className="w-3 h-3" />
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {achievements.map((item) => (
            <div 
              key={item.id} 
              className={`p-8 rounded-[2.5rem] border transition-all flex items-start gap-8 relative overflow-hidden group ${
                item.unlocked 
                ? "bg-white border-slate-100 hover:shadow-2xl hover:border-blue-100" 
                : "bg-slate-50/50 border-slate-200 grayscale opacity-80"
              }`}
            >
              <div className={`shrink-0 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-transform ${
                item.color === 'amber' ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                item.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                item.color === 'sky' ? 'bg-gradient-to-br from-sky-400 to-blue-500' :
                'bg-gradient-to-br from-emerald-400 to-green-600'
              }`}>
                 <item.icon className="w-8 h-8" />
              </div>

              <div className="space-y-3 flex-grow">
                 <div className="flex justify-between items-start">
                    <h4 className="text-xl font-black text-slate-900">{item.title}</h4>
                    {item.unlocked ? (
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest">Unlocked</span>
                    ) : (
                      <span className="text-[9px] font-black text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-widest">Locked</span>
                    )}
                 </div>
                 <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                 
                 <div className="pt-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
                       <span>Progress</span>
                       <span>{item.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-1000 ${
                           item.color === 'amber' ? 'bg-amber-500' :
                           item.color === 'blue' ? 'bg-blue-500' :
                           item.color === 'sky' ? 'bg-sky-500' :
                           'bg-emerald-500'
                         }`}
                         style={{ width: `${item.progress}%` }}
                       ></div>
                    </div>
                 </div>
              </div>

              {/* Background Glow */}
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] opacity-10 transition-opacity group-hover:opacity-30 ${
                 item.color === 'amber' ? 'bg-amber-500' :
                 item.color === 'blue' ? 'bg-blue-500' :
                 item.color === 'sky' ? 'bg-sky-500' :
                 'bg-emerald-500'
              }`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Preview */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left">
               <h3 className="text-3xl font-black mb-4 tracking-tight">Showcase Your Skills</h3>
               <p className="text-blue-100 text-base max-w-sm mb-8">
                 Collect all 12 special badges to unlock the "Master Scholar" certificate and show your dedication.
               </p>
               <button className="px-8 py-3.5 bg-white text-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-950/20">
                  Enter Hall of Fame
               </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
               {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="w-16 h-16 rounded-[1.2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform hover:rotate-12 transition-transform cursor-pointer">
                     <Star className={`w-8 h-8 ${i <= 3 ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                  </div>
               ))}
            </div>
         </div>
         
         <Sparkles className="absolute top-10 right-10 w-20 h-20 text-white/5 group-hover:scale-150 transition-transform duration-1000" />
      </div>
    </div>
  );
}
