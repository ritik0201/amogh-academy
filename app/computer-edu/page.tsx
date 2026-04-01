"use client";

import React from "react";
import { 
  Monitor, CheckCircle, Award, Briefcase, 
  Laptop, Cpu, Database, Layout, PenTool,
  ShieldCheck, FileCheck, Globe, GraduationCap
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const courses = [
  {
    title: "MDCA",
    duration: "12 Months Course",
    subtitle: "Master Diploma in Computer Applications",
    description: "The most comprehensive course for students looking for a professional career in IT and office management.",
    features: [
      "Basic Concept of Computer, Win 7, 10 & 11",
      "MS Office 07, 10 & 13 (Word, Excel, PPT)",
      "Tally with GST, Accounts with Inventory",
      "Desk Top Publication (DTP)",
      "Photoshop CS, Corel Draw X7",
      "Typing (Hindi & English)",
      "Internet & E-mail Operations",
      "Soft Skills & Personality Development"
    ],
    color: "blue",
    icon: Laptop
  },
  {
    title: "DCA",
    duration: "6 Months Course",
    subtitle: "Diploma in Computer Applications",
    description: "Ideal for students and professionals looking to gain strong foundational knowledge of office automation.",
    features: [
      "Basic Concept of Computer, Win 7, 10 & 11",
      "MS Office Professional (Word, Excel, PPT)",
      "Tally with GST Basics",
      "Typing (Hindi & English)",
      "Internet & Cyber Security Awareness",
      "Job Placement Training"
    ],
    color: "sky",
    icon: Layout
  },
  {
    title: "CCC",
    duration: "3 Months Course",
    subtitle: "Course on Computer Concepts",
    description: "Quick-paced course focusing on the essential computer concepts required for government and private jobs.",
    features: [
      "Basic Concept of Computer & Windows",
      "Libre Office (Writer, Calc, Impress)",
      "Typing & Printing Skills",
      "Internet & E-mail Fundamentals",
      "Digital Financial Services",
      "Mock CCC Exams preparation"
    ],
    color: "indigo",
    icon: Cpu
  }
];

export default function ComputerEduPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white relative">
      {/* Universal Grid Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 pointer-events-none"></div>
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-24">
        {/* Hero Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-8">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold shadow-sm">
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">Authorized Training Center</span>
                 </div>
                 <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight tracking-tight">
                    Professional <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Computer Academy</span>
                 </h1>
                 <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
                    Approved by the <span className="font-bold text-slate-900">Ministry of Corporate Affairs</span>. We offer job-oriented computer courses with actual placement assistance in Varanasi.
                 </p>
                 <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 p-8 rounded-[2rem] shadow-sm">
                   <p className="text-lg font-bold text-slate-700 mb-2">निःशुल्क या कम से कम फीस में कम्प्यूटर कोर्स करने का सुनहरा अवसर</p>
                   <p className="text-blue-600 font-black text-2xl drop-shadow-sm">बस एक परीक्षा दीजिए और अपना करियर बनाइए!</p>
                 </div>
              </div>
              <div className="relative group lg:justify-self-end">
                 <div className="w-80 h-80 md:w-[480px] md:h-[480px] bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center text-white p-12 overflow-hidden relative">
                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-white/10 backdrop-blur-xl -z-10 group-hover:-translate-y-10 transition-transform"></div>
                    <Cpu className="w-32 h-32 mb-8 animate-pulse text-blue-300" />
                    <h3 className="text-4xl font-black text-center mb-4">Job-Linked Training</h3>
                    <p className="text-center font-bold text-blue-100 text-lg">We don't just teach software, we build professional careers.</p>
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-xs font-black tracking-widest uppercase border border-white/30">Skills Center</div>
                 </div>
                 <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                       <Award className="w-10 h-10 text-yellow-500" />
                       <div>
                          <div className="font-black text-slate-900">MCA Approved</div>
                          <div className="text-xs font-bold text-slate-500">Govt. Certified Training</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Detailed Course Breakdown */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {courses.map((course, idx) => (
            <div 
              key={course.title}
              className={`flex flex-col lg:flex-row gap-12 group ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-bottom-10">
                 <div className="space-y-4">
                    <h2 className={`text-6xl font-black transition-colors duration-500
                       ${course.color === 'blue' ? 'text-blue-600' : ''}
                       ${course.color === 'sky' ? 'text-sky-500' : ''}
                       ${course.color === 'indigo' ? 'text-indigo-600' : ''}
                    `}>
                       {course.title}
                    </h2>
                    <h4 className="text-2xl font-black text-slate-800">{course.subtitle}</h4>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                       {course.duration}
                    </div>
                 </div>
                 <p className="text-xl text-slate-600 font-medium leading-relaxed italic border-l-4 border-blue-500 pl-6">
                    {course.description}
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group-hover:shadow-md transition-all">
                      <FileCheck className="w-6 h-6 text-blue-500 mb-3" />
                      <h5 className="font-black text-slate-900 mb-1">Practical Learning</h5>
                      <p className="text-sm text-slate-500">Real-world projects and lab sessions.</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group-hover:shadow-md transition-all">
                      <Briefcase className="w-6 h-6 text-blue-500 mb-3" />
                      <h5 className="font-black text-slate-900 mb-1">Placement Support</h5>
                      <p className="text-sm text-slate-500">Resume building and interview prep.</p>
                   </div>
                 </div>
              </div>

              <div className="lg:w-1/2">
                 <div className={`rounded-[3rem] p-12 h-full shadow-2xl relative overflow-hidden transition-all duration-500
                    ${course.color === 'blue' ? 'bg-blue-600' : ''}
                    ${course.color === 'sky' ? 'bg-sky-500' : ''}
                    ${course.color === 'indigo' ? 'bg-indigo-600' : ''}
                 `}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:scale-125 transition-transform"></div>
                    <div className="relative z-10 text-white">
                       <h4 className="text-3xl font-black mb-8 border-b border-white/20 pb-6 flex items-center gap-4">
                          <course.icon className="w-10 h-10" /> Course Syllabus
                       </h4>
                       <div className="space-y-4">
                          {course.features.map((feature, fidx) => (
                             <div key={fidx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all cursor-default">
                                <CheckCircle className="w-6 h-6 text-white shrink-0" />
                                <span className="font-bold tracking-wide">{feature}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lab Info */}
        <section className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
              <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
              </div>
              
              <div className="lg:w-1/2 space-y-8 relative z-10">
                 <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">State-of-the-art <br /><span className="text-blue-400">Computer Labs</span></h2>
                 <p className="text-slate-400 text-lg font-medium leading-relaxed">
                    Our air-conditioned laboratories are equipped with high-speed internet and the latest hardware, providing a perfect environment for hands-on learning.
                 </p>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <div className="text-4xl font-black text-white">20+</div>
                       <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Workstations</div>
                    </div>
                    <div className="space-y-2">
                       <div className="text-4xl font-black text-white">High</div>
                       <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Speed Internet</div>
                    </div>
                    <div className="space-y-2">
                       <div className="text-4xl font-black text-white">1:1</div>
                       <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">PC-Student Ratio</div>
                    </div>
                    <div className="space-y-2">
                       <div className="text-4xl font-black text-white">24/7</div>
                       <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Power Backup</div>
                    </div>
                 </div>
              </div>

              <div className="lg:w-1/2 relative z-10 grid grid-cols-2 gap-4">
                 <div className="aspect-square bg-blue-600/30 rounded-3xl border border-white/10 flex items-center justify-center">
                    <PenTool className="w-16 h-16 text-blue-300" />
                 </div>
                 <div className="aspect-square bg-sky-600/30 rounded-3xl border border-white/10 mt-8 flex items-center justify-center">
                    <Database className="w-16 h-16 text-sky-300" />
                 </div>
                 <div className="aspect-square bg-indigo-600/30 rounded-3xl border border-white/10 -mt-8 flex items-center justify-center">
                    <Globe className="w-16 h-16 text-indigo-300" />
                 </div>
                 <div className="aspect-square bg-blue-400/30 rounded-3xl border border-white/10 flex items-center justify-center">
                    <ShieldCheck className="w-16 h-16 text-blue-100" />
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
