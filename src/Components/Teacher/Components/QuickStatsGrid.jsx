// components/QuickStatsGrid.jsx
import React from "react";
import { UserX, CheckCircle, Clock, AlertCircle } from "lucide-react";

const QuickStatsGrid = ({ candidates, students }) => {
  const stats = [
    {
      icon: UserX,
      label: "Ineligible Students",
      value: students.filter((s) => !s.eligible).length,
      color: "text-red-400 border-red-500/30 bg-red-500/10",
      description: "Low attendance",
    },
    {
      icon: CheckCircle,
      label: "Approved Candidates",
      value: candidates.filter((c) => c.status === "approved").length,
      color: "text-green-400 border-green-500/30 bg-green-500/10",
      description: "Ready for election",
    },
    {
      icon: Clock,
      label: "Pending Approval",
      value: candidates.filter((c) => c.status === "pending").length,
      color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
      description: "Under review",
    },
    {
      icon: AlertCircle,
      label: "Disqualified",
      value: candidates.filter((c) => c.status === "rejected").length,
      color: "text-red-400 border-red-500/30 bg-red-500/10",
      description: "Not eligible",
    },
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 h-full">
      <h3 className="text-2xl font-bold text-white mb-6">Quick Stats</h3>

      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-black/30 rounded-lg p-4 border border-gray-700 hover:border-green-500 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-lg border ${stat.color} bg-opacity-20`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color.split(" ")[0]}`} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {stat.label}
                  </p>
                  <p className="text-xs text-gray-400">{stat.description}</p>
                </div>
              </div>

              <span
                className={`text-2xl font-bold ${stat.color.split(" ")[0]} tabular-nums`}
              >
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Total Students</p>
            <p className="text-lg font-bold text-white">{students.length}</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Total Candidates</p>
            <p className="text-lg font-bold text-white">
              {candidates.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsGrid;
