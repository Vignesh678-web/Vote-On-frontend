import React, { useState } from "react";
import { CheckCircle, Vote, User, Clock } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function Voting() {
  const [searchParams] = useSearchParams();
  const electionId = searchParams.get('id');
  const electionTitle = searchParams.get('title') || "Election";
  
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Different candidates for different elections
  const electionCandidates = {
    "1": [ // Class Representative Election
      { 
        id: 1, 
        name: "Aisha Rahman", 
        position: "Class Representative", 
        votes: 34,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
      },
      { 
        id: 2, 
        name: "John Doe", 
        position: "Class Representative", 
        votes: 28,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
      },
      { 
        id: 3, 
        name: "Sneha Patel", 
        position: "Class Representative", 
        votes: 42,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
      },
    ],
    "2": [ // Sports Captain Election
      { 
        id: 4, 
        name: "Marcus Johnson", 
        position: "Sports Captain", 
        votes: 56,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
      },
      { 
        id: 5, 
        name: "Emily Chen", 
        position: "Sports Captain", 
        votes: 48,
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop"
      },
      { 
        id: 6, 
        name: "Raj Kumar", 
        position: "Sports Captain", 
        votes: 39,
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
      },
    ],
  };

  const candidates = electionCandidates[electionId] || electionCandidates["1"];

  const handleVote = (candidateId) => {
    setSelectedCandidate(candidateId);
    setHasVoted(true);
  };

  return (
    <div
      className="min-h-screen p-6 lg:p-10"
      style={{
        background: "linear-gradient(to bottom, #000000, #0a0f0a)",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div
          className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 lg:p-10 border border-green-500/30"
          style={{
            boxShadow: "0 0 40px rgba(34, 197, 94, 0.2)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-5 mb-8">
            <div
              className="p-4 bg-green-500/20 rounded-2xl border border-green-500/40 shadow-lg"
              style={{ boxShadow: "0 0 25px rgba(34, 197, 94, 0.3)" }}
            >
              <Vote
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
                Voting Page
              </h2>
              <p className="text-green-400 font-medium text-base">
                Cast your vote for your preferred candidate
              </p>
            </div>
          </div>

          {/* Election Info */}
          <div
            className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-green-500/30 mb-10 shadow-xl"
            style={{ boxShadow: "0 0 25px rgba(34, 197, 94, 0.15)" }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {electionTitle}
                </h3>
                <p className="text-base text-green-400 font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Voting closes in 2 hours
                </p>
              </div>
              <div className="flex items-center text-gray-300 gap-3 text-base bg-gray-900/50 px-6 py-3 rounded-xl border border-green-500/20">
                <Clock className="w-5 h-5 text-green-400" />
                <span className="font-semibold">08:00 AM – 08:00 PM</span>
              </div>
            </div>
          </div>

          {/* Candidates List */}
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mb-8">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 shadow-xl ${
                  selectedCandidate === candidate.id
                    ? "border-green-500/60 bg-green-500/10 scale-105"
                    : "border-green-500/30 bg-gray-800/80 hover:border-green-500/50 hover:scale-[1.02]"
                }`}
                style={{
                  boxShadow:
                    selectedCandidate === candidate.id
                      ? "0 0 30px rgba(34, 197, 94, 0.4)"
                      : "0 0 20px rgba(34, 197, 94, 0.15)",
                }}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div
                    className="w-24 h-24 flex items-center justify-center rounded-full overflow-hidden border-4 border-green-500/50 mb-5 shadow-2xl bg-gray-950"
                    style={{
                      boxShadow: "0 0 25px rgba(34, 197, 94, 0.4)",
                    }}
                  >
                    <img 
                      src={candidate.image} 
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    {candidate.position}
                  </p>

                  <div className="mt-auto w-full">
                    {hasVoted ? (
                      <button
                        disabled
                        className={`w-full py-4 rounded-xl font-bold border-2 flex items-center justify-center gap-3 transition-all text-base ${
                          selectedCandidate === candidate.id
                            ? "bg-green-600 text-black border-green-400/60 shadow-2xl"
                            : "bg-gray-700/50 text-gray-500 border-gray-600/50 cursor-not-allowed"
                        }`}
                        style={{
                          boxShadow:
                            selectedCandidate === candidate.id
                              ? "0 0 25px rgba(34, 197, 94, 0.5)"
                              : "none",
                        }}
                      >
                        {selectedCandidate === candidate.id ? (
                          <>
                            <CheckCircle className="w-6 h-6 stroke-[2.5]" />
                            <span className="tracking-wide">Voted</span>
                          </>
                        ) : (
                          <span className="tracking-wide">Not Selected</span>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVote(candidate.id)}
                        className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black border-2 border-green-400/60 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-2xl text-base"
                        style={{
                          boxShadow: "0 0 25px rgba(34, 197, 94, 0.5)",
                        }}
                      >
                        <Vote className="w-6 h-6 stroke-[2.5]" />
                        <span className="tracking-wide">Vote</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Confirmation Message */}
          {hasVoted && (
            <div
              className="mt-10 text-center p-10 rounded-2xl bg-gray-800/80 backdrop-blur-sm border-2 border-green-500/40 shadow-2xl"
              style={{
                boxShadow: "0 0 40px rgba(34, 197, 94, 0.3)",
              }}
            >
              <CheckCircle
                className="w-16 h-16 text-green-400 mx-auto mb-5 stroke-[2]"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.6))",
                }}
              />
              <h3 className="text-3xl font-bold text-white mb-3">
                Your vote has been recorded!
              </h3>
              <p className="text-gray-400 text-lg">
                Thank you for participating in this election.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}