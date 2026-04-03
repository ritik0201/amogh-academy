"use strict";
"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Video, Play, ExternalLink, X, BookOpen, Loader2, ArrowLeft, 
  Monitor, Radio, Clock, ShieldCheck, Zap, Copy, CheckCheck
} from "lucide-react";
import { toast } from "sonner";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  enrolledStudents?: { email: string }[];
}

interface Lecture {
  _id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  isLive: boolean;
  createdAt: string;
}

export default function TeacherCoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeLectureTitle, setActiveLectureTitle] = useState<string | null>(null);
  const [togglingLive, setTogglingLive] = useState<string | null>(null);
  const [newLecture, setNewLecture] = useState({ 
    title: "", 
    description: "", 
    youtubeUrl: "",
    isLive: false 
  });
  const [copied, setCopied] = useState(false);

  const handleCopyEmails = () => {
    if (!selectedCourse?.enrolledStudents || selectedCourse.enrolledStudents.length === 0) {
      toast.error("No students enrolled in this course yet.");
      return;
    }

    const emails = selectedCourse.enrolledStudents.map(s => s.email).join(", ");
    navigator.clipboard.writeText(emails).then(() => {
      setCopied(true);
      toast.success("All student emails copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy emails:", err);
      toast.error("Failed to copy emails. Please try again.");
    });
  };

  useEffect(() => {
    fetchAssignedCourses();
  }, []);

  const fetchAssignedCourses = async () => {
    try {
      const res = await fetch("/api/teacher/courses");
      const data = await res.json();
      if (res.ok) setCourses(data);
    } catch (error) {
      console.error("Failed to fetch assigned courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLectures = async (courseId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lectures?courseId=${courseId}`);
      const data = await res.json();
      if (res.ok) setLectures(data);
    } catch (error) {
      console.error("Failed to fetch lectures:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    fetchLectures(course._id);
  };

  const handleAddLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/lectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newLecture, courseId: selectedCourse._id }),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setNewLecture({ title: "", description: "", youtubeUrl: "", isLive: false });
        fetchLectures(selectedCourse._id);
      }
    } catch (error) {
      console.error("Failed to add lecture:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0];
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1`;
  };

  const handleToggleLive = async (lectureId: string, currentStatus: boolean) => {
    setTogglingLive(lectureId);
    try {
      const res = await fetch(`/api/lectures/${lectureId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLive: !currentStatus }),
      });
      if (res.ok) {
        if (selectedCourse) fetchLectures(selectedCourse._id);
      }
    } catch (error) {
      console.error("Failed to toggle live status:", error);
    } finally {
      setTogglingLive(null);
    }
  };

  if (loading && !selectedCourse) {
    return (
      <div className="teacher-container flex-center">
        <div className="loader-box">
          <Loader2 className="animate-spin" size={40} color="#0070f3" />
          <p>Curating your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-container">
      {!selectedCourse ? (
        <>
          <div className="header">
            <div className="title-section">
              <span className="badge-new">TEACHER PORTAL</span>
              <h1>My Courses</h1>
              <p>Design your curriculum and manage your virtual classroom.</p>
            </div>
            <div className="stats-header">
              <div className="stat-pill">
                <Monitor size={16} />
                <span>{courses.length} Active Courses</span>
              </div>
            </div>
          </div>

          <div className="course-grid">
            {courses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon-box">
                  <Video size={48} className="icon-pulse" />
                </div>
                <h3>No Courses Yet</h3>
                <p>Welcome! You haven't been assigned any courses to teach yet. Please contact your administrator.</p>
              </div>
            ) : (
              courses.map((course) => (
                <div key={course._id} className="course-card" onClick={() => handleSelectCourse(course)}>
                  <div className="thumbnail-container">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} />
                    ) : (
                      <div className="thumbnail-placeholder">
                        <BookOpen size={40} />
                      </div>
                    )}
                    <div className="card-overlay">
                      <span className="overlay-badge">Live Curriculum</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="card-header-info">
                       <h3>{course.title}</h3>
                       <p className="line-clamp-2">{course.description || "Building the future of learning together."}</p>
                    </div>
                    <div className="card-footer">
                      <button className="btn-manage">
                        <span>Manage Lectures</span>
                        <Zap size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="header">
            <div className="title-section">
              <button className="btn-back" onClick={() => setSelectedCourse(null)}>
                <ArrowLeft size={18} /> BACK
              </button>
              <div className="flex items-center gap-4 mt-2">
                <h1>{selectedCourse.title}</h1>
                {lectures.some(l => l.isLive) && <span className="live-dot-main" title="Live Now!"></span>}
              </div>
              <p className="subtitle">Manage lectures and live sessions for this course</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                className="btn-secondary" 
                onClick={handleCopyEmails}
                title="Copy all student emails"
              >
                {copied ? <CheckCheck size={18} className="text-emerald-400" /> : <Copy size={18} />}
                <span>Copy Emails</span>
              </button>
              <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
                <Plus size={20} /> New Lecture
              </button>
            </div>
          </div>

          <div className="lecture-section">
             <div className="section-header">
                <h2>Captured Content ({lectures.length})</h2>
                <div className="filter-pills">
                  <span className="pill active">All</span>
                  <span className="pill">Recent</span>
                  <span className="pill">Live Sessions</span>
                </div>
             </div>
            
            <div className="lecture-list">
              {lectures.length === 0 ? (
                <div className="empty-lectures">
                  <Play size={40} />
                  <p>Ready to start teaching? Add your first lecture above.</p>
                </div>
              ) : (
                lectures.map((lecture) => (
                  <div key={lecture._id} className={`lecture-item ${lecture.isLive ? 'is-live-card' : ''}`}>
                    <div className="lecture-info">
                      <div className="title-row">
                        <h4>{lecture.title}</h4>
                        {lecture.isLive && (
                          <div className="live-tag">
                            <Radio size={12} className="live-icon" />
                            <span>LIVE NOW</span>
                          </div>
                        )}
                      </div>
                      <p>{lecture.description || "No description provided for this session."}</p>
                      <div className="lecture-meta">
                        <span className="meta-item">
                           <Clock size={12} />
                           {new Date(lecture.createdAt).toLocaleDateString()}
                        </span>
                        <span className="meta-item">
                           <ShieldCheck size={12} />
                           Verified Content
                        </span>
                      </div>
                    </div>
                    <div className="lecture-actions">
                      <div className="live-toggle-container">
                        <span className="toggle-label">LIVE</span>
                        <label className="switch-mini">
                          <input 
                            type="checkbox" 
                            disabled={togglingLive === lecture._id}
                            checked={lecture.isLive}
                            onChange={() => handleToggleLive(lecture._id, lecture.isLive)}
                          />
                          <span className="slider-mini round">
                            {togglingLive === lecture._id && <Loader2 className="animate-spin-mini" size={10} />}
                          </span>
                        </label>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveVideoUrl(lecture.youtubeUrl);
                          setActiveLectureTitle(lecture.title);
                        }}
                        className="btn-watch"
                      >
                        <Play size={16} fill="currentColor" /> WATCH
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-pop">
            <div className="modal-header">
              <h2>Launch New Lecture</h2>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddLecture}>
              <div className="form-group">
                <label>LECTURE TITLE</label>
                <input
                  type="text"
                  required
                  value={newLecture.title}
                  onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
                  placeholder="e.g. Mastering Advanced React Patterns"
                />
              </div>
              <div className="form-group">
                <label>DESCRIPTION (OPTIONAL)</label>
                <textarea
                  rows={3}
                  value={newLecture.description}
                  onChange={(e) => setNewLecture({ ...newLecture, description: e.target.value })}
                  placeholder="Brief summary of the topics covered..."
                />
              </div>
              <div className="form-group">
                <label>YOUTUBE URL</label>
                <input
                  type="url"
                  required
                  value={newLecture.youtubeUrl}
                  onChange={(e) => setNewLecture({ ...newLecture, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              
              <div className="form-group-row">
                <label className="switch-label">
                  <div className="switch-text">
                    <strong>Set as Live Session</strong>
                    <p>Alert students that this session is currently live</p>
                  </div>
                  <div className="switch-input">
                    <input 
                      type="checkbox" 
                      checked={newLecture.isLive}
                      onChange={(e) => setNewLecture({ ...newLecture, isLive: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </div>
                </label>
              </div>

              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin" size={20} /> : "PUBLISH TO DASHBOARD"}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeVideoUrl && (
        <div 
          className="modal-overlay video-modal" 
          onClick={() => {
            setActiveVideoUrl(null);
            setActiveLectureTitle(null);
          }}
        >
          <div className="video-viewer" onClick={(e) => e.stopPropagation()}>
            <div className="viewer-header">
              <div className="viewer-info">
                <span className="platform-tag">AMOGH ACADEMY • CINEMATIC PLAYER</span>
                <h3>{activeLectureTitle}</h3>
              </div>
              <button 
                className="close-video" 
                onClick={() => {
                  setActiveVideoUrl(null);
                  setActiveLectureTitle(null);
                }}
              >
                <X size={24} />
              </button>
            </div>
            <div className="iframe-wrapper">
              <div className="youtube-overlay-top"></div>
              <iframe
                src={getYoutubeEmbedUrl(activeVideoUrl)}
                title="YouTube Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .teacher-container {
          padding: 3rem 2rem;
          max-width: 1300px;
          margin: 0 auto;
          color: #fff;
          background: #020617;
          min-height: 100vh;
        }

        .flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .loader-box p {
          margin-top: 1.5rem;
          color: #94a3b8;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 4rem;
        }

        .badge-new {
          background: rgba(0, 112, 243, 0.1);
          color: #0070f3;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          display: inline-block;
          margin-bottom: 0.75rem;
          border: 1px solid rgba(0, 112, 243, 0.2);
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #1e293b;
          border: 1px solid #334155;
          color: #94a3b8;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: 8px;
          transition: all 0.2s;
          margin-bottom: 1.5rem;
        }

        .btn-back:hover { 
          color: #fff; 
          background: #334155;
        }

        h1 {
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .subtitle {
          color: #94a3b8;
          font-weight: 400;
          margin: 0.75rem 0 0 0;
          font-size: 1.1rem;
        }

        .stats-header {
           display: flex;
           gap: 1rem;
        }

        .stat-pill {
           background: #0f172a;
           border: 1px solid #1e293b;
           padding: 0.75rem 1.25rem;
           border-radius: 14px;
           display: flex;
           align-items: center;
           gap: 0.75rem;
           color: #f8fafc;
           font-size: 0.9rem;
           font-weight: 600;
        }

        .btn-primary {
          background: linear-gradient(135deg, #0070f3 0%, #00a4ff 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 25px -5px rgba(0, 112, 243, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 35px -8px rgba(0, 112, 243, 0.5);
        }

        .btn-secondary {
           background: #0f172a;
           border: 1px solid #1e293b;
           color: #f8fafc;
           padding: 1rem 1.5rem;
           border-radius: 14px;
           display: flex;
           align-items: center;
           gap: 0.75rem;
           font-weight: 700;
           cursor: pointer;
           transition: all 0.3s;
        }

        .btn-secondary:hover {
           background: #1e293b;
           border-color: #3b82f6;
           transform: translateY(-4px);
        }

        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 2.5rem;
        }

        .course-card {
          background: #0f172a;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid #1e293b;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .course-card:hover {
          transform: translateY(-12px);
          border-color: #3b82f6;
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(59, 130, 246, 0.3);
        }

        .thumbnail-container {
          aspect-ratio: 16/9;
          background: #1e293b;
          position: relative;
          overflow: hidden;
        }

        .thumbnail-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .course-card:hover .thumbnail-container img {
          transform: scale(1.1);
        }

        .card-overlay {
           position: absolute;
           bottom: 1.5rem;
           left: 1.5rem;
           z-index: 2;
        }

        .overlay-badge {
           background: rgba(0,0,0,0.6);
           backdrop-filter: blur(8px);
           color: #fff;
           padding: 6px 12px;
           border-radius: 8px;
           font-size: 0.75rem;
           font-weight: 700;
           border: 1px solid rgba(255,255,255,0.1);
        }

        .card-content {
          padding: 2rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-header-info h3 {
          margin: 0 0 0.75rem 0;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #f1f5f9;
        }

        .card-header-info p {
          color: #94a3b8;
          font-size: 0.95rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .btn-manage {
          width: 100%;
          background: #1e293b;
          color: #f1f5f9;
          border: 1px solid #334155;
          padding: 0.9rem;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .course-card:hover .btn-manage {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .lecture-section {
          background: #0f172a;
          padding: 3rem;
          border-radius: 32px;
          border: 1px solid #1e293b;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
        }

        .section-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 3rem;
        }

        .lecture-section h2 {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0;
        }

        .filter-pills {
           display: flex;
           gap: 1rem;
        }

        .filter-pills .pill {
           padding: 8px 16px;
           border-radius: 10px;
           background: #1e293b;
           color: #94a3b8;
           font-size: 0.8rem;
           font-weight: 700;
           cursor: pointer;
           border: 1px solid transparent;
           transition: all 0.2s;
        }

        .filter-pills .pill.active {
           background: rgba(59, 130, 246, 0.1);
           color: #3b82f6;
           border-color: rgba(59, 130, 246, 0.2);
        }

        .lecture-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .lecture-item {
          background: #1e293b66;
          padding: 2rem;
          border-radius: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #334155;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .lecture-item:hover {
          background: #1e293b;
          border-color: #475569;
          transform: scale(1.01);
        }

        .is-live-card {
           border-color: rgba(225, 29, 72, 0.3);
           background: rgba(225, 29, 72, 0.03);
        }

        .title-row {
           display: flex;
           align-items: center;
           gap: 1rem;
           margin-bottom: 0.75rem;
        }

        .lecture-info h4 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .live-tag {
           background: #fee2e2;
           color: #e11d48;
           padding: 4px 10px;
           border-radius: 6px;
           font-size: 0.7rem;
           font-weight: 800;
           display: flex;
           align-items: center;
           gap: 6px;
           animation: glow-red 2s infinite alternate;
        }

        .live-icon {
           animation: pulse 1s infinite;
        }

        .lecture-info p {
          color: #94a3b8;
          font-size: 0.95rem;
          margin: 0 0 1.25rem 0;
          max-width: 80%;
          line-height: 1.5;
        }

        .lecture-meta {
           display: flex;
           gap: 1.5rem;
        }

        .meta-item {
           display: flex;
           align-items: center;
           gap: 0.5rem;
           font-size: 0.8rem;
           font-weight: 600;
           color: #64748b;
        }

        .btn-watch {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #fff;
          background: #0070f3;
          border: none;
          padding: 0.85rem 1.75rem;
          border-radius: 14px;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 112, 243, 0.2);
        }

        .btn-watch:hover {
          background: #00a4ff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 112, 243, 0.4);
        }

        .lecture-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .live-toggle-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255,255,255,0.03);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .toggle-label {
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          color: #64748b;
        }

        .switch-mini {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
        }

        .switch-mini input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider-mini {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #1e293b;
          transition: .4s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slider-mini:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          z-index: 2;
        }

        input:checked + .slider-mini {
          background-color: #e11d48;
          box-shadow: 0 0 15px rgba(225, 29, 72, 0.4);
        }

        input:checked + .slider-mini:before {
          transform: translateX(20px);
        }

        .slider-mini.round {
          border-radius: 20px;
        }

        .slider-mini.round:before {
          border-radius: 50%;
        }

        .animate-spin-mini {
          animation: spin 1s linear infinite;
          color: #fff;
          opacity: 0.5;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(2, 6, 23, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .video-modal {
          padding: 2rem;
        }

        .video-viewer {
          position: relative;
          width: 95%;
          max-width: 1200px;
          aspect-ratio: 16/9;
          background: #000;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .iframe-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .youtube-overlay-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);
          z-index: 5;
          pointer-events: none;
        }

        .viewer-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 2rem 2.5rem;
          background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .viewer-info .platform-tag {
          color: #3b82f6;
          font-size: 0.75rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
          display: block;
        }

        .viewer-info h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
        }

        .iframe-wrapper iframe {
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .close-video {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(20px);
          transition: all 0.2s;
        }

        .close-video:hover {
          background: #e11d48;
          transform: rotate(90deg) scale(1.1);
        }

        .modal-content {
          background: #0f172a;
          padding: 3rem;
          border-radius: 32px;
          width: 100%;
          max-width: 560px;
          border: 1px solid #1e293b;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.6);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .modal-header h2 {
           font-size: 1.75rem;
           font-weight: 900;
           letter-spacing: -0.02em;
        }

        .close-btn {
          background: #1e293b;
          border: none;
          color: #64748b;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-btn:hover { color: #fff; background: #334155; }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.75rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }

        .form-group input, .form-group textarea {
          width: 100%;
          background: #020617;
          border: 1px solid #1e293b;
          border-radius: 14px;
          padding: 1rem;
          color: white;
          font-family: inherit;
          transition: all 0.2s;
        }

        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .form-group-row {
           margin-bottom: 2.5rem;
           padding: 1.5rem;
           background: #020617;
           border-radius: 18px;
           border: 1px solid #1e293b;
        }

        .switch-label {
           display: flex;
           justify-content: space-between;
           align-items: center;
           cursor: pointer;
        }

        .switch-text strong {
           display: block;
           font-size: 0.95rem;
           font-weight: 700;
           color: #f1f5f9;
        }

        .switch-text p {
           margin: 2px 0 0 0;
           font-size: 0.8rem;
           color: #64748b;
        }
        
        .switch-input {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 26px;
        }

        .switch-input input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #1e293b;
          transition: .4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: #3b82f6;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }

        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }

        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, #0070f3 0%, #00a4ff 100%);
          color: white;
          border: none;
          padding: 1.25rem;
          border-radius: 16px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 25px -5px rgba(0, 112, 243, 0.4);
          letter-spacing: 0.02em;
        }

        .btn-submit:hover {
           transform: scale(1.02);
           box-shadow: 0 15px 30px -8px rgba(0, 112, 243, 0.5);
        }

        .empty-state {
          grid-column: 1 / -1;
          background: #0f172a;
          border-radius: 32px;
          padding: 6rem 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px dashed #1e293b;
          text-align: center;
        }

        .empty-icon-box {
           width: 100px;
           height: 100px;
           background: #1e293b;
           border-radius: 30px;
           display: flex;
           align-items: center;
           justify-content: center;
           color: #3b82f6;
           margin-bottom: 2rem;
        }

        .empty-state h3 { font-size: 1.75rem; font-weight: 800; margin: 0 0 1rem 0; }
        .empty-state p { color: #64748b; font-size: 1.1rem; max-width: 400px; }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .animate-spin { animation: spin 1s linear infinite; }
        .icon-pulse { animation: pulse-blue 2s infinite; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @keyframes pulse {
           0% { opacity: 1; }
           50% { opacity: 0.4; }
           100% { opacity: 1; }
        }

        @keyframes pulse-blue {
           0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0.4)); }
           50% { transform: scale(1.1); filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.6)); }
           100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0.4)); }
        }

        @keyframes glow-red {
           from { box-shadow: 0 0 5px rgba(225, 29, 72, 0.2); }
           to { box-shadow: 0 0 20px rgba(225, 29, 72, 0.5); }
        }

        @keyframes pop {
           0% { transform: scale(0.9); opacity: 0; }
           100% { transform: scale(1); opacity: 1; }
        }

        .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
}
