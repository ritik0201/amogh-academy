"use client";

import React, { useState } from "react";
import { 
  GraduationCap, BookOpen, CheckCircle, 
  FlaskConical, Calculator, Globe, Atom,
  Microscope, Languages, Laptop, ChevronRight
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const classData = [
  {
    id: "foundation",
    title: "Foundation Batch",
    classes: "6th – 8th",
    description: "Building a strong academic base through conceptual clarity and curiosity-driven learning.",
    subjects: ["Mathematics", "General Science", "Social Science", "English Grammar & Lit", "Hindi", "Computer Basics"],
    highlights: [
      "Focus on Mental Ability & Logic",
      "Regular Homework Assistance",
      "Interactive Science Experiments",
      "Weekly Vocabulary Builders"
    ],
    color: "blue"
  },
  {
    id: "pre-board",
    title: "Pre-Board Mastery",
    classes: "9th – 10th",
    description: "Intensive preparation for secondary board exams (CBSE/ICSE) with expert faculty guidance.",
    subjects: ["Advanced Mathematics", "Physics", "Chemistry", "Biology", "History & Civics", "Geography", "English Language"],
    highlights: [
      "Previous Year Paper Analysis",
      "Mock Tests every 15 days",
      "Dedicated Board Answer Writing Skills",
      "Bridge Courses for Higher Secondary"
    ],
    color: "sky"
  },
  {
    id: "senior-sec",
    title: "Senior Secondary",
    classes: "11th – 12th",
    description: "Specialized streams for higher education with integrated coaching for competitive exams.",
    subjects: ["Physics (PCM/PCB)", "Chemistry (PCM/PCB)", "Mathematics (PCM)", "Biology (PCB)", "English Core", "Opt: Computer Science / PE"],
    highlights: [
      "Stream-wise Specialization",
      "National Level Test Series",
      "Personal Mentorship for CUET/NEET/JEE",
      "Career Guidance Workshops"
    ],
    color: "indigo"
  }
];

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState(classData[0].id);

  const activeClass = classData.find(c => c.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white relative">
      {/* Universal Grid Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 pointer-events-none"></div>
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold mb-6 shadow-sm">
            <GraduationCap className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest">Academic Curriculum</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
             Classes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Offered</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            From foundational basics to advanced competitive preparations, we provide a comprehensive roadmap for every student's academic journey.
          </p>
        </div>

        {/* Interactive Class Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {classData.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={`px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 border-2 
                  ${activeTab === c.id 
                    ? `bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/30 scale-105` 
                    : `bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600`
                  }`}
              >
                {c.classes}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Class Details Card */}
            <div className="lg:col-span-12 group relative bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 border border-slate-200 shadow-2xl overflow-hidden min-h-[600px] flex flex-col lg:flex-row gap-16">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:scale-110"></div>
               
               <div className="lg:w-1/2 relative z-10 flex flex-col justify-center">
                 <div className="text-blue-600 font-black text-2xl mb-4 tracking-widest uppercase">{activeClass?.title}</div>
                 <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">Class {activeClass?.classes}</h2>
                 <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 border-l-4 border-blue-500 pl-6">
                   {activeClass?.description}
                 </p>
                 
                 <div className="space-y-6">
                   <h4 className="text-xl font-black text-slate-800 uppercase tracking-widest">Key Highlights</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {activeClass?.highlights.map((h, i) => (
                       <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 group/item hover:bg-white hover:border-blue-200 transition-all">
                          <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                          <span className="font-bold text-slate-700">{h}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                    <a href="/join-us" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-slate-900 text-white font-black text-xl hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3">
                       Enroll Now <ChevronRight className="w-6 h-6" />
                    </a>
                    <span className="text-slate-500 font-bold">Limited seats per batch!</span>
                 </div>
               </div>

               <div className="lg:w-1/2 relative z-10">
                 <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl h-full border border-slate-800 relative overflow-hidden group/subjects">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
                    <div className="relative z-10">
                      <h4 className="text-2xl font-black text-white mb-8 border-b border-white/10 pb-6 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-blue-400" /> Subjects Covered
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        {activeClass?.subjects.map((s, i) => (
                          <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all transform hover:translate-x-2">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                   {s.toLowerCase().includes('math') ? <Calculator className="w-5 h-5" /> : 
                                    s.toLowerCase().includes('sci') || s.toLowerCase().includes('phys') || s.toLowerCase().includes('chem') ? <FlaskConical className="w-5 h-5" /> :
                                    s.toLowerCase().includes('soc') || s.toLowerCase().includes('hist') ? <Globe className="w-5 h-5" /> :
                                    s.toLowerCase().includes('bio') ? <Microscope className="w-5 h-5" /> :
                                    s.toLowerCase().includes('comp') ? <Laptop className="w-5 h-5" /> :
                                    <Languages className="w-5 h-5" />}
                                </div>
                                <span className="text-lg font-bold text-white">{s}</span>
                             </div>
                             <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Special Streams Section for 11th-12th */}
        <section className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Stream Specializations (11th-12th)</h2>
              <p className="text-slate-500 font-medium">Focused programs for medical, engineering, and arts aspirants.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:border-blue-400 transition-all">
                 <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-8 font-black text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">PCM</div>
                 <h3 className="text-3xl font-black text-slate-900 mb-4">Engineering Focus</h3>
                 <p className="text-slate-600 font-medium mb-6 leading-relaxed">Integrated coaching for JEE Mains & Advanced along with board syllabus mastery in Physics, Chemistry, and Mathematics.</p>
                 <div className="flex flex-wrap gap-2">
                    {["JEE Integrated", "Advance Labs", "Weekly Tests"].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">{tag}</span>
                    ))}
                 </div>
              </div>

              <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:border-sky-400 transition-all">
                 <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 mb-8 font-black text-2xl group-hover:bg-sky-600 group-hover:text-white transition-all">PCB</div>
                 <h3 className="text-3xl font-black text-slate-900 mb-4">Medical Focus</h3>
                 <p className="text-slate-600 font-medium mb-6 leading-relaxed">Dedicated NEET preparation featuring extensive Biology diagrams, Physics application classes, and Organic Chemistry marathons.</p>
                 <div className="flex flex-wrap gap-2">
                    {["NEET Focused", "Bio Workshops", "Regular Mock Tests"].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">{tag}</span>
                    ))}
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
