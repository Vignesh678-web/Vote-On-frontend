import React from "react";

export const AdminSettings = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-green-400">Settings</h2>
    <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-green-400 mb-4">Admin Configuration</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Admin Email</label>
          <input
            type="email"
            className="w-full bg-gray-800 border border-green-500/50 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
            placeholder="admin@voteon.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">System Timezone</label>
          <select className="w-full bg-gray-800 border border-green-500/50 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400">
            <option>IST (India)</option>
            <option>UTC</option>
            <option>EST (US East)</option>
            <option>PST (US West)</option>
          </select>
        </div>
        
        <div className="pt-4">
          <button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-4 rounded transition-colors shadow-lg shadow-green-500/30">
            Save Settings
          </button>
        </div>
        
        <div className="pt-4">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded transition-colors shadow-lg shadow-red-500/30">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AdminSettings;