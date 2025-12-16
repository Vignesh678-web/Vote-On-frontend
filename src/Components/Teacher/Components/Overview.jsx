// components/Overview.jsx
import React from "react";
import {
  Users,
  UserCheck,
  Award,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";
import StatsCard from "./StatsCard";
import ElectionStatusCard from "./ElectionStatusCard";
import QuickStatsGrid from "./QuickStatsGrid";

const Overview = ({ classInfo, students, candidates, election }) => {

  // SAFETY FALLBACKS
  const safeClassInfo = classInfo || {
    totalStudents: 0,
    className: "N/A",
    academicYear: "N/A",
  };

  const safeStudents = Array.isArray(students) ? students : [];
  const safeCandidates = Array.isArray(candidates) ? candidates : [];
  const safeElection = election || {
    totalVotes: 0,
    eligibleVoters: 1, // avoid division by zero
  };

  const eligibleStudents = safeStudents.filter((s) => s.eligible).length;
  const approvedCandidates = safeCandidates.filter((c) => c.status === "approved").length;
  const pendingCandidates = safeCandidates.filter((c) => c.status === "pending").length;

  const voterTurnout =
    Math.round((safeElection.totalVotes / safeElection.eligibleVoters) * 100) || 0;

  const stats = [
    {
      icon: Users,
      value: safeClassInfo.totalStudents,
      label: "Total Students",
      description: "Registered in class",
      trend: "+2 this month",
    },
    {
      icon: UserCheck,
      value: eligibleStudents,
      label: "Eligible Voters",
      description: "Meet attendance criteria",
      trend: `${Math.round(
        (eligibleStudents / (safeClassInfo.totalStudents || 1)) * 100
      )}% eligible`,
    },
    {
      icon: Award,
      value: approvedCandidates,
      label: "Active Candidates",
      description: "Approved nominations",
      trend: `${pendingCandidates} pending`,
    },
    {
      icon: TrendingUp,
      value: voterTurnout + "%",
      label: "Voter Turnout",
      description: "Current participation",
      trend: `${safeElection.totalVotes}/${safeElection.eligibleVoters} votes`,
    },
  ];

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Dashboard <span className="text-green-400">Overview</span>
            </h1>

            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span>{safeClassInfo.className}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span>Academic Year {safeClassInfo.academicYear}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 lg:mt-0">
            <div className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-400">Last updated</div>
              <div className="text-green-400 font-medium">Just now</div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ElectionStatusCard election={safeElection} classInfo={safeClassInfo} />
        </div>
        <div className="xl:col-span-1">
          <QuickStatsGrid candidates={safeCandidates} students={safeStudents} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
