"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, PlayCircle, CheckCircle, Clock } from "lucide-react";

export default function Elections() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ongoing");

  const ongoingElections = [
    { id: 1, title: "Class Representative Election", endDate: "Nov 10, 2025" },
    { id: 2, title: "Sports Captain Election", endDate: "Nov 12, 2025" },
  ];

  const completedElections = [
    { id: 3, title: "Cultural Secretary Election", winner: "John Doe" },
    { id: 4, title: "Treasurer Election", winner: "Aisha Rahman" },
  ];

  const handleVoteClick = (election) => {
    navigate(`/VotePage?id=${election.id}&title=${encodeURIComponent(election.title)}`);
  };

  const renderElections = () => {
    if (activeTab === "ongoing") {
      return ongoingElections.map((election) => (
        <div
          key={election.id}
          className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-green-500/30 hover:border-green-500/60 transition-all duration-300 mb-6"
          style={{ boxShadow: "0 0 30px rgba(34, 197, 94, 0.15)" }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3">
                {election.title}
              </h3>
              <div className="flex items-center gap-2 text-green-400">
                <Clock className="w-5 h-5" />
                <p className="text-base font-semibold">
                  Ends on {election.endDate}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleVoteClick(election)}
              className="w-full lg:w-auto bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 px-10 py-4 rounded-xl text-black font-bold text-lg flex items-center justify-center gap-3 border border-green-400/50 transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ boxShadow: "0 0 25px rgba(34, 197, 94, 0.4)" }}
            >
              <PlayCircle className="w-6 h-6" />
              Vote Now
            </button>
          </div>
        </div>
      ));
    }

    if (activeTab === "completed") {
      return completedElections.map((election) => (
        <div
          key={election.id}
          className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 mb-6"
          style={{ boxShadow: "0 0 30px rgba(168, 85, 247, 0.15)" }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3">
                {election.title}
              </h3>
              <div className="flex items-center gap-2 text-purple-400">
                <CheckCircle className="w-5 h-5" />
                <p className="text-base font-semibold">
                  Winner: {election.winner}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-8 py-4 bg-purple-500/20 rounded-xl border border-purple-500/40">
              <CheckCircle className="w-6 h-6 text-purple-400" />
              <span className="font-bold text-lg text-purple-400">Completed</span>
            </div>
          </div>
        </div>
      ));
    }

    return null;
  };

  return (
    <div
      className="min-h-screen p-6 lg:p-10"
      style={{
        background: "linear-gradient(to bottom, #000000, #0a0f0a)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 lg:p-10 border border-green-500/30 mb-8"
          style={{
            boxShadow: "0 0 40px rgba(34, 197, 94, 0.2)",
          }}
        >
          <div className="flex items-center gap-5 mb-8">
            <div
              className="p-4 bg-green-500/20 rounded-2xl border border-green-500/40"
              style={{ boxShadow: "0 0 25px rgba(34, 197, 94, 0.3)" }}
            >
              <CalendarDays
                className="w-8 h-8 text-green-400"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.6))",
                }}
              />
            </div>
            <div>
              <h2
                className="text-4xl font-bold text-white mb-2"
                style={{
                  textShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
                }}
              >
                Elections
              </h2>
              <p className="text-green-400 font-medium text-base">
                Participate and view your election status
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setActiveTab("ongoing")}
              className={`px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 border flex items-center justify-center gap-3 ${
                activeTab === "ongoing"
                  ? "bg-green-600 text-black border-green-400/50 shadow-lg shadow-green-500/40"
                  : "bg-gray-800 text-gray-400 border-green-500/20 hover:border-green-500/50 hover:text-green-400 hover:bg-gray-800/80"
              }`}
            >
              <Clock className="w-5 h-5" />
              <span>Ongoing Elections</span>
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={`px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 border flex items-center justify-center gap-3 ${
                activeTab === "completed"
                  ? "bg-purple-600 text-white border-purple-400/50 shadow-lg shadow-purple-500/40"
                  : "bg-gray-800 text-gray-400 border-purple-500/20 hover:border-purple-500/50 hover:text-purple-400 hover:bg-gray-800/80"
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Completed Elections</span>
            </button>
          </div>
        </div>

        {/* Elections List */}
        <div className="space-y-6">
          {renderElections()}
        </div>
      </div>
    </div>
  );
}