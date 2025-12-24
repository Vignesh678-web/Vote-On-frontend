import React from "react";
import {
  Home,
  Users,
  ClipboardList,
  UserCircle2,
  LogOut,
  Menu,
  Crown,
} from "lucide-react";

import VoteOnLogo from "../../../Admin/Assets/logo.png";

export default function Layout({ activeSection, setActiveSection, children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { id: "classvote", label: "Class Vote", icon: <Users size={20} /> },
    { id: "College vote", label: "College Vote", icon: <Crown size={20} /> },
    { id: "candidates", label: "Candidates", icon: <ClipboardList size={20} /> },
    { id: "profile", label: "Profile", icon: <UserCircle2 size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${
          sidebarOpen ? "w-64" : "md:w-20 w-64"
        } fixed md:relative h-full z-50 md:z-auto flex flex-col justify-between transition-all duration-300 bg-[#111111] border-r border-[#00ff41]/20`}
      >
        {/* Logo Section */}
        <div>
          <div className="py-6 px-6 border-b border-[#00ff41]/10">
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <img
                  src={VoteOnLogo}
                  alt="VoteON"
                  className={`${sidebarOpen ? "w-32" : "md:w-10 w-32"} mx-auto transition-all duration-300`}
                  style={{
                    filter: "drop-shadow(0 0 15px rgba(0,255,65,0.6))"
                  }}
                />
              </div>
              {(sidebarOpen || window.innerWidth < 768) && (
                <div>
                  <h2 
                    className="text-2xl font-bold tracking-wider text-[#00ff41]"
                    style={{
                      textShadow: "0 0 20px rgba(0,255,65,0.5)"
                    }}
                  >
                    VOTE ON
                  </h2>
                  <div className="h-px w-16 mx-auto mt-2 bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-60"></div>
                </div>
              )}
              {!sidebarOpen && window.innerWidth >= 768 && (
                <p className="text-[#00ff41] text-xs font-bold">VO</p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-2 px-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-[#00ff41] text-black"
                    : "text-[#00ff41]/70 hover:bg-[#00ff41]/10 hover:text-[#00ff41]"
                }`}
                style={
                  activeSection === item.id
                    ? { boxShadow: "0 0 15px rgba(0,255,65,0.3)" }
                    : {}
                }
              >
                {item.icon}
                {(sidebarOpen || window.innerWidth < 768) && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#00ff41]/10">
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 font-medium hover:bg-[#00ff41]/20 transition-all duration-200"
          >
            <LogOut size={18} />
            {(sidebarOpen || window.innerWidth < 768) && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center bg-[#111111] border-b border-[#00ff41]/10 sticky top-0 z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md bg-[#00ff41]/10 hover:bg-[#00ff41]/20 transition-colors"
            >
              <Menu size={20} className="text-[#00ff41]" />
            </button>
            <h1 className="text-base sm:text-xl font-semibold capitalize text-[#00ff41]">
              {activeSection}
            </h1>
          </div>
          <div className="text-gray-400 text-xs sm:text-base">
            Welcome, Student 👋
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-6 md:p-10 flex-1 bg-[#0a0a0a]">
          {children}
        </div>
      </main>
    </div>
  );
}