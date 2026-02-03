import React, { useState, useEffect } from "react";
import { BarChart3, CheckCircle, Users, Loader2 } from "lucide-react";
import axios from "axios";

export default function DashboardHome() {
  const [stats, setStats] = useState([
    {
      icon: Users,
      title: "Active Elections",
      value: "0",
      subtitle: "Ongoing right now",
      color: "green",
    },
    {
      icon: CheckCircle,
      title: "Candidates",
      value: "0",
      subtitle: "Approved nominees",
      color: "purple",
    },
    {
      icon: Users,
      title: "Completed",
      value: "0",
      subtitle: "Finished elections",
      color: "green",
    },
  ]);
  const [electionsList, setElectionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("usertoken") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch ONLY student-relevant elections (Active, Scheduled, Completed)
      // and approved candidates
      const [electionsRes, candidatesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/elections/student/available", { headers }),
        axios.get("http://localhost:5000/api/candidates/approved", { headers })
      ]);

      const elections = electionsRes.data.elections || [];
      const candidates = candidatesRes.data.candidates || [];

      console.log(`[DashboardHome] Loaded ${elections.length} relevant elections and ${candidates.length} candidates`);

      const activeElections = elections.filter(e => e.status === 'Active').length;
      const completedElections = elections.filter(e => e.status === 'Completed').length;

      setElectionsList(elections);
      setStats([
        {
          icon: Users,
          title: "Active Elections",
          value: activeElections.toString(),
          subtitle: "Eligible ongoing polls",
          color: "green",
        },
        {
          icon: CheckCircle,
          title: "Approved Candidates",
          value: candidates.length.toString(),
          subtitle: "Vetted student nominees",
          color: "purple",
        },
        {
          icon: Users,
          title: "Completed Elections",
          value: completedElections.toString(),
          subtitle: "Finalized poll results",
          color: "green",
        },
      ]);
    } catch (err) {
      console.error("Dashboard stats fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex justify-center items-start py-12 px-4 sm:px-8 lg:px-16"
      style={{
        background: "linear-gradient(to bottom, #000000, #0a0f0a)",
      }}
    >
      <div
        className="w-full max-w-6xl bg-gray-900 rounded-2xl border border-green-500/30 p-6 sm:p-10"
        style={{
          boxShadow: "0 0 40px rgba(34, 197, 94, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div
              className="p-3 bg-green-500/20 rounded-xl border border-green-500/40"
              style={{ boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)" }}
            >
              <BarChart3
                className="w-8 h-8 text-green-400"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))",
                }}
              />
            </div>
            <div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white leading-tight"
                style={{
                  textShadow: "0 0 15px rgba(34, 197, 94, 0.3)",
                }}
              >
                Student Dashboard
              </h2>
              <p className="text-green-400 font-medium text-sm sm:text-base mt-1">
                Participate in the democratic process of your institution.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isGreen = stat.color === "green";
            const colorClasses = isGreen
              ? {
                border: "border-green-500/20",
                hoverBorder: "hover:border-green-500/50",
                text: "text-green-400",
                shadow: "rgba(34, 197, 94, 0.25)",
                iconShadow: "rgba(34, 197, 94, 0.5)",
              }
              : {
                border: "border-purple-500/20",
                hoverBorder: "hover:border-purple-500/50",
                text: "text-purple-400",
                shadow: "rgba(168, 85, 247, 0.25)",
                iconShadow: "rgba(168, 85, 247, 0.5)",
              };

            return (
              <div
                key={index}
                className={`bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl ${colorClasses.border} ${colorClasses.hoverBorder} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                style={{
                  boxShadow: `0 0 25px ${colorClasses.shadow}`,
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <Icon
                    className={`w-8 h-8 ${colorClasses.text}`}
                    style={{
                      filter: `drop-shadow(0 0 6px ${colorClasses.iconShadow})`,
                    }}
                  />
                  <h3 className="text-xl font-semibold text-white">
                    {stat.title}
                  </h3>
                </div>

                <p
                  className={`text-4xl font-extrabold ${colorClasses.text} mb-3`}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.subtitle}</p>
              </div>
            );
          })}
        </div>

        {/* Dynamic Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Live Elections List */}
          <div className="lg:col-span-2 bg-gray-800/10 backdrop-blur-md rounded-2xl border border-green-500/20 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="text-green-400" size={20} />
              Recent Available Polls
            </h3>
            
            <div className="space-y-4">
              {electionsList.length > 0 ? (
                electionsList.slice(0, 5).map((election, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-black/40 rounded-xl border border-white/5 hover:border-green-500/30 transition-all group">
                    <div>
                      <h4 className="text-white font-semibold group-hover:text-green-400 transition-colors">{election.electionName}</h4>
                      <p className="text-sm text-gray-500">{election.type === 'class' ? 'Class Election' : 'College Election'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${election.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                        {election.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl">
                   <Users className="mx-auto mb-3 opacity-20" size={48} />
                   <p>No elections currently listed for you.</p>
                </div>
              )}
            </div>
          </div>

          {/* Guidelines / Quick Info */}
          <div className="bg-gray-800/10 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="text-purple-400" size={20} />
              Voting Guidelines
            </h3>
            <ul className="space-y-5">
              {[
                "Navigate to 'Class Vote' or 'College Vote'.",
                "Explore nominated candidate profiles.",
                "Cast your vote with the 'Vote' button.",
                "Verify your vote if prompted.",
                "Track results in the 'Results' tab."
              ].map((step, i) => (
                <li key={i} className="flex gap-4 text-sm text-gray-400 leading-relaxed">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs ring-1 ring-purple-500/30">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
            
            <div className="mt-10 p-5 bg-purple-500/5 rounded-2xl border border-purple-500/20 text-xs text-purple-300 leading-relaxed">
              <p className="flex items-center gap-2 mb-2 font-bold text-purple-400">
                <Users size={14} /> SECURITY NOTICE
              </p>
              Your identity remains anonymous throughout the voting process. Ensure you have a stable connection before submitting.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

