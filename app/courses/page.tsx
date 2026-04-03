"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { 
  BookOpen, Users, Star, Share2, GraduationCap, 
  ChevronRight, Search, Filter, ArrowRight,
  Play, Clock, LayoutGrid
} from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Foundation", "Competitive", "Computer"];

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
        }
      })
      .catch((err) => console.error("Error fetching courses:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleShare = async (e: React.MouseEvent, courseId: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/courses/${courseId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${title} at Amogh Academy`,
          text: `I highly recommend ${title}! Check it out here:`,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Course link copied to clipboard!");
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory || 
      (selectedCategory === "Foundation" && course.title.includes("Class")) ||
      (selectedCategory === "Computer" && (course.title.includes("DCA") || course.title.includes("CCC")));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white relative">
      
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:64px_64px] opacity-10 pointer-events-none"></div>

      <Navbar />

      <main className="pt-40 lg:pt-48 relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pb-32">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-600 text-white font-black shadow-xl shadow-blue-500/20">
               <GraduationCap className="w-4 h-4" />
               <span className="text-[10px] uppercase tracking-[0.2em]">Premium Course Catalog</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              Level up <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400">your future.</span>
            </h1>
            <p className="text-xl text-slate-500 font-bold max-w-xl leading-relaxed">
              Varanasi's highest-rated courses. Learn from board toppers and industry experts with real-world curriculum.
            </p>
          </div>

          <div className="w-full lg:w-96 bg-white p-2 rounded-[2.5rem] shadow-2xl border border-slate-100 flex items-center group focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
             <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Search className="w-6 h-6" />
             </div>
             <input 
               type="text" 
               placeholder="Search masters..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="flex-grow bg-transparent border-none outline-none font-bold text-slate-900 placeholder:text-slate-400 px-2"
             />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-12 animate-in fade-in slide-in-from-left-5 duration-1000 delay-200">
           {categories.map((cat) => (
             <button 
               key={cat}
               onClick={() => setSelectedCategory(cat)}
               className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border shadow-sm ${
                 selectedCategory === cat 
                 ? "bg-slate-900 text-white border-slate-900 shadow-xl" 
                 : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600"
               }`}
             >
               {cat}
             </button>
           ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white/60 rounded-[3rem] h-[550px] border border-slate-200"></div>
             ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-32 bg-white/40 backdrop-blur-md rounded-[4rem] border border-slate-200 shadow-inner">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
               <BookOpen className="w-12 h-12 text-slate-200" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">No courses found matching your criteria.</h3>
            <p className="text-slate-500 font-bold mt-2">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course, idx) => (
              <div 
                key={course._id} 
                className="group relative bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col h-[580px]"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Image Section */}
                <Link href={`/courses/${course._id}`} className="block relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-200 -z-10" />
                  <img 
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Floating Badges */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                    <div className="px-4 py-1.5 bg-blue-600/90 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest animate-pulse">
                       New Enrollment
                    </div>
                    <button 
                      onClick={(e) => handleShare(e, course._id, course.title)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center border border-white/20 group/share"
                    >
                      <Share2 className="w-5 h-5 group-hover/share:scale-110 transition-transform" />
                    </button>
                  </div>

                  <div className="absolute bottom-6 left-8 flex items-center gap-3 text-white">
                     <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black">
                        {course.teacher?.name?.charAt(0) || "T"}
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Instructed by</p>
                        <p className="text-sm font-black tracking-tight">{course.teacher?.name || "Expert Faculty"}</p>
                     </div>
                  </div>
                </Link>

                {/* Content Section */}
                <div className="p-10 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 italic transition-all group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100">
                        <Users className="w-3 h-3" /> {(course.enrolledStudents?.length || 0) + 120} Learning
                     </span>
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.9
                     </span>
                  </div>
                  
                  <Link href={`/courses/${course._id}`} className="block group/title mb-4">
                    <h3 className="text-3xl font-black text-slate-900 leading-[1.1] tracking-tighter group-hover/title:text-blue-600 transition-colors line-clamp-2">
                       {course.title}
                    </h3>
                  </Link>
                  
                  <p className="text-base text-slate-500 font-bold mb-8 line-clamp-2 flex-1 leading-relaxed">
                    {course.description || "Master new skills with this comprehensive course guided by our expert faculty. Full digital access included."}
                  </p>

                  {/* Pricing and Action */}
                  <div className="flex items-center justify-between pt-10 border-t border-slate-100 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Lifetime Access</span>
                      <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{course.price}</span>
                    </div>
                    
                    <Link 
                      href={`/courses/${course._id}`}
                      className="group/btn w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-500/20 transition-all hover:scale-110 active:scale-95"
                    >
                      <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
