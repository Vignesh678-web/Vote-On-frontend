// components/Candidates.jsx
import React, { useState } from 'react';
import { UserCheck, Trash2, Percent, Award } from 'lucide-react';

const Candidates = ({ candidates = [], onRemoveCandidate }) => {

  // SAFETY: ensure always array
  const safeCandidates = Array.isArray(candidates) ? candidates : [];

  const [activeFilter, setActiveFilter] = useState("all");

  // FILTER
  const filteredCandidates = safeCandidates.filter(c => {
    if (activeFilter === "all") return true;
    return c.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-black p-6 space-y-6" style={{ background: 'linear-gradient(to bottom, #000000, #0a0f0a)' }}>
      
      {/* HEADER */}
      <div className="bg-gray-900 rounded-xl shadow-sm p-6 border border-green-500/30"
        style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.15)' }}>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/40"
              style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' }}>
              <UserCheck className="w-6 h-6 text-purple-400" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-1"
                style={{ textShadow: '0 0 15px rgba(168, 85, 247, 0.3)' }}>
                Class Representative Candidates
              </h3>
              <p className="text-sm text-purple-400 font-semibold">
                Nominated candidates for class elections
              </p>
            </div>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                activeFilter === 'all'
                  ? 'bg-green-600 text-black border-green-400/50'
                  : 'bg-gray-800 text-gray-400 border-green-500/20 hover:border-green-500/40 hover:text-green-400'
              }`}
            >
              All ({safeCandidates.length})
            </button>

            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                activeFilter === 'pending'
                  ? 'bg-orange-600 text-white border-orange-400/50'
                  : 'bg-gray-800 text-gray-400 border-green-500/20 hover:border-orange-500/40 hover:text-orange-400'
              }`}
            >
              Pending ({safeCandidates.filter(c => c.status === 'pending').length})
            </button>
          </div>

        </div>
      </div>

      {/* LIST */}
      {filteredCandidates.length === 0 ? (

        <div className="bg-gray-900 border border-green-500/30 rounded-xl p-12 text-center"
          style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.1)' }}>

          <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-gray-400 mb-2">No Candidates Yet</h4>
          <p className="text-gray-500">Nominate eligible students from the Students tab</p>

        </div>

      ) : (

        <div className="space-y-4">
          {filteredCandidates.map(candidate => (
            <div key={candidate.id} className="bg-gray-900 border border-green-500/30 hover:border-green-500/50 rounded-xl p-6 transition-all">

              <div className="flex flex-col lg:flex-row justify-between gap-4">
                
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg">{candidate.name}</h4>
                  <p className="text-sm text-gray-400">{candidate.position}</p>

                  <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/40 rounded-lg">
                    <Percent className="w-4 h-4 text-green-400" />
                    <span className="font-bold text-sm text-green-400">
                      {candidate.attendance}% Attendance
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => window.confirm(`Remove ${candidate.name}?`) && onRemoveCandidate(candidate.id)}
                  className="bg-red-600 hover:bg-red-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" /> Remove
                </button>

              </div>

              <div className="mt-4 p-4 bg-purple-500/10 rounded-xl flex items-start gap-3 border border-purple-500/40">
                <Award className="w-5 h-5 text-purple-400" />
                <p className="text-sm text-purple-300">
                  This candidate has been nominated with {candidate.attendance}% attendance.
                </p>
              </div>

            </div>
          ))}
        </div>

      )}

    </div>
  );
};

export default Candidates;
