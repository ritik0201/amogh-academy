"use client";

import React from "react";
import { 
  Users, GraduationCap, Award, BookOpen, 
  MapPin, Phone, Mail, CheckCircle, Star,
  Globe, ExternalLink
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const facultyMembers = [
  {
    name: "Ayush Upadhyay",
    role: "Founder & Director",
    specialty: "Mathematics",
    experience: "10+ Years",
    qualifications: "B.Tech, M.Sc Mathematics",
    bio: "A visionary educator with over a decade of experience in transforming how students perceive mathematics. Ayush leads the academic direction of Amogh Academy with a focus on conceptual clarity and innovative problem-solving techniques.",
    color: "blue",
    initial: "A"
  },
  {
    name: "Madhumita Upadhyay",
    role: "Co-Founder",
    specialty: "Chemistry",
    experience: "6+ Years",
    qualifications: "M.Sc Chemistry, B.Ed",
    bio: "Specializing in Organic and Inorganic Chemistry, Madhumita brings a pedagogical approach that makes complex chemical reactions easy to understand. Her dedication to student success is reflected in her interactive teaching style.",
    color: "sky",
    initial: "M"
  },
  {
    name: "Rohit Pathak",
    role: "Academic & Management Head",
    specialty: "Physics",
    experience: "5+ Years",
    qualifications: "M.Sc Physics, B.Ed",
    bio: "Physics isn't just about formulas; it's about understanding the world. Rohit manages the overall academic standards while ensuring Physics remains an engaging subject for all competitive aspirants.",
    color: "indigo",
    initial: "R"
  },
  {
    name: "Sanitri Dubey",
    role: "Senior Faculty",
    specialty: "Biology",
    experience: "4+ Years",
    qualifications: "M.Sc Biology",
    bio: "Expert in Life Sciences, Sanitri focuses on visual learning and diagrammatic representation to help students excel in board and competitive medical exams like NEET.",
    color: "green",
    initial: "S"
  },
  {
    name: "Kiran Kannojiya",
    role: "Senior Faculty",
    specialty: "Education & Science",
    experience: "5+ Years",
    qualifications: "B.Sc BZC, M.A. Education, B.Ed, M.Ed",
    bio: "With a strong background in educational psychology and pedagogy, Kiran ensures that our teaching methods are always student-centric and effective across all age groups.",
    color: "purple",
    initial: "K"
  }
];

export default function FacultyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white relative">
      {/* Universal Grid Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 pointer-events-none"></div>
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-24">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold mb-6 shadow-sm">
            <Users className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest">Our Expert Mentors</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
            Meet the Minds Behind <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Your Success</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            At Amogh Academy, we believe that great education starts with great teachers. Our faculty members are not just subject experts, but mentors who inspire and guide students at every step.
          </p>
        </div>

        {/* Dynamic Faculty Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
            {facultyMembers.map((member, index) => (
              <div 
                key={member.name}
                className={`group relative bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col lg:flex-row ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Left/Image Side */}
                <div className={`lg:w-1/3 p-2`}>
                  <div className={`h-full min-h-[300px] rounded-[2rem] bg-gradient-to-br transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden
                    ${member.color === 'blue' ? 'from-blue-600 to-blue-800' : ''}
                    ${member.color === 'sky' ? 'from-sky-500 to-blue-600' : ''}
                    ${member.color === 'indigo' ? 'from-indigo-500 to-violet-700' : ''}
                    ${member.color === 'green' ? 'from-green-500 to-teal-600' : ''}
                    ${member.color === 'purple' ? 'from-purple-500 to-indigo-600' : ''}
                  `}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:scale-125 transition-transform"></div>
                    <div className="text-8xl font-black text-white/20 group-hover:text-white/30 transition-colors animate-pulse mb-4">{member.initial}</div>
                    <div className="relative z-10 text-center px-6">
                       <div className="text-white font-black text-3xl mb-2">{member.name}</div>
                       <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold tracking-wider uppercase border border-white/30">{member.role}</div>
                    </div>
                  </div>
                </div>

                {/* Right/Content Side */}
                <div className="lg:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-3 mb-6">
                       <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm">
                        <BookOpen className="w-4 h-4 text-blue-500" /> {member.specialty}
                       </span>
                       <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm">
                        <Award className="w-4 h-4 text-blue-500" /> {member.experience}
                       </span>
                       <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm">
                        <GraduationCap className="w-4 h-4 text-blue-500" /> {member.qualifications}
                       </span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-6 drop-shadow-sm group-hover:text-blue-600 transition-colors">Teaching Philosophy</h3>
                    <p className="text-slate-600 text-lg font-medium leading-relaxed italic border-l-4 border-blue-500 pl-6 mb-8">
                      "{member.bio}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-px flex-grow bg-slate-200"></div>
                    <div className="flex gap-4">
                      <button className="p-3 rounded-full bg-slate-100 text-slate-400 hover:bg-blue-500 hover:text-white transition-all"><Globe className="w-5 h-5" /></button>
                      <button className="p-3 rounded-full bg-slate-100 text-slate-400 hover:bg-sky-400 hover:text-white transition-all"><ExternalLink className="w-5 h-5" /></button>
                      <button className="p-3 rounded-full bg-slate-100 text-slate-400 hover:bg-pink-500 hover:text-white transition-all"><Mail className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values/Stats Section */}
        <section className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-12 relative z-10">Why our faculty is different?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/30">
                  <Star className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Quality Driven</h4>
                <p className="text-slate-400">Not just teaching, but ensuring every student grasps the fundamental concept.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 mb-6 border border-sky-500/30">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Certified Experts</h4>
                <p className="text-slate-400">All mentors hold advanced degrees (M.Sc, B.Ed, M.Ed) with proven track records.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/30">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Personal Mentorship</h4>
                <p className="text-slate-400">Beyond classes, we hold doubt-clearing sessions and career guidance meetings.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
