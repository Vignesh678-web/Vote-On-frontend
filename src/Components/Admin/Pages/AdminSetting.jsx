import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAdminAuth } from "../../../utils/auth";
import axios from "axios";
import { 
  User, 
  Lock, 
  Shield, 
  Save, 
  LogOut,
  Loader2,
  Mail,
  Fingerprint
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Initialize from localStorage for instant feedback
  const getInitialData = () => {
    const role = localStorage.getItem("role");
    const rawData = role === "admin" 
      ? localStorage.getItem("admin") 
      : localStorage.getItem("teacher");
    
    try {
      const data = JSON.parse(rawData);
      return {
        name: data?.Name || data?.name || "",
        id: data?.adminId || data?.facultyId || "",
        email: data?.email || "",
        role: role || "Unknown"
      };
    } catch (e) {
      return { name: "", id: "", email: "", role: role || "Unknown" };
    }
  };

  const initial = getInitialData();
  const [profile, setProfile] = useState(initial);
  const [name, setName] = useState(initial.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/admin/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        const p = res.data.profile;
        const mapped = {
          name: p.Name || p.name || p.adminId || p.facultyId || "Admin",
          id: p.adminId || p.facultyId || "",
          email: p.email || "",
          role: localStorage.getItem("role")
        };
        setProfile(mapped);
        if (!name) setName(mapped.name);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      const res = await axios.put("http://localhost:5000/api/admin/auth/update-profile", {
        name: name.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success("Profile updated successfully");
        // Update local session data
        const role = localStorage.getItem("role");
        const key = role === "admin" ? "admin" : "teacher";
        const currentData = JSON.parse(localStorage.getItem(key));
        const newData = { ...currentData, Name: name.trim(), name: name.trim() };
        localStorage.setItem(key, JSON.stringify(newData));
        
        setProfile(prev => ({ ...prev, name: name.trim() }));
      }
    } catch (err) {
      console.error("Update profile error:", err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      const res = await axios.put("http://localhost:5000/api/admin/auth/update-password", {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success("Password updated successfully");
        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Update password error:", err);
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // 🔐 Clear ONLY admin auth
      clearAdminAuth();
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <Toaster position="top-right" />
      
      {/* 🔹 Header */}
      <div className="flex items-center justify-between bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20">
            {profile.name ? profile.name.charAt(0).toUpperCase() : <User />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{profile.name || 'Administrative User'}</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                 {profile.role} ACCESS
               </span>
               <span className="text-slate-500 text-xs font-mono">{profile.id}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-2xl transition-all group"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 🔹 Identity Form */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-2xl text-slate-400">
              <Fingerprint className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Identity</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Full Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-5 text-white focus:border-indigo-500/50 transition-all font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800/50 rounded-2xl py-3.5 px-5 text-slate-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">{profile.email || 'No email linked'}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Personnel Identifier</label>
              <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800/50 rounded-2xl py-3.5 px-5 text-slate-400 font-mono text-sm">
                <Shield className="w-4 h-4" />
                <span>{profile.id}</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/10 text-xs uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* 🔹 Security Form */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-2xl text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Security</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Current Password</label>
              <input 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-5 text-white focus:border-indigo-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">New Password</label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-5 text-white focus:border-indigo-500/50 transition-all "
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Confirm Update</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-5 text-white focus:border-indigo-500/50 transition-all "
              />
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all text-xs uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {saving ? "Updating..." : "Update Credentials"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
