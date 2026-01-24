import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, User, Award, BookOpen, AlertCircle } from "lucide-react";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/candidates/approved", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(res.data.candidates || []);
    } catch (err) {
      console.error("Fetch candidates error:", err);
      setError("Failed to load candidates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 text-[#00ff41] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#00ff41]"
          style={{ textShadow: "0 0 20px rgba(0,255,65,0.5)" }}
        >
          Approved Candidates
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mt-2">
          Review the profiles of students running for institutional positions.
        </p>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-500/30 p-6 rounded-xl flex items-center gap-4 mb-8">
          <AlertCircle className="text-red-500 w-8 h-8" />
          <p className="text-red-400 font-semibold">{error}</p>
        </div>
      )}

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {candidates.length === 0 && !error && (
          <div className="col-span-full py-20 text-center text-gray-500 text-xl font-medium">
            No approved candidates found yet.
          </div>
        )}
        {candidates.map((candidate) => (
          <div
            key={candidate._id}
            className="bg-[#111111] border border-[#00ff41]/20 rounded-xl p-4 sm:p-6 cursor-pointer transition-all hover:scale-105 hover:border-[#00ff41]/60 hover:shadow-[0_0_20px_rgba(0,255,65,0.2)]"
            onClick={() => setSelectedCandidate(candidate)}
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={candidate.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=00ff41&color=000`}
                alt={candidate.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-3 sm:mb-4 border-4 border-[#00ff41]"
                style={{ boxShadow: "0 0 15px rgba(0,255,65,0.4)" }}
              />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                {candidate.name}
              </h3>
              <p className="text-[#00ff41] font-semibold text-xs sm:text-sm">
                {candidate.position}
              </p>
              <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">
                {candidate.className || 'College Level'}
              </p>
              <button
                className="mt-3 sm:mt-4 px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg bg-[#00ff41] hover:bg-[#00ff41]/80 text-black font-bold transition-all"
                style={{ boxShadow: "0 0 15px rgba(0,255,65,0.3)" }}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="bg-[#111111] rounded-xl p-4 sm:p-6 lg:p-8 w-full max-w-lg sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto relative border border-[#00ff41]/40"
            style={{ boxShadow: "0 0 40px rgba(0,255,65,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#00ff41] hover:text-[#00ff41]/70 text-xl sm:text-2xl font-bold transition-colors"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center mt-4 sm:mt-0">
              <img
                src={selectedCandidate.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCandidate.name || 'C')}`}
                alt={selectedCandidate.name}
                className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover mb-4 border-4 border-[#00ff41]"
                style={{ boxShadow: "0 0 25px rgba(0,255,65,0.5)" }}
              />
              <h3
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2"
                style={{ textShadow: "0 0 15px rgba(0,255,65,0.3)" }}
              >
                {selectedCandidate.name}
              </h3>
              <p className="text-[#00ff41] font-semibold text-sm sm:text-base mb-1">
                {selectedCandidate.position}
              </p>
              <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                {selectedCandidate.className} • Attendance: {selectedCandidate.attendence}%
              </p>

              <div className="bg-[#0a0a0a] rounded-lg p-4 sm:p-6 border border-[#00ff41]/20 w-full mb-6">
                <h4 className="text-[#00ff41] font-semibold text-base sm:text-lg mb-3 flex items-center justify-center gap-2">
                  <User size={18} />
                  Candidate Bio
                </h4>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  {selectedCandidate.candidateBio || "No biography provided by the candidate."}
                </p>
              </div>

              <div className="bg-[#0a0a0a] rounded-lg p-4 sm:p-6 border border-[#00ff41]/20 w-full">
                <h4 className="text-[#00ff41] font-semibold text-base sm:text-lg mb-3 flex items-center justify-center gap-2">
                  <Award size={18} />
                  Manifesto Points
                </h4>
                <div className="text-left space-y-2">
                  {selectedCandidate.manifestoPoints && selectedCandidate.manifestoPoints.length > 0 ? (
                    selectedCandidate.manifestoPoints.map((point, i) => (
                      <div key={i} className="flex gap-3 text-gray-300 text-sm sm:text-base">
                        <span className="text-[#00ff41] font-bold">{i + 1}.</span>
                        <p>{point}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center italic">No manifesto points shared yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}