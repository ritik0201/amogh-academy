"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap, Search, Loader2, Mail, Phone, CheckCircle,
  XCircle, Calendar, Users, UserCheck, UserX, RefreshCw,
} from "lucide-react";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  grade?: string;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/students");
      const data = await res.json();
      if (res.ok) setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "verified" && s.isVerified) ||
      (filter === "unverified" && !s.isVerified);
    return matchSearch && matchFilter;
  });

  const verified = students.filter((s) => s.isVerified).length;
  const unverified = students.length - verified;

  return (
    <div className="space-y-8 text-white">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] uppercase tracking-widest mb-3">
            <GraduationCap className="w-3 h-3" /> Student Registry
          </div>
          <h1 className="text-4xl font-black tracking-tight">All Students</h1>
          <p className="text-slate-500 mt-1 font-medium">Everyone who has signed up as a student.</p>
        </div>
        <button
          onClick={fetchStudents}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Students", value: students.length, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          { label: "Verified", value: verified, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Unverified", value: unverified, icon: UserX, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
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
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-white text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "verified", "unverified"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
                filter === f
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-slate-900 text-slate-500 border border-slate-800 hover:text-white hover:bg-slate-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-500 font-bold text-lg">No students found</p>
            <p className="text-slate-600 text-sm">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/60 text-left border-b border-slate-800">
                  <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-wider text-xs">#</th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-wider text-xs">Student</th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-wider text-xs">Email</th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-wider text-xs">Phone</th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-wider text-xs">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((student, i) => (
                  <tr key={student._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-slate-600 font-bold">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20 shrink-0">
                          {student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">{student.name}</p>
                          {student.grade && (
                            <p className="text-xs text-slate-500 font-medium">Grade {student.grade}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${student.email}`}
                        className="text-blue-400 font-bold hover:underline flex items-center gap-1.5"
                      >
                        <Mail className="w-3 h-3 shrink-0" />
                        {student.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">
                      {student.phone ? (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-500" /> {student.phone}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black">
                          <XCircle className="w-3 h-3" /> Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-600" />
                        {formatDate(student.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-center text-slate-600 text-xs font-medium pb-4">
        Showing {filtered.length} of {students.length} students
      </p>
    </div>
  );
}
