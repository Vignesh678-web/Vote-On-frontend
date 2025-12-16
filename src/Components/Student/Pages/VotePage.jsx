import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Vote } from "lucide-react";

export default function VotePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const electionId = searchParams.get("id");
  const electionTitle = searchParams.get("title");

  const [candidates, setCandidates] = useState([]);
  const [votedCandidate, setVotedCandidate] = useState(null);

  // ✅ Dummy candidate data based on election
  useEffect(() => {
    if (electionTitle === "Class Representative Election") {
      setCandidates([
        { id: 1, name: "Aarav Mehta", img: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 2, name: "Neha Sharma", img: "https://randomuser.me/api/portraits/women/44.jpg" },
        { id: 3, name: "Rahul Verma", img: "https://randomuser.me/api/portraits/men/47.jpg" },
      ]);
    } else if (electionTitle === "Sports Captain Election") {
      setCandidates([
        { id: 4, name: "Karan Patel", img: "https://randomuser.me/api/portraits/men/52.jpg" },
        { id: 5, name: "Sneha Iyer", img: "https://randomuser.me/api/portraits/women/65.jpg" },
      ]);
    } else {
      setCandidates([]);
    }
  }, [electionTitle]);

  // ✅ Handle vote
  const handleVote = (candidate) => {
    setVotedCandidate(candidate);
    localStorage.setItem(`vote_${electionId}`, JSON.stringify(candidate)); // store vote
  };

  // ✅ Prevent revoting
  useEffect(() => {
    const savedVote = localStorage.getItem(`vote_${electionId}`);
    if (savedVote) {
      setVotedCandidate(JSON.parse(savedVote));
    }
  }, [electionId]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(to bottom, #000000, #0a0f0a)",
      }}
    >
      <div className="bg-gray-900 rounded-xl p-8 border border-green-500/30 shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          {electionTitle}
        </h1>

        {/* ✅ If already voted */}
        {votedCandidate ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-xl text-white font-semibold mb-2">
              Your vote has been cast successfully!
            </p>
            <p className="text-green-400 text-lg font-medium">
              You voted for: <span className="font-bold">{votedCandidate.name}</span>
            </p>
            <div className="mt-6">
              <img
                src={votedCandidate.img}
                alt={votedCandidate.name}
                className="w-32 h-32 rounded-full mx-auto border-4 border-green-400 shadow-lg"
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-center mb-6">
              Please select your preferred candidate below.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-gray-800 rounded-xl p-4 border border-green-500/20 hover:border-green-500/50 transition-all text-center"
                >
                  <img
                    src={candidate.img}
                    alt={candidate.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-green-400/40"
                  />
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {candidate.name}
                  </h3>
                  <button
                    onClick={() => handleVote(candidate)}
                    className="bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 mx-auto"
                  >
                    <Vote className="w-4 h-4" /> Vote
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Elections
          </button>
        </div>
      </div>
    </div>
  );
}
