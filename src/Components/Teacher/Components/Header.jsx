// Components/Teacher/Components/Header.jsx
import React from "react";
import { Menu, X, Camera } from "lucide-react";
import logo from "../Assets/logo.png";

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  teacherName,
  teacherRole,
  classInfo,
  profileImage,
  profileInputRef,
  handleProfileImageUpload,
}) => {
  // ✅ SAFE INITIALS GENERATOR (never crashes)
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "TD"; // fallback
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0]?.toUpperCase())
      .join("");
  };

  return (
    <div
      className="bg-black/90 backdrop-blur-xl border-b border-green-500/30 sticky top-0 z-30"
      style={{ boxShadow: "0 4px 30px rgba(34, 197, 94, 0.1)" }}
    >
      <div className="flex items-center justify-between p-4 lg:px-8">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Hamburger Menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-green-500/10 rounded-xl transition-all border border-green-500/20"
          >
            {sidebarOpen ? (
              <X
                className="w-6 h-6 text-green-400"
                style={{ filter: "drop-shadow(0 0 8px rgba(34,197,94,0.6))" }}
              />
            ) : (
              <Menu
                className="w-6 h-6 text-green-400"
                style={{ filter: "drop-shadow(0 0 8px rgba(34,197,94,0.6))" }}
              />
            )}
          </button>

          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 border border-green-400/30"
              style={{ boxShadow: "0 0 25px rgba(34,197,94,0.5)" }}
            >
              <img src={logo} className="w-8 h-8 object-contain" />
            </div>

            <div>
              <h1
                className="text-white font-black text-lg lg:text-xl"
                style={{ textShadow: "0 0 15px rgba(34,197,94,0.3)" }}
              >
                VoteOn
              </h1>
              <p className="text-green-400 text-xs font-semibold hidden sm:block">
                Teacher Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Profile */}
          <div className="relative group">
            <div
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl overflow-hidden bg-gradient-to-br from-green-400 to-green-600 cursor-pointer ring-2 ring-green-500/30 group-hover:ring-green-400/60 transition-all"
              style={{ boxShadow: "0 0 20px rgba(34,197,94,0.4)" }}
              onClick={() => profileInputRef?.current?.click()}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-black font-extrabold text-sm lg:text-base">
                  {getInitials(teacherName)}
                </div>
              )}
            </div>

            <button
              onClick={() => profileInputRef?.current?.click()}
              className="absolute -bottom-1 -right-1 bg-green-600 hover:bg-green-500 text-black p-1.5 rounded-lg transition-all border border-green-400/50"
              style={{ boxShadow: "0 0 15px rgba(34,197,94,0.5)" }}
            >
              <Camera className="w-3 h-3" />
            </button>

            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="hidden"
            />
          </div>

          {/* Teacher Name + Role */}
          <div className="text-right hidden lg:block">
            <p
              className="text-white font-bold text-sm"
              style={{ textShadow: "0 0 10px rgba(34,197,94,0.2)" }}
            >
              {teacherName || "Teacher"}
            </p>
            <p className="text-green-400 text-xs font-semibold">
              {teacherRole || "Faculty"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
