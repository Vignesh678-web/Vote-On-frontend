"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, PlayCircle, CheckCircle, Clock, AlertCircle, Loader2, Users, Crown, Trophy } from "lucide-react";

import { getStudentElections, getAllElections } from "../../../../services/electionApi"; 

export default function Elections({ initialType = null, initialTab = "ongoing" }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [ongoingElections, setOngoingElections] = useState([]);
  const [completedElections, setCompletedElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch elections from API
  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verify token exists
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in again.');
          console.error('[Elections] No auth token found');
          setLoading(false);
          return;
        }

        console.log('[Elections] Fetching student elections with type filter:', initialType);

        // Fetch student-specific elections (Active, Scheduled, and Completed)
        const response = await getStudentElections();
        console.log('[Elections] API Response:', response);
        
        let allRelevantElections = response.elections || [];
        console.log('[Elections] Total elections received:', allRelevantElections.length);

        // Split into ongoing and completed
        let ongoing = allRelevantElections.filter(e => e.status === 'Active' || e.status === 'Scheduled');
        let completed = allRelevantElections.filter(e => e.status === 'Completed');

        // Apply type filter if passed (e.g. from sidebar navigation)
        if (initialType) {
          ongoing = ongoing.filter(e => e.type === initialType);
          completed = completed.filter(e => e.type === initialType);
          console.log(`[Elections] Filtered for type "${initialType}": ${ongoing.length} ongoing, ${completed.length} completed`);
        }

        setOngoingElections(ongoing);
        setCompletedElections(completed);
      } catch (err) {
        console.error('[Elections] Error fetching elections:', err);
        console.error('[Elections] Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          setError('Session expired. Please log in again.');
        } else if (err.message?.includes('403') || err.message?.includes('Forbidden')) {
          setError('Access denied. You do not have permission to view elections.');
        } else {
          setError('Failed to load elections. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, [initialType]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleVoteClick = (election) => {
    navigate(`/VotePage?id=${election._id}&title=${encodeURIComponent(election.title)}`);
  };

  const renderElectionsList = () => {
    const list = activeTab === "ongoing" ? ongoingElections : completedElections;

    if (list.length === 0) {
      return (
        <div className="bg-gray-800/30 rounded-2xl p-16 text-center border border-white/5 backdrop-blur-sm">
          {activeTab === "ongoing" ? (
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
          ) : (
            <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
          )}
          <p className="text-gray-500 text-lg font-medium">No {activeTab} {initialType || ''} elections found.</p>
        </div>
      );
    }

    return list.map((election) => (
      <div
        key={election._id}
        className={`bg-gray-900/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border transition-all duration-300 mb-6 group ${activeTab === 'ongoing' ? 'border-green-500/20 hover:border-green-500/50' : 'border-purple-500/20 hover:border-purple-500/50'
          }`}
        style={{ boxShadow: activeTab === 'ongoing' ? "0 10px 30px -10px rgba(34, 197, 94, 0.1)" : "0 10px 30px -10px rgba(168, 85, 247, 0.1)" }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <h3 className="text-2xl font-bold text-white group-hover:text-[#00ff41] transition-colors">
                {election.title}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest ${election.type === 'class' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {election.type}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest ${election.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                election.status === 'Completed' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-400'
                }`}>
                {election.status}
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <span className="text-[#00ff41]/60 font-bold uppercase text-[10px]">Position:</span>
                <span className="text-white font-medium">{election.position}</span>
              </p>

              {activeTab === 'completed' && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Final Outcome</span>
                    <span className="text-[10px] font-mono text-gray-500">{election.totalVotes || 0} Votes Cast</span>
                  </div>
                  {(() => {
                    // Try to find the winner from populated candidates
                    const sorted = [...(election.candidates || [])].sort((a, b) => (b.votesCount || 0) - (a.votesCount || 0));
                    const winner = sorted[0];
                    if (winner && (winner.votesCount > 0 || election.totalVotes > 0)) {
                      const name = winner.student?.name || winner.name || "Winner";
                      return (
                        <div className="flex items-center gap-3">
                          <Trophy className="text-yellow-500 w-5 h-5 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                          <span className="text-white font-bold tracking-tight">{name}</span>
                          <span className="text-yellow-500/60 text-[10px] font-black uppercase ml-auto">WINNER</span>
                        </div>
                      );
                    }
                    return <p className="text-gray-600 text-xs italic">No votes recorded for this poll.</p>;
                  })()}
                </div>
              )}

              {election.type === 'class' && activeTab === 'ongoing' && (
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="text-[#00ff41]/60 font-bold uppercase text-[10px]">Eligibility:</span>
                  <span className="text-gray-300">{election.className} - Section {election.section}</span>
                </p>
              )}
              <div className="flex items-center gap-2 text-[#00ff41]/80 text-xs font-mono mt-4">
                <Clock size={14} />
                <span>{election.status === 'Active' ? 'VOTING CLOSES' : 'ELECTION ENDED'}: {formatDate(election.status === 'Active' ? election.endDate : election.startDate)}</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            {election.status === 'Active' ? (
              <button
                onClick={() => handleVoteClick(election)}
                className="w-full lg:w-auto bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-xl font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                <PlayCircle size={18} />
                Cast Your Vote
              </button>
            ) : election.status === 'Completed' ? (
              <button
                onClick={() => navigate(`/VotePage?id=${election._id}&title=${encodeURIComponent(election.title)}&results=true`)}
                className="w-full lg:w-auto bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <CheckCircle size={18} />
                View Results
              </button>
            ) : (
              <div className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} />
                Upcoming
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-12 h-12 text-[#00ff41] animate-spin" />
        <p className="text-[#00ff41] font-mono text-sm tracking-[0.2em] uppercase">Syncing Ballot Cloud...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] p-2 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Modern Glass Header */}
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/5 mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff41]/5 blur-[100px] -z-10 rounded-full"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#00ff41]/20 to-transparent rounded-2xl flex items-center justify-center border border-[#00ff41]/30 shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                {initialType === 'college' ? <Crown className="text-[#00ff41] w-8 h-8 sm:w-10 sm:h-10" /> : <Users className="text-[#00ff41] w-8 h-8 sm:w-10 sm:h-10" />}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter mb-2">
                  {initialType ? initialType.toUpperCase() : 'ALL'} ELECTIONS
                </h1>
                <div className="flex items-center gap-2 text-[#00ff41] text-xs font-bold tracking-widest uppercase opacity-80">
                  <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"></div>
                  Live Polling System Active
                </div>
              </div>
            </div>

            {/* Tab Controller */}
            <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 self-start md:self-center backdrop-blur-md">
              <button
                onClick={() => setActiveTab("ongoing")}
                className={`px-6 py-2.5 rounded-xl font-black text-[10px] sm:text-xs tracking-widest transition-all uppercase ${activeTab === "ongoing"
                  ? "bg-[#00ff41] text-black shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                  : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                Live ({ongoingElections.length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-6 py-2.5 rounded-xl font-black text-[10px] sm:text-xs tracking-widest transition-all uppercase ${activeTab === "completed"
                  ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                Ended ({completedElections.length})
              </button>
            </div>
          </div>
        </div>

        {/* Global Error Handle */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center gap-4 mb-10">
            <AlertCircle className="text-red-500 shrink-0" />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Feed Grid */}
        <div className="px-2">
          {renderElectionsList()}
        </div>
      </div>
    </div>
  );
}

