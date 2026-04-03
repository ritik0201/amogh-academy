"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, BookOpen, Users, Video, Star, Calendar,
  Mail, Phone, GraduationCap, Play, Loader2, User,
  IndianRupee, TrendingUp, Clock, CheckCircle, AlertCircle,
  Briefcase, ChevronRight, PlayCircle, X
} from "lucide-react";

interface Lecture {
  _id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  isLive: boolean;
  createdAt: string;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  experience?: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price: number;
  teacher: Teacher;
  enrolledStudents: Student[];
  lectures: Lecture[];
  createdAt: string;
}

export default function AdminCourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"students" | "lectures">("students");
  const [activeVideo, setActiveVideo] = useState<Lecture | null>(null);

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else {
      videoId = url.split("/").pop() || "";
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/admin/courses/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch course");
      setCourse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalRevenue = course
    ? (course.enrolledStudents?.length || 0) * (course.price || 0)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <p className="text-slate-400 font-bold text-lg">{error || "Course not found"}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Courses
      </button>

      {/* ─── Hero Banner ─── */}
      <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url(${course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        <div className="relative z-10 p-10 lg:p-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs uppercase tracking-widest mb-4">
            <BookOpen className="w-3 h-3" /> Course Detail
          </div>
          <h1 className="text-3xl lg:text-5xl font-black tracking-tight mb-3 max-w-2xl leading-tight">
            {course.title}
          </h1>
          {course.description && (
            <p className="text-slate-400 text-base lg:text-lg max-w-xl leading-relaxed mb-6">
              {course.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-bold">
              <Calendar className="w-4 h-4 text-slate-400" />
              Created {formatDate(course.createdAt)}
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm font-bold text-emerald-400">
              <IndianRupee className="w-4 h-4" />
              ₹{course.price} / student
            </span>
          </div>
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: course.enrolledStudents?.length || 0,
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10 border-blue-500/20",
          },
          {
            label: "Total Lectures",
            value: course.lectures?.length || 0,
            icon: Video,
            color: "text-purple-400",
            bg: "bg-purple-500/10 border-purple-500/20",
          },
          {
            label: "Revenue Earned",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/20",
          },
          {
            label: "Course Price",
            value: `₹${course.price}`,
            icon: IndianRupee,
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-slate-900 border ${stat.bg} rounded-[1.5rem] p-6 flex flex-col gap-4`}
          >
            <div className={`p-3 rounded-xl border w-fit ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Teacher Card ─── */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Briefcase className="w-5 h-5 text-orange-400" />
          </div>
          <h2 className="text-xl font-black tracking-tight">Course Teacher</h2>
        </div>

        {course.teacher ? (
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-orange-500/20 shrink-0">
              {course.teacher.name?.charAt(0).toUpperCase()}
            </div>
            {/* Info */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Name</p>
                <p className="text-white font-bold">{course.teacher.name}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Email</p>
                <a
                  href={`mailto:${course.teacher.email}`}
                  className="text-blue-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" /> {course.teacher.email}
                </a>
              </div>
              {course.teacher.phone && (
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Phone</p>
                  <p className="text-white font-bold flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" /> {course.teacher.phone}
                  </p>
                </div>
              )}
              {course.teacher.subject && (
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Subject</p>
                  <p className="text-white font-bold">{course.teacher.subject}</p>
                </div>
              )}
              {course.teacher.experience && (
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Experience</p>
                  <p className="text-white font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> {course.teacher.experience}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-slate-500 font-medium">No teacher assigned to this course.</p>
        )}
      </div>

      {/* ─── Tabs: Students & Lectures ─── */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 px-8 py-5 font-black text-sm uppercase tracking-wider transition-all ${
              activeTab === "students"
                ? "text-white border-b-2 border-red-500 bg-slate-800/40"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Students ({course.enrolledStudents?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("lectures")}
            className={`flex items-center gap-2 px-8 py-5 font-black text-sm uppercase tracking-wider transition-all ${
              activeTab === "lectures"
                ? "text-white border-b-2 border-red-500 bg-slate-800/40"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Video className="w-4 h-4" />
            Lectures ({course.lectures?.length || 0})
          </button>
        </div>

        {/* ── Students Tab ── */}
        {activeTab === "students" && (
          <div className="p-6">
            {course.enrolledStudents?.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800/60 text-left">
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-wider text-xs">#</th>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-wider text-xs">Student</th>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-wider text-xs">Email</th>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-wider text-xs">Phone</th>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-wider text-xs">Enrolled On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {course.enrolledStudents.map((student, index) => (
                      <tr
                        key={student._id}
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4 text-slate-500 font-bold">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-sm">
                              {student.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-white">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`mailto:${student.email}`}
                            className="text-blue-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" /> {student.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-medium">
                          {student.phone ? (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-500" /> {student.phone}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-medium">
                          {formatDate(student.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-10 h-10 text-slate-600" />
                </div>
                <p className="text-slate-500 font-bold text-lg">No students enrolled yet</p>
                <p className="text-slate-600 text-sm mt-1">Students will appear here once they purchase this course.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Lectures Tab ── */}
        {activeTab === "lectures" && (
          <div className="p-6 space-y-3">
            {course.lectures?.length > 0 ? (
              course.lectures.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="flex items-center gap-4 p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-slate-600 hover:bg-slate-800/60 transition-all group"
                >
                  {/* Number */}
                  <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-black text-slate-300 text-sm shrink-0 group-hover:bg-red-600/20 group-hover:text-red-400 transition-all">
                    {index + 1}
                  </div>

                  {/* Thumbnail/Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-700/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    {lecture.isLive ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    ) : (
                      <Play className="w-5 h-5 text-red-400" fill="currentColor" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-white truncate">{lecture.title}</h4>
                      {lecture.isLive && (
                        <span className="text-[10px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Live
                        </span>
                      )}
                    </div>
                    {lecture.description && (
                      <p className="text-slate-500 text-sm font-medium mt-0.5 truncate">{lecture.description}</p>
                    )}
                    <p className="text-xs text-slate-600 font-bold mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Added {formatDate(lecture.createdAt)}
                    </p>
                  </div>

                  {/* Video Link */}
                  {lecture.youtubeUrl && (
                    <button
                      onClick={() => setActiveVideo(lecture)}
                      className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-black hover:bg-red-600/20 transition-all cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" /> Watch
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-10 h-10 text-slate-600" />
                </div>
                <p className="text-slate-500 font-bold text-lg">No lectures added yet</p>
                <p className="text-slate-600 text-sm mt-1">Lectures will appear here once the teacher adds them.</p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* ─── Video Player Modal ─── */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
            onClick={() => setActiveVideo(null)}
          />
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute top-0 left-0 w-full h-full">
              <iframe
                src={getYoutubeEmbedUrl(activeVideo.youtubeUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
