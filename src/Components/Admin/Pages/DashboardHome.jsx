import React from 'react';
import { Users, BarChart3, FileText } from 'lucide-react';

export const DashboardHome = ({ teachers, elections, results }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-green-400">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Faculty</p>
            <p className="text-3xl font-bold text-green-400">{teachers.length}</p>
          </div>
          <Users className="w-12 h-12 text-green-400/30" />
        </div>
      </div>
      <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Active Elections</p>
            <p className="text-3xl font-bold text-green-400">
              {elections.filter(e => e.status === 'Active').length}
            </p>
          </div>
          <BarChart3 className="w-12 h-12 text-green-400/30" />
        </div>
      </div>
      <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Completed Elections</p>
            <p className="text-3xl font-bold text-green-400">{results.length}</p>
          </div>
          <FileText className="w-12 h-12 text-green-400/30" />
        </div>
      </div>
    </div>
    
    <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-xl">
      <h3 className="text-xl font-semibold text-green-400 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-300">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <p className="text-sm">System initialized and ready</p>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <p className="text-sm">{teachers.length} faculty members registered</p>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <p className="text-sm">{elections.length} elections in the system</p>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardHome;