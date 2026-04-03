"use client";

import { useState, useEffect } from "react";
import {
  Users, Search, Loader2, Mail, Phone, CheckCircle,
  XCircle, Calendar, UserCheck, UserX, RefreshCw, Briefcase, BookOpen,
} from "lucide-react";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  experience?: string;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/teachers");
      const data = await res.json();
      if (res.ok) setTeachers(data);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const filtered = teachers.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      (t.subject || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "verified" && t.isVerified) ||
      (filter === "unverified" && !t.isVerified);
    return matchSearch && matchFilter;
  });

  const verified = teachers.filter((t) => t.isVerified).length;
  const unverified = teachers.length - verified;

  return (
    <div className="space-y-8 text-white">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-black text-[10px] uppercase tracking-widest mb-3">
            <Users className="w-3 h-3" /> Educator Registry
          </div>
          <h1 className="text-4xl font-black tracking-tight">All Teachers</h1>
          <p className="text-slate-500 mt-1 font-medium">All educators registered on the platform.</p>
        </div>
        <button
          onClick={fetchTeachers}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Teachers", value: teachers.length, icon: Users, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
          { label: "Verified", value: verified, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Pending Verification", value: unverified, icon: UserX, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
        ].map((s) => (
          <div key={s.label} className={`bg-slate-900 border ${s.bg} rounded-[1.5rem] p-6 flex items-center gap-5`}>
            <div className={`p-3 rounded-2xl border ${s.bg}`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{s.value}</p>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-white text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "verified", "unverified"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
                filter === f
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                  : "bg-slate-900 text-slate-500 border border-slate-800 hover:text-white hover:bg-slate-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Cards Grid ── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
            <Users className="w-10 h-10 text-slate-600" />
          </div>
          <p className="text-slate-500 font-bold text-lg">No teachers found</p>
          <p className="text-slate-600 text-sm">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((teacher) => (
            <div
              key={teacher._id}
              className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 flex flex-col gap-5 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all group"
            >
              {/* Avatar + Name */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20 shrink-0">
                  {teacher.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white text-lg leading-tight truncate">{teacher.name}</p>
                  {teacher.isVerified ? (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black">
                      <CheckCircle className="w-2.5 h-2.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black">
                      <XCircle className="w-2.5 h-2.5" /> Unverified
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2.5 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <a href={`mailto:${teacher.email}`} className="text-blue-400 font-bold hover:underline truncate">
                    {teacher.email}
                  </a>
                </div>
                {teacher.phone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-slate-300 font-medium">{teacher.phone}</span>
                  </div>
                )}
                {teacher.subject && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-slate-300 font-medium">{teacher.subject}</span>
                  </div>
                )}
                {teacher.experience && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-slate-300 font-medium">{teacher.experience} experience</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-sm">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-slate-500 font-medium">Joined {formatDate(teacher.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-slate-600 text-xs font-medium pb-4">
        Showing {filtered.length} of {teachers.length} teachers
      </p>
    </div>
  );
}
