import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Vote, Loader2, AlertCircle, Trophy, User } from "lucide-react";

import { getElectionById, castVote, getElectionResults } from "../../../services/electionApi"; 

export default function VotePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const electionId = searchParams.get("id");
  const electionTitle = searchParams.get("title");
  const showResults = searchParams.get("results") === "true";

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState(null);
  const [votedCandidate, setVotedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Fetch election data from API
  useEffect(() => {
    const fetchElection = async () => {
      if (!electionId) {
        setError("No election ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (showResults) {
          // Fetch results for completed election
          const resultsData = await getElectionResults(electionId);
          setResults(resultsData);
          setElection(resultsData.election);
        } else {
          // Fetch election details
          const data = await getElectionById(electionId);
          setElection(data.election);

          // Extract candidates from election
          const electionCandidates = data.election.candidates?.map(c => ({
            id: c.student._id,
            name: c.student.name,
            img: c.student.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.student.name)}&background=22c55e&color=fff`,
            position: c.student.position || data.election.position,
            bio: c.student.candidateBio || '',
            manifesto: c.student.manifestoPoints || [],
            votes: c.votesCount
          })) || [];

          setCandidates(electionCandidates);

          // Check if user has already voted in this election
          const hasVotedInElection = data.election.voters?.some(
            v => v.student === localStorage.getItem('userId')
          );
          setHasVoted(hasVotedInElection);
        }
      } catch (err) {
        console.error('Error fetching election:', err);
        setError(err.message || 'Failed to load election data');
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, [electionId, showResults]);

  // Handle vote
  const handleVote = async (candidate) => {
    try {
      setVoting(true);
      setError(null);

      await castVote(electionId, candidate.id);

      setVotedCandidate(candidate);
      setHasVoted(true);
    } catch (err) {
      console.error('Error casting vote:', err);
      setError(err.message || 'Failed to cast vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: "linear-gradient(to bottom, #000000, #0a0f0a)" }}
      >
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <p className="text-gray-400 text-lg">Loading election...</p>
      </div>
    );
  }

  // Error state
  if (error && !candidates.length && !results) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: "linear-gradient(to bottom, #000000, #0a0f0a)" }}
      >
        <div className="bg-gray-900 rounded-xl p-8 border border-red-500/30 shadow-lg max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Results view
  if (showResults && results) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: "linear-gradient(to bottom, #000000, #0a0f0a)" }}
      >
        <div className="bg-gray-900 rounded-xl p-8 border border-purple-500/30 shadow-lg max-w-3xl w-full">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            {results.election?.title || electionTitle}
          </h1>
          <p className="text-purple-400 text-center mb-8">Election Results</p>

          {/* Winner banner */}
          {results.election?.winner && (
            <div className="bg-linear-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-xl p-6 mb-8 text-center">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Winner</p>
              <h2 className="text-2xl font-bold text-white">
                {results.election.winner.name}
              </h2>
            </div>
          )}

          {/* Results list */}
          <div className="space-y-4">
            {results.results?.map((result, index) => (
              <div
                key={result.candidate?._id || index}
                className={`p-4 rounded-xl border ${index === 0
                    ? 'bg-green-500/10 border-green-500/40'
                    : 'bg-gray-800 border-gray-700'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-600">
                    <img
                      src={result.candidate?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(result.candidate?.name || 'Unknown')}&background=22c55e&color=fff`}
                      alt={result.candidate?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      {result.candidate?.name || 'Unknown'}
                      {index === 0 && <Trophy className="w-4 h-4 text-yellow-400" />}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {result.votes} votes ({result.percentage}%)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${index === 0 ? 'text-green-400' : 'text-gray-400'}`}>
                      #{index + 1}
                    </span>
                  </div>
                </div>
                {/* Vote bar */}
                <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${index === 0 ? 'bg-green-500' : 'bg-gray-500'}`}
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-center mt-6">
            Total votes cast: {results.election?.totalVotes || 0}
          </p>

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

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(to bottom, #000000, #0a0f0a)",
      }}
    >
      <div className="bg-gray-900 rounded-xl p-8 border border-green-500/30 shadow-lg max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          {election?.title || electionTitle}
        </h1>
        <p className="text-green-400 text-center mb-6">
          Position: {election?.position || 'Not specified'}
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Already voted */}
        {(votedCandidate || hasVoted) ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-xl text-white font-semibold mb-2">
              Your vote has been cast successfully!
            </p>
            {votedCandidate && (
              <>
                <p className="text-green-400 text-lg font-medium">
                  You voted for: <span className="font-bold">{votedCandidate.name}</span>
                </p>
                <div className="mt-6">
                  <img
                    src={votedCandidate.img}
                    alt={votedCandidate.name}
                    className="w-32 h-32 rounded-full mx-auto border-4 border-green-400 shadow-lg object-cover"
                  />
                </div>
              </>
            )}
            {hasVoted && !votedCandidate && (
              <p className="text-gray-400">You have already voted in this election.</p>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-center mb-6">
              Please select your preferred candidate below.
            </p>

            {candidates.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No candidates available for this election</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="bg-gray-800 rounded-xl p-6 border border-green-500/20 hover:border-green-500/50 transition-all text-center"
                  >
                    <img
                      src={candidate.img}
                      alt={candidate.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-green-400/40 object-cover"
                    />
                    <h3 className="text-white text-lg font-semibold mb-1">
                      {candidate.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{candidate.position}</p>

                    {candidate.bio && (
                      <p className="text-gray-500 text-xs mb-4 line-clamp-2">
                        {candidate.bio}
                      </p>
                    )}

                    <button
                      onClick={() => handleVote(candidate)}
                      disabled={voting}
                      className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto w-full transition-colors"
                    >
                      {voting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Voting...
                        </>
                      ) : (
                        <>
                          <Vote className="w-5 h-5" />
                          Vote
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
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

