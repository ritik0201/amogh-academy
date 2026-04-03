"use strict";
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, Edit, Trash2, X, User, BookOpen, ExternalLink, Loader2, 
  Image as ImageIcon, Upload, Shield, Users, Layers, Zap, Search, ChevronRight, Eye
} from "lucide-react";

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  enrolledStudents: string[];
  teacher?: Teacher;
}

export default function AdminCoursePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      if (res.ok) setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/admin/teachers");
      const data = await res.json();
      if (res.ok) setTeachers(data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ritik@2177");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dl4k944jy"}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCurrentCourse({ ...currentCourse, thumbnail: data.secure_url });
      } else {
        console.error("Cloudinary Upload Error:", data.error?.message);
        alert("Upload failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("External upload error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const url = isEditing
      ? `/api/admin/courses/${currentCourse._id}`
      : "/api/admin/courses";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentCourse.title,
          description: currentCourse.description,
          thumbnail: currentCourse.thumbnail,
          teacherId: currentCourse.teacher?._id,
          price: currentCourse.price || 5,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setCurrentCourse({});
        fetchCourses();
      }
    } catch (error) {
      console.error("Failed to save course:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (res.ok) fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const openEditModal = (course: Course) => {
    setCurrentCourse(course);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-container">
      <div className="header">
        <div className="title-section">
          <span className="platform-label">
            <Shield size={12} />
            ADMINISTRATOR ACCESS
          </span>
          <h1>Curriculum Lab</h1>
          <p>Architect the learning paths and empower your educators.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => { 
            setIsEditing(false); 
            setCurrentCourse({ thumbnail: "" }); 
            setIsModalOpen(true); 
          }}
        >
          <Plus size={20} />
          Create Master Course
        </button>
      </div>

      <div className="discovery-bar">
        <div className="stats-row">
          <div className="stat-card">
            <Layers className="stat-icon" />
            <div className="stat-value">{courses.length}</div>
            <div className="stat-label">Total Courses</div>
          </div>
          <div className="stat-card">
            <Users className="stat-icon" />
            <div className="stat-value">{teachers.length}</div>
            <div className="stat-label">Active Educators</div>
          </div>
        </div>
        
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by course title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="loader-box">
            <Loader2 className="animate-spin" size={40} />
            <p>Syncing curriculum data...</p>
          </div>
        </div>
      ) : (
        <div className="course-grid">
          {filteredCourses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-art">
                <BookOpen size={60} />
              </div>
              <h3>No courses found</h3>
              <p>Try refining your search or create a new curriculum path.</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course._id} className="course-card" style={{cursor:"pointer"}} onClick={() => router.push(`/admin/course/${course._id}`)}>
                <div className="thumbnail-container">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <BookOpen size={48} />
                    </div>
                  )}
                  <div className="card-overlay"></div>
                  <div className="card-actions">
                    <button className="action-btn edit" onClick={(e) => { e.stopPropagation(); openEditModal(course); }} title="Settings">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete(course._id); }} title="Archive">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <h3>{course.title}</h3>
                    <div className="teacher-badge">
                      <div className="avatar-mini">
                        {course.teacher?.name?.charAt(0) || <User size={10} />}
                      </div>
                      <span>{course.teacher ? course.teacher.name : "Unassigned"}</span>
                    </div>
                  </div>
                  <p className="description line-clamp-2">{course.description || "Comprehensive learning module for advanced students."}</p>
                  <div className="card-footer">
                    <div className="course-type">
                       <Zap size={12} className="text-yellow-400" />
                       <span>Standard Course â€¢ â‚¹{course.price || 5}</span>
                    </div>
                    <ChevronRight size={18} className="arrow-icon" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-pop">
            <div className="modal-header">
              <div className="modal-title-box">
                <div className="modal-icon-box">
                  {isEditing ? <Edit size={20} /> : <Plus size={20} />}
                </div>
                <h2>{isEditing ? "Modify Analytics" : "New Learning Path"}</h2>
              </div>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>COURSE TITLE</label>
                <input
                  type="text"
                  required
                  value={currentCourse.title || ""}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, title: e.target.value })}
                  placeholder="e.g. Quantum Computing 101"
                />
              </div>
              <div className="form-group">
                <label>EXTENDED DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={currentCourse.description || ""}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                  placeholder="Define the scope and objectives..."
                />
              </div>
              
              <div className="form-group">
                <label>MASTER THUMBNAIL</label>
                <div className="upload-container">
                  {currentCourse.thumbnail ? (
                    <div className="preview-box">
                      <img src={currentCourse.thumbnail} alt="Preview" />
                      <div className="preview-overlay">
                        <button 
                          type="button" 
                          className="remove-img" 
                          onClick={() => setCurrentCourse({ ...currentCourse, thumbnail: "" })}
                        >
                          <X size={14} /> REMOVE IMAGE
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      {uploading ? (
                        <div className="upload-progress">
                          <Loader2 className="animate-spin" size={32} />
                          <p>Transmitting Data...</p>
                        </div>
                      ) : (
                        <div className="upload-trigger">
                          <div className="upload-icon-circle">
                            <Upload size={30} />
                          </div>
                          <div className="upload-text">
                            <strong>Drop media here or click</strong>
                            <span>JPG, PNG, WebP up to 10MB</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="file-input"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Course Price (â‚¹)</label>
                <input
                  type="number"
                  min="0"
                  value={currentCourse.price || 5}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, price: parseInt(e.target.value) })}
                  placeholder="Enter course price (Default: 5)"
                />
              </div>
              <div className="form-group">
                <label>EDUCATOR ASSIGNMENT</label>
                <div className="select-wrapper">
                  <select
                    value={currentCourse.teacher?._id || ""}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, teacher: { _id: e.target.value } as any })}
                  >
                    <option value="">Awaiting Assignment</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>{t.name} (ID: {t.email.split('@')[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={formLoading}>
                {formLoading ? <Loader2 className="animate-spin" size={20} /> : (isEditing ? "SAVE CONFIGURATION" : "INITIALIZE CURRICULUM")}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-container {
          padding: 3rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
          color: #fff;
          background: #020617;
          min-height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 4rem;
        }

        .platform-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 112, 243, 0.1);
          color: #3b82f6;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          margin-bottom: 1rem;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        h1 {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .header p {
          color: #64748b;
          margin: 0.75rem 0 0 0;
          font-size: 1.1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #0070f3 0%, #00a4ff 100%);
          color: white;
          border: none;
          padding: 1.25rem 2rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 15px 35px -10px rgba(0, 112, 243, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px -12px rgba(0, 112, 243, 0.5);
        }

        .discovery-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3.5rem;
          gap: 2rem;
        }

        .stats-row {
          display: flex;
          gap: 1.5rem;
        }

        .stat-card {
          background: #0f172a;
          border: 1px solid #1e293b;
          padding: 1rem 2rem;
          border-radius: 20px;
          min-width: 180px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .stat-icon {
          position: absolute;
          right: -10px;
          top: -10px;
          width: 60px;
          height: 60px;
          color: #1e293b;
          z-index: 0;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 900;
          color: #fff;
          z-index: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          z-index: 1;
        }

        .search-box {
           position: relative;
           flex-grow: 1;
           max-width: 500px;
        }

        .search-icon {
           position: absolute;
           left: 1.25rem;
           top: 50%;
           transform: translateY(-50%);
           color: #475569;
        }

        .search-box input {
           width: 100%;
           background: #0f172a;
           border: 1px solid #1e293b;
           padding: 1.1rem 1.1rem 1.1rem 3.5rem;
           border-radius: 18px;
           color: white;
           font-size: 0.95rem;
           transition: all 0.2s;
        }

        .search-box input:focus {
           outline: none;
           border-color: #3b82f6;
           box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 3rem;
        }

        .course-card {
          background: #0f172a;
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid #1e293b;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .course-card:hover {
          transform: translateY(-15px);
          border-color: #3b82f6;
          box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(59, 130, 246, 0.2);
        }

        .thumbnail-container {
          position: relative;
          aspect-ratio: 16/9;
          background: #1e293b;
          overflow: hidden;
        }

        .thumbnail-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .course-card:hover .thumbnail-container img {
          transform: scale(1.15);
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 60%, rgba(15, 23, 42, 0.8) 100%);
          z-index: 1;
        }

        .thumbnail-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #334155;
        }

        .card-actions {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          display: flex;
          gap: 0.75rem;
          z-index: 10;
          transform: translateX(20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .course-card:hover .card-actions {
          transform: translateX(0);
          opacity: 1;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(15, 23, 42, 0.6);
          color: white;
          backdrop-filter: blur(12px);
          transition: all 0.2s;
        }

        .action-btn.edit:hover { background: #3b82f6; color: white; transform: scale(1.1); }
        .action-btn.delete:hover { background: #ef4444; color: white; transform: scale(1.1); }

        .card-content {
          padding: 2.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .card-header {
           display: flex;
           justify-content: space-between;
           align-items: flex-start;
           margin-bottom: 1rem;
        }

        .card-header h3 {
          margin: 0;
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #f1f5f9;
        }

        .teacher-badge {
           background: #1e293b;
           padding: 6px 12px 6px 6px;
           border-radius: 30px;
           display: flex;
           align-items: center;
           gap: 0.75rem;
           color: #94a3b8;
           font-size: 0.8rem;
           font-weight: 700;
           border: 1px solid #334155;
        }

        .avatar-mini {
           width: 24px;
           height: 24px;
           background: #3b82f6;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           color: white;
           font-size: 0.65rem;
           font-weight: 900;
        }

        .description {
          color: #64748b;
          font-size: 1rem;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .card-footer {
           margin-top: auto;
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding-top: 1.5rem;
           border-top: 1px solid #1e293b;
        }

        .course-type {
           display: flex;
           align-items: center;
           gap: 0.5rem;
           font-size: 0.8rem;
           font-weight: 800;
           color: #94a3b8;
           text-transform: uppercase;
           letter-spacing: 0.05em;
        }

        .arrow-icon {
           color: #1e293b;
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .course-card:hover .arrow-icon {
           color: #3b82f6;
           transform: translateX(5px);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(2, 6, 23, 0.9);
          backdrop-filter: blur(15px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1000;
          overflow-y: auto;
          padding: 2rem 1rem;
        }

        .modal-content {
          background: #0f172a;
          padding: 3.5rem;
          border-radius: 40px;
          width: 100%;
          max-width: 600px;
          max-height: none;
          border: 1px solid #1e293b;
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7);
          margin: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }

        .modal-title-box {
           display: flex;
           align-items: center;
           gap: 1.25rem;
        }

        .modal-icon-box {
           width: 50px;
           height: 50px;
           background: #1e293b;
           border-radius: 16px;
           display: flex;
           align-items: center;
           justify-content: center;
           color: #3b82f6;
        }

        .modal-header h2 {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .close-btn {
          background: #1e293b;
          border: none;
          color: #64748b;
          width: 44px;
          height: 44px;
          border-radius: 14px;
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
          font-weight: 900;
          color: #475569;
          letter-spacing: 0.1em;
        }

        .form-group input, .form-group textarea, .form-group select {
          width: 100%;
          background: #020617;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 1.1rem;
          color: white;
          font-family: inherit;
          transition: all 0.2s;
        }

        .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .upload-container {
          width: 100%;
        }

        .preview-box {
          position: relative;
          width: 100%;
          height: 200px;
          border-radius: 20px;
          overflow: hidden;
          background: #020617;
          border: 1px solid #1e293b;
        }

        .preview-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-overlay {
           position: absolute;
           inset: 0;
           background: rgba(0,0,0,0.4);
           display: flex;
           align-items: center;
           justify-content: center;
           opacity: 0;
           transition: all 0.3s;
        }

        .preview-box:hover .preview-overlay {
           opacity: 1;
        }

        .remove-img {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          font-size: 0.75rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .remove-img:hover { transform: scale(1.05); }

        .upload-placeholder {
          position: relative;
          width: 100%;
          height: 160px;
          background: #020617;
          border: 2px dashed #1e293b;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .upload-placeholder:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }

        .upload-trigger {
           text-align: center;
        }

        .upload-icon-circle {
           width: 60px;
           height: 60px;
           background: #0f172a;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           color: #334155;
           margin: 0 auto 1rem;
           border: 1px solid #1e293b;
           transition: all 0.3s;
        }

        .upload-placeholder:hover .upload-icon-circle {
           background: #3b82f6;
           color: white;
           border-color: #3b82f6;
        }

        .upload-text strong {
           display: block;
           font-size: 1rem;
           color: #94a3b8;
           margin-bottom: 0.25rem;
        }

        .upload-text span {
           font-size: 0.75rem;
           color: #475569;
        }

        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
          text-align: center;
        }

        .loader-box p {
           margin-top: 1.5rem;
           color: #64748b;
           font-weight: 600;
           letter-spacing: 0.05em;
        }

        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, #0070f3 0%, #00a4ff 100%);
          color: white;
          border: none;
          padding: 1.25rem;
          border-radius: 20px;
          margin-top: 2rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 15px 30px -10px rgba(0, 112, 243, 0.4);
          letter-spacing: 0.02em;
        }

        .btn-submit:hover {
           transform: scale(1.02);
           box-shadow: 0 20px 45px -12px rgba(0, 112, 243, 0.5);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .empty-state {
           grid-column: 1 / -1;
           padding: 8rem 2rem;
           text-align: center;
           background: #0f172a;
           border-radius: 40px;
           border: 2px dashed #1e293b;
        }

        .empty-art {
           width: 100px;
           height: 100px;
           background: #1e293b;
           border-radius: 30px;
           display: flex;
           align-items: center;
           justify-content: center;
           color: #334155;
           margin: 0 auto 2rem;
        }

        .empty-state h3 { font-size: 2rem; font-weight: 900; margin-bottom: 1rem; }
        .empty-state p { color: #64748b; font-size: 1.1rem; }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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

