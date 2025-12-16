import React, { useState } from "react";
import { User, Mail, BookOpen, Award, Upload } from "lucide-react";

export default function Profile() {
  const [student, setStudent] = useState({
    name: "Alex Johnson",
    id: "STU2025001",
    department: "Computer Science",
    year: "3rd Year",
    email: "alex.johnson@college.edu",
    avatar: null,
  });

  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudent((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
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
            <User
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
              My Profile
            </h2>
            <p className="text-green-400 font-medium text-sm">
              Manage your personal details and profile picture
            </p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-green-800 flex items-center justify-center text-3xl font-bold text-white">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label
                htmlFor="avatarUpload"
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-full cursor-pointer"
              >
                <Upload className="w-6 h-6 text-green-400" />
              </label>
              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <h3 className="mt-4 text-xl font-semibold text-white">
              {student.name}
            </h3>
            <p className="text-gray-400 text-sm">{student.id}</p>
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-5">
            <ProfileField
              icon={<BookOpen className="text-green-400" />}
              label="Department"
              value={student.department}
            />
            <ProfileField
              icon={<Award className="text-green-400" />}
              label="Year"
              value={student.year}
            />
            <ProfileField
              icon={<Mail className="text-green-400" />}
              label="Email"
              value={student.email}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-gray-900 border border-green-600/30 rounded-xl p-4 hover:border-green-400 transition-all">
      <div>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white font-semibold">{value}</p>
      </div>
    </div>
  );
}
