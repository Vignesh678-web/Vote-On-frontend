import React, { useState } from "react";
import { Home, Users, BarChart3, FileText, Settings, X, Menu, Award, Badge } from "lucide-react";
import Logo from "./Logo";

export const AdminLayout = ({ activeSection, setActiveSection, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'faculty', label: 'Faculty Management', icon: Users },
    { id: 'elections', label: 'Monitor Elections', icon: BarChart3 },
    { id: 'results', label: 'Results', icon: FileText },
    // 🔹 NEW SECTION
    { id: 'candidateApproval', label: 'Candidate Approval', icon: Award },
    { id: 'candidateParticipationTracker', label: 'Candidate Tracker', icon: Badge },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 border-r border-green-500/30 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-green-500/30">
          {isSidebarOpen ? <Logo /> : (
            <div className="flex justify-center">
              <Award className="w-8 h-8 text-green-400" />
            </div>
          )}
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                  activeSection === item.id
                    ? 'bg-green-500 text-black font-semibold'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-green-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-green-500/30">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-green-400 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            {isSidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
