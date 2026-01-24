import React, { useState, useEffect } from "react";
import { User, Mail, BookOpen, Award, Upload, Shield } from "lucide-react";
import axios from "axios";

export default function Profile() {
  const [student, setStudent] = useState({
    name: "Student",
    admissionNumber: "N/A",
    className: "N/A",
    section: "N/A",
    email: "N/A",
    avatar: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Initial load from localStorage for speed
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      try {
        const parsed = JSON.parse(storedStudent);
        updateStudentState(parsed);
      } catch (e) {
        console.error("Error parsing student data");
      }
    }

    // Live fetch for accuracy
    fetchProfile();
  }, []);

  const updateStudentState = (data) => {
    setStudent({
      name: data.name || "Student",
      admissionNumber: data.admissionNumber || "N/A",
      className: data.className || "General",
      section: data.section || "A",
      email: data.email || "No email provided",
      avatar: data.photoUrl || null
    });
    if (data.photoUrl) setPreview(data.photoUrl);
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/student/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.student) {
        updateStudentState(res.data.student);
        // Refresh localStorage for other components
        localStorage.setItem("student", JSON.stringify(res.data.student));
      }
    } catch (err) {
      console.error("Failed to fetch fresh profile:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      // In a real app, you would upload this to the backend here
    }
  };

  return (
    <div
      className="min-h-screen p-6 text-white"
      style={{
        background: "linear-gradient(to bottom, #000000, #0a0f0a)",
      }}
    >
      <div
        className="bg-gray-950 border border-green-500/30 rounded-xl p-8 shadow-lg max-w-5xl mx-auto"
        style={{
          boxShadow: "0 0 30px rgba(34, 197, 94, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="p-3 bg-green-500/20 rounded-xl border border-green-500/40"
            style={{ boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)" }}
          >
            <Shield
              className="w-6 h-6 text-green-400"
              style={{
                filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))",
              }}
            />
          </div>
          <div>
            <h2
              className="text-3xl font-bold text-white"
              style={{
                textShadow: "0 0 15px rgba(34, 197, 94, 0.3)",
              }}
            >
              Voter Profile
            </h2>
            <p className="text-green-400 font-medium text-sm">
              Your institutional record and voting eligibility
            </p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3">
            <div className="relative group">
              <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-green-900/30 flex items-center justify-center text-5xl font-bold text-green-400">
                    {student.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label
                htmlFor="avatarUpload"
                className="absolute bottom-2 right-2 p-2 bg-green-500 text-black rounded-lg cursor-pointer hover:bg-green-400 transition-all shadow-lg"
              >
                <Upload className="w-5 h-5" />
              </label>
              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">
              {student.name}
            </h3>
            <p className="text-green-500 font-mono tracking-wider">{student.admissionNumber}</p>
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField
                icon={<BookOpen className="text-green-400" />}
                label="Class / Course"
                value={student.className}
              />
              <ProfileField
                icon={<Award className="text-green-400" />}
                label="Section"
                value={student.section}
              />
            </div>
            <ProfileField
              icon={<Mail className="text-green-400" />}
              label="Official Email"
              value={student.email}
            />

            <div className="mt-8 p-6 bg-green-500/5 border border-green-500/20 rounded-2xl">
              <h4 className="text-sm font-bold text-green-400 uppercase mb-4 tracking-widest">Eligibility Status</h4>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
                <p className="text-gray-300">Verified & Eligible to participate in active elections.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-green-500/30 transition-all group">
      <div className="p-3 bg-black rounded-xl border border-white/5 group-hover:border-green-500/20 transition-all">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-white font-semibold text-lg">{value}</p>
      </div>
    </div>
  );
}

