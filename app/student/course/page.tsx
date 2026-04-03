"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Play, BookOpen, Clock, ChevronRight, Loader2,
  Video, Monitor, Star, Award, Search, X, Maximize2
} from "lucide-react";

interface Lecture {
  _id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  isLive: boolean;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  lectures: Lecture[];
  teacher: {
    name: string;
  };
}

export default function StudentCoursePage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeLectureTitle, setActiveLectureTitle] = useState<string | null>(null);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const res = await fetch("/api/student/courses");
      const data = await res.json();
      if (res.ok) setCourses(data);
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = url.split("v=")[1];
    if (!videoId) {
      videoId = url.split("/").pop() || "";
    }
    // Remove query params if any from the parsed ID
    videoId = videoId.split("?")[0] || videoId;
    // rel=0 prevents videos from other channels at the end.
    // iv_load_policy=3 hides annotations.
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&disablekb=1&iv_load_policy=3`;
  };

  if (loading) {
    return (
      <div className="flex-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="student-container">
      <div className="header-section">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My <span className="text-blue-600">Learning</span></h1>
        <p className="text-slate-500 font-medium">Continue where you left off and master your skills.</p>
      </div>

      {!selectedCourse ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course._id}
                onClick={() => setSelectedCourse(course)}
                className="course-card group cursor-pointer"
              >
                <div className="card-image">
                  <img src={course.thumbnail || "/course-placeholder.jpg"} alt={course.title} />
                  <div className="overlay">
                    <div className="play-icon"><Play size={24} fill="white" /></div>
                  </div>
                </div>
                <div className="card-content">
                  <div className="teacher-badge">
                    <BookOpen size={12} /> {course.teacher?.name}
                  </div>
                  <h3 className="course-title">{course.title}</h3>
                  <div className="card-meta">
                    <span>{course.lectures?.length || 0} Lectures</span>
                    <ChevronRight size={16} className="arrow" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-10 h-10 text-blue-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No courses yet</h3>
              <p className="text-slate-500 mt-2">Explore our catalog and start learning today!</p>
              <a href="/#online-courses" className="inline-block mt-6 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20">Browse Courses</a>
            </div>
          )}
        </div>
      ) : (
        <div className="lecture-view mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => setSelectedCourse(null)}
            className="back-btn mb-8"
          >
            <ChevronRight className="rotate-180" size={18} /> Back to My Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Lecture List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="course-info-mini p-6 bg-white rounded-3xl border border-slate-100 shadow-sm mb-6">
                <h2 className="text-xl font-black text-slate-900 mb-1">{selectedCourse.title}</h2>
                <p className="text-sm text-slate-500 font-medium">{selectedCourse.lectures?.length || 0} total lectures</p>
              </div>

              <div className="lecture-list custom-scrollbar">
                {selectedCourse.lectures?.map((lecture, index) => (
                  <div
                    key={lecture._id || `lecture-${index}`}
                    onClick={() => {
                      setActiveVideoUrl(lecture.youtubeUrl);
                      setActiveLectureTitle(lecture.title);
                    }}
                    className={`lecture-item ${activeVideoUrl === lecture.youtubeUrl ? 'active' : ''}`}
                  >
                    <div className="lecture-index">{index + 1}</div>
                    <div className="lecture-info">
                      <h4 className="lecture-name">{lecture.title}</h4>
                      <div className="lecture-badges">
                        {lecture.isLive && <span className="badge-live">LIVE</span>}
                        <span className="lecture-duration"><Clock size={10} /> Video</span>
                      </div>
                    </div>
                    <div className="play-btn"><Play size={14} fill="currentColor" /></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Theater Mode View area for Video */}
            <div className="lg:col-span-2">
              {activeVideoUrl ? (
                <div className="theater-mode animate-in zoom-in-95 duration-300">
                  <div className="video-header">
                    <h3 className="video-title">{activeLectureTitle}</h3>
                    <div className="platform-tag">AMOGH ACADEMY PLAYER</div>
                  </div>
                  <div className="video-wrapper">
                    {/* We overlay a transparent div over the top area to block clicks on Share/Watch Later */}
                    <div className="absolute top-0 left-0 w-full h-20 z-10 pointer-events-auto bg-transparent"></div>
                      <iframe
                        src={getYoutubeEmbedUrl(activeVideoUrl)}
                        title="Course Lecture"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    <div className="video-footer-overlay z-20">
                      Viewing as Student: {session?.user?.name}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-video-placeholder">
                  <div className="pulse-icon">
                    <Monitor size={48} className="text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-400 mt-6">Select a lecture to start watching</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .student-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-section {
          margin-bottom: 2rem;
        }

        .course-card {
          background: white;
          border-radius: 2rem;
          overflow: hidden;
          border: 1px solid #f1f5f9;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .course-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }

        .card-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-cover;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(37, 99, 235, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .course-card:hover .overlay {
          opacity: 1;
        }

        .play-icon {
          background: white;
          padding: 1rem;
          border-radius: 50%;
          color: #2563eb;
          transform: scale(0.8);
          transition: transform 0.3s;
        }

        .course-card:hover .play-icon {
          transform: scale(1);
        }

        .card-content {
          padding: 1.5rem;
        }

        .teacher-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8fafc;
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .course-title {
          font-size: 1.25rem;
          font-weight: 900;
          color: #0f172a;
          line-clamp: 1;
          margin-bottom: 1rem;
        }

        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          font-weight: 700;
          color: #94a3b8;
        }

        .arrow {
          color: #3b82f6;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s;
        }

        .course-card:hover .arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          color: #3b82f6;
          background: #eff6ff;
          padding: 0.75rem 1.25rem;
          border-radius: 1rem;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #dbeafe;
        }

        .lecture-list {
          max-height: 500px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .lecture-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0.75rem;
        }

        .lecture-item:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateX(4px);
        }

        .lecture-item.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .lecture-index {
          width: 2.5rem;
          height: 2.5rem;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          font-weight: 900;
          color: #64748b;
          font-size: 0.875rem;
        }

        .lecture-item.active .lecture-index {
          background: #3b82f6;
          color: white;
        }

        .lecture-info {
          flex-grow: 1;
        }

        .lecture-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .lecture-badges {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .badge-live {
          font-size: 0.6rem;
          font-weight: 900;
          color: #e11d48;
          background: #fff1f2;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          animation: pulse 2s infinite;
        }

        .lecture-duration {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: #94a3b8;
        }

        .play-btn {
          color: #cbd5e1;
          transition: color 0.2s;
        }

        .lecture-item:hover .play-btn {
          color: #3b82f6;
        }

        .theater-mode {
          background: #020617;
          border-radius: 2.5rem;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .video-header {
          padding: 1.5rem 2rem;
          background: linear-gradient(to right, #0f172a, #020617);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .video-title {
          color: white;
          font-size: 1.125rem;
          font-weight: 800;
        }

        .platform-tag {
          font-size: 0.6rem;
          font-weight: 900;
          color: #3b82f6;
          letter-spacing: 0.1em;
          padding: 0.25rem 0.75rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 100px;
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
        }

        .video-wrapper iframe {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          border: 0;
        }

        .video-footer-overlay {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          font-size: 0.6rem;
          font-weight: 800;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          pointer-events: none;
        }

        .empty-video-placeholder {
          height: 100%;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border: 2px dashed #e2e8f0;
          border-radius: 2.5rem;
        }

        .pulse-icon {
          animation: bounce 2s infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
