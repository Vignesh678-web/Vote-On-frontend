import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  ClipboardList,
  UserCircle2,
  LogOut,
  Menu,
  Crown,
  Trophy,
} from "lucide-react";

import VoteOnLogo from "../../../Admin/Assets/logo.png";

export default function Layout({ activeSection, setActiveSection, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { id: "classvote", label: "Class Vote", icon: <Users size={20} /> },
    { id: "collegevote", label: "College Vote", icon: <Crown size={20} /> },
    { id: "candidates", label: "Candidates", icon: <ClipboardList size={20} /> },
    { id: "results", label: "Results", icon: <Trophy size={20} /> },
    { id: "profile", label: "Profile", icon: <UserCircle2 size={20} /> },
  ];

  const handleLogout = () => {
    // 🔥 Clear ONLY student auth (safe & explicit)
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("student");
    localStorage.removeItem("auth"); // if unified auth exists

    // Redirect to login
    navigate("/UserLogin", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 md:z-auto h-full flex flex-col justify-between
        transition-all duration-300 bg-[#111111] border-r border-[#00ff41]/20
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-20"}`}
      >
        {/* Logo */}
        <div>
          <div className="py-6 px-6 border-b border-[#00ff41]/10 text-center">
            <img
              src={VoteOnLogo}
              alt="VoteON"
              className={`mx-auto transition-all duration-300 ${sidebarOpen ? "w-32" : "w-10"
                }`}
              style={{ filter: "drop-shadow(0 0 15px rgba(0,255,65,0.6))" }}
            />
            {sidebarOpen && (
              <>
                <h2 className="text-2xl font-bold text-[#00ff41] mt-3">VOTE ON</h2>
                <div className="h-px w-16 mx-auto mt-2 bg-[#00ff41]/60" />
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="mt-3 px-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${activeSection === item.id
                    ? "bg-[#00ff41] text-black"
                    : "text-[#00ff41]/70 hover:bg-[#00ff41]/10 hover:text-[#00ff41]"
                  }`}
              >
                {item.icon}
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-[#00ff41]/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
            bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30
            hover:bg-[#00ff41]/20 transition"
          >
            <LogOut size={18} />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="px-4 py-3 flex items-center justify-between bg-[#111111] border-b border-[#00ff41]/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded bg-[#00ff41]/10"
            >
              <Menu size={20} className="text-[#00ff41]" />
            </button>
            <h1 className="text-lg font-semibold capitalize text-[#00ff41]">
              {activeSection}
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Welcome, {(() => {
              try {
                const s = JSON.parse(localStorage.getItem("student") || "{}");
                return s.name || "Student";
              } catch (e) {
                return "Student";
              }
            })()} 👋
          </p>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 bg-[#0a0a0a]">{children}</div>
      </main>
    </div>
  );
}
