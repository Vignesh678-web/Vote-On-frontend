// components/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { clearTeacherAuth } from "../../../utils/auth";
import { 
  Settings, Camera, Edit2, Save, X, LogOut, Mail, User 
} from 'lucide-react';

const SettingsComponent = () => {
  const navigate = useNavigate();

  // 🔄 Hydrate profile data from local storage
  const storedTeacher = JSON.parse(localStorage.getItem("teacher") || "{}");
  
  const teacherName = storedTeacher.Name || "Faculty Officer";
  const teacherEmail = storedTeacher.email || "officer@system.edu";
  const teacherRole = storedTeacher.role || "Officer";
  const teacherClass = storedTeacher.className || "N/A";
  const teacherSection = storedTeacher.section || "N/A";

  const handleLogout = () => {
    clearTeacherAuth();
    const logoutPath = storedTeacher.role === 'returning_officer' ? "/returning/login" : "/teacher/login";
    navigate(logoutPath, { replace: true });
  };

  const initials = teacherName?.split(" ").map(x => x[0]).join("").toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-black p-4 space-y-6">
      {/* Account Profile Section */}
      <div className="bg-gray-900 rounded-3xl p-8 border border-green-500/20 shadow-2xl relative overflow-hidden">
        {/* Aesthetic Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
            <Settings className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Verified Profile</h2>
            <p className="text-green-500/60 text-xs font-bold tracking-widest uppercase mt-1">Personnel Information</p>
          </div>
        </div>

        {/* Profile Avatar */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-green-500/10 p-1 bg-gray-950 shadow-inner">
              <div className="w-full h-full rounded-full bg-linear-to-br from-green-500/20 to-transparent flex items-center justify-center text-green-400 text-4xl font-black">
                {initials}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-green-500 rounded-lg border-2 border-gray-900 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-black" />
            </div>
          </div>
          <h3 className="text-white font-black text-xl mt-4 tracking-tighter">{teacherName}</h3>
          <p className="text-green-400/50 text-xs font-bold uppercase tracking-[0.3em]">{teacherRole}</p>
        </div>

        {/* Read-only Identity Fields */}
        <div className="space-y-4 max-w-md mx-auto">
          <InfoCard label="Full Identity" value={teacherName} icon={<User className="w-4 h-4 text-green-400" />} />
          <InfoCard label="Communication Channel" value={teacherEmail} icon={<Mail className="w-4 h-4 text-green-400" />} />
          
          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="Assigned Class" value={teacherClass} icon={<Building2 className="w-4 h-4 text-green-400" />} />
            <InfoCard label="Section" value={teacherSection} icon={<Hash className="w-4 h-4 text-green-400" />} />
          </div>

          <InfoCard label="System Permission" value={teacherRole} icon={<ShieldCheck className="w-4 h-4 text-green-400" />} />
        </div>
      </div>

      {/* Logout Action */}
      <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white font-black uppercase tracking-tighter">Terminate Session</p>
            <p className="text-red-500/50 text-xs font-bold uppercase tracking-widest mt-0.5">Clears all security tokens</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full md:w-auto bg-red-500 hover:bg-red-600 active:scale-95 transition-all px-10 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-red-500/20"
        >
          Logout Securely
        </button>
      </div>
    </div>
  );
};

// Static Info Display Component
const InfoCard = ({ label, value, icon }) => (
  <div className="group bg-gray-950/50 border border-white/5 p-4 rounded-2xl hover:border-green-500/20 transition-colors">
    <label className="text-[10px] text-green-500/40 font-black uppercase tracking-widest block mb-2">{label}</label>
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-gray-900 rounded-lg border border-white/5">
        {icon}
      </div>
      <p className="text-white font-medium text-sm tracking-tight">{value}</p>
    </div>
  </div>
);

// Note: Additional icons added to imports for this view
import { ShieldCheck, Building2, Hash } from 'lucide-react';

export default SettingsComponent;
