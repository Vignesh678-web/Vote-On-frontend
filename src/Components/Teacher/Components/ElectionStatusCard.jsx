import React from "react";
import { Calendar, Users, Vote } from "lucide-react";

const ElectionStatusCard = ({ election = {} }) => {
  const {
    status = "unknown",
    startDate = "N/A",
    endDate = "N/A",
    eligibleVoters = 0,
    totalVotes = 0,
  } = election;

  const getStatusColor = (value) => {
    switch (value) {
      case "active":
        return "text-green-400 border-green-500/40 bg-green-500/10";
      case "upcoming":
        return "text-yellow-400 border-yellow-500/40 bg-yellow-500/10";
      case "completed":
        return "text-blue-400 border-blue-500/40 bg-blue-500/10";
      default:
        return "text-gray-400 border-gray-500/40 bg-gray-500/10";
    }
  };

  const progress =
    eligibleVoters > 0
      ? Math.round((totalVotes / eligibleVoters) * 100)
      : 0;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Election Status</h3>

        <div
          className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
            status
          )}`}
        >
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <InfoCard
          icon={<Calendar className="w-5 h-5 text-green-400 mb-2" />}
          label="Start Date"
          value={startDate}
        />
        <InfoCard
          icon={<Calendar className="w-5 h-5 text-green-400 mb-2" />}
          label="End Date"
          value={endDate}
        />
        <InfoCard
          icon={<Users className="w-5 h-5 text-green-400 mb-2" />}
          label="Eligible Voters"
          value={eligibleVoters}
        />
        <InfoCard
          icon={<Vote className="w-5 h-5 text-green-400 mb-2" />}
          label="Total Votes"
          value={totalVotes}
        />
      </div>

      {/* PROGRESS */}
      <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400 font-medium">Voting Progress</span>
          <span className="text-green-400 font-bold">{progress}%</span>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-green-500 h-3 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{totalVotes} votes cast</span>
          <span>{eligibleVoters - totalVotes} remaining</span>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-black/40 p-4 rounded-lg border border-gray-700 hover:border-green-500 transition-all">
    <div className="mb-2">{icon}</div>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-white font-semibold text-sm leading-tight">{value}</p>
  </div>
);

export default ElectionStatusCard;
