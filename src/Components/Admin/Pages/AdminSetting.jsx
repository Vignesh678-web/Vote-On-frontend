import React from "react";
import { useNavigate } from "react-router-dom";

export const AdminSettings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔥 Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("admin");
    localStorage.removeItem("auth"); // if you followed the unified auth structure




    // 🔁 Redirect to login
    navigate("/UserLogin", { replace: true });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-400">Settings</h2>

      <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-green-400 mb-4">
          Admin Configuration
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              className="w-full bg-gray-800 border border-green-500/50 rounded px-3 py-2 text-gray-100"
              placeholder="admin@voteon.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              System Timezone
            </label>
            <select className="w-full bg-gray-800 border border-green-500/50 rounded px-3 py-2 text-gray-100">
              <option>IST (India)</option>
              <option>UTC</option>
              <option>EST (US East)</option>
              <option>PST (US West)</option>
            </select>
          </div>

          <button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-4 rounded">
            Save Settings
          </button>

          {/* 🔴 LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
