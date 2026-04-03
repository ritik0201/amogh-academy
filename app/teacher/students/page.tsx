"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Search, Mail, Phone, GraduationCap, 
  Calendar, Loader2, ArrowRight, BookOpen, 
  ChevronRight, Filter, Download
} from "lucide-react";

interface StudentCourse {
  _id: string;
  title: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  courses: StudentCourse[];
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/teacher/students");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch students");
      setStudents(data);
    } catch (err: any) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-4">
             <Users className="w-3 h-3" /> Student Management
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">My Students</h1>
          <p className="text-slate-500 font-bold mt-2">Manage and connect with students enrolled in your courses.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
              <Download className="w-4 h-4" /> Export List
           </button>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="bg-white border border-slate-100 p-4 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
        <button className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2 text-slate-600 font-bold hover:bg-slate-100 transition-all">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Main List */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cataloging students...</p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Student Details</th>
                  <th className="px-8 py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Enrollments</th>
                  <th className="px-8 py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Joined On</th>
                  <th className="px-8 py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Contact</th>
                  <th className="px-8 py-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-600/20 transform group-hover:scale-110 transition-transform">
                          {student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 tracking-tight">{student.name}</p>
                          <p className="text-sm font-bold text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {student.courses.map((course) => (
                          <span key={course._id} className="px-3 py-1 bg-white border border-indigo-100 text-indigo-600 font-black text-[10px] rounded-lg tracking-tight shadow-sm">
                            {course.title}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-700 text-sm tracking-tight">{formatDate(student.createdAt)}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Registration Date</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                         <a 
                           href={`mailto:${student.email}`}
                           className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                           title="Send Email"
                         >
                           <Mail className="w-4 h-4" />
                         </a>
                         {student.phone && (
                            <a 
                              href={`tel:${student.phone}`}
                              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                              title="Call Student"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                         )}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2 text-slate-300 hover:text-indigo-600 transition-all">
                         <ChevronRight className="w-6 h-6" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">No Students Found</h3>
            <p className="text-slate-400 font-bold max-w-xs mx-auto mt-2">
              Try adjusting your search criteria or check back later once more students enroll!
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
         <p>Showing {filteredStudents.length} Students Total</p>
         <p>Last Sync: Just Now</p>
      </div>
    </div>
  );
}
