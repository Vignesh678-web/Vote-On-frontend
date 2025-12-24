import React, { useState } from "react";
import { Crown } from "lucide-react";

export default function ParliamentVote({ positions }) {
  const [votes, setVotes] = useState({});
  const [done, setDone] = useState(false);

  const handleVote = (positionId, candidateId) => {
    setVotes((prev) => ({ ...prev, [positionId]: candidateId }));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        College-Level Parliament Election
      </h1>

      {done ? (
        <div className="bg-green-600/20 border border-green-500 p-6 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-green-400">
            Your Votes Are Saved!
          </h2>
          <p className="text-gray-300">College election completed.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {positions.map((pos) => (
            <div
              key={pos.id}
              className="bg-gray-900 p-6 rounded-xl border border-gray-700"
            >
              <h2 className="text-xl font-bold text-white mb-4">
                {pos.title}
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {pos.candidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleVote(pos.id, c.id)}
                    className={`p-4 flex items-center gap-4 rounded-xl border transition-all ${
                      votes[pos.id] === c.id
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-600 hover:border-green-400"
                    }`}
                  >
                    <Crown
                      size={24}
                      className="text-yellow-400 shrink-0"
                    />

                    <div>
                      <h3 className="text-white font-semibold">{c.name}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => setDone(true)}
            className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl"
          >
            Submit All Votes
          </button>
        </div>
      )}
    </div>
  );
}
