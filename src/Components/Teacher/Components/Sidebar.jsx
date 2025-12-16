// Sidebar.jsx
import React from "react";
import {
  Users,
  UserCheck,
  Upload,
  Percent,
  Settings,
  Award,
  Home,
  ChevronRight,
  Vote,
} from "lucide-react";
import logo from "../Assets/logo.png";

const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  candidates,
}) => {

  const safeCandidates = candidates || [];

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, description: "Dashboard overview" },
    { id: "students", label: "My Class Students", icon: Users, description: "Manage student data" },
    { id: "attendance", label: "Manage Attendance", icon: Percent, description: "Track attendance" },
    { id: "candidates", label: "Candidates", icon: Award, description: "Election candidates",
      badge: safeCandidates.filter(c => c.status === "pending").length },
    { id: "upload", label: "Upload Data", icon: Upload, description: "Import student data" },
    { id: "results", label: "Election Results", icon: Vote, description: "View results" },
    { id: "settings", label: "Settings", icon: Settings, description: "Preferences" },
  ];

  return (
    <>
      <aside
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 
          fixed lg:static 
          w-80 h-screen 
          bg-black 
          border-r border-green-500/30 
          transition-all duration-300 
          z-20 flex flex-col
        `}
      >
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto pb-32">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-green-500/10 border border-green-500/50"
                    : "border border-transparent hover:border-green-500/30 hover:bg-green-500/5"
                }`}
              >
                <div className="flex items-center gap-4 px-4 py-4">
                  <div className={isActive ? "text-green-400 scale-110" : "text-gray-400"}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 text-left">
                    <p className={`font-semibold ${isActive ? "text-white" : "text-gray-300"}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>

                  {item.badge > 0 && (
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
