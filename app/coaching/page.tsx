"use client";

import React from "react";
import { 
  BookOpen, Zap, Target, Award, CheckCircle, 
  Sparkles, Users, Microscope, Calculator, ArrowRight
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const coachingPrograms = [
  {
    title: "Foundation Excellence",
    target: "Classes 6th - 10th",
    description: "Strength your fundamentals in Mathematics and Science to stay ahead of the curve from an early age.",
    benefits: ["Conceptual Clarity", "Logical Reasoning", "Olympiad Prep", "Regular Assessments"],
    icon: Sparkles,
    color: "blue"
  },
  {
    title: "Board Champions",
    target: "Classes 11th & 12th",
    description: "Specialized coaching for CBSE/ICSE board exams with a focus on scoring 95%+ marks.",
    benefits: ["Detailed Notes", "Mock Exams", "Answer Writing Tips", "Doubt Clearing Sessions"],
    icon: Award,
    color: "sky"
  },
  {
    title: "Competitive Edge",
    target: "CUET / NEET / JEE",
    description: "Intensive training for national level entrance exams with a result-oriented approach.",
    benefits: ["Expert Faculty", "National Test Series", "Personal Mentorship", "Time Management Skills"],
    icon: Target,
    color: "indigo"
  }
];

export default function CoachingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white relative">
      {/* Universal Grid Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 pointer-events-none"></div>
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-24">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold mb-6 shadow-sm">
            <Zap className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest">Premium Coaching Programs</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
             Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Academic Potential</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            Personalized coaching designed to turn your weaknesses into strengths and your goals into achievements.
          </p>
        </div>

        {/* Coaching Programs Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mb-32">
          {coachingPrograms.map((program, idx) => (
             <div key={idx} className={`flex flex-col lg:flex-row gap-12 group p-8 md:p-12 rounded-[3rem] bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={`lg:w-1/2 flex items-center justify-center rounded-[2.5rem] bg-gradient-to-br min-h-[300px] overflow-hidden relative
                  ${program.color === 'blue' ? 'from-blue-600 to-blue-800' : ''}
                  ${program.color === 'sky' ? 'from-sky-500 to-blue-600' : ''}
                  ${program.color === 'indigo' ? 'from-indigo-600 to-violet-800' : ''}
                `}>
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:scale-125 transition-transform"></div>
                   <program.icon className="w-32 h-32 text-white/50 group-hover:scale-110 group-hover:text-white/80 transition-all duration-500" />
                   <div className="absolute bottom-6 left-6 text-white font-black text-xl tracking-widest uppercase opacity-40">AMOGH ACADEMY</div>
                </div>
                
                <div className="lg:w-1/2 flex flex-col justify-center space-y-8">
                   <div className="space-y-4">
                      <div className="text-blue-600 font-black text-sm tracking-widest uppercase">{program.target}</div>
                      <h3 className="text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{program.title}</h3>
                      <p className="text-lg text-slate-600 font-medium leading-relaxed">
                         {program.description}
                      </p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      {program.benefits.map((benefit, bidx) => (
                         <div key={bidx} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                            <span className="font-bold text-slate-700">{benefit}</span>
                         </div>
                      ))}
                   </div>
                   
                   <div>
                      <a href="/join-us" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 text-white font-black hover:bg-blue-600 transition-all hover:translate-x-2">
                         Apply for this Program <ArrowRight className="w-5 h-5" />
                      </a>
                   </div>
                </div>
             </div>
          ))}
        </div>

        {/* Competitive Highlight Section */}
        <section className="bg-slate-900 py-24 relative overflow-hidden">
           <div className="absolute inset-x-0 bottom-0 top-1/2 bg-blue-600 opacity-10 blur-[150px] -z-10"></div>
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Competitive Exam Path</h2>
                 <p className="text-slate-400 text-lg max-w-2xl mx-auto">We don't just teach for marks; we prepare you for the toughest exams in the country.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm group hover:border-blue-500/50 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-8 font-black text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">JEE</div>
                    <h4 className="text-xl font-bold text-white mb-4">Engineering Stream</h4>
                    <p className="text-slate-400">Integrated preparation for IIT-JEE Main & Advanced with intensive Physics & Maths modules.</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm group hover:border-sky-500/50 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 mb-8 font-black text-2xl group-hover:bg-sky-600 group-hover:text-white transition-all">NEET</div>
                    <h4 className="text-xl font-bold text-white mb-4">Medical Stream</h4>
                    <p className="text-slate-400">Focused Biology & Chemistry coaching to help you crack national level medical entrances.</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm group hover:border-indigo-500/50 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-8 font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">CUET</div>
                    <h4 className="text-xl font-bold text-white mb-4">Central University</h4>
                    <p className="text-slate-400">Comprehensive coaching for CUET to secure admission in top central universities of India.</p>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
