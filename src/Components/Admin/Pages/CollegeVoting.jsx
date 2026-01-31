import { useState, useEffect } from "react";
import { Trash2, Users, Trophy, Vote, Plus, Play, Edit3, CheckCircle2, Award } from "lucide-react";

const CollegeVoting = () => {
  const [electionName, setElectionName] = useState("");
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [electionCreated, setElectionCreated] = useState(false);
  const [electionStarted, setElectionStarted] = useState(false);

  // Candidates organized by position: { positionName: [{ name, votes }] }
  const [positionCandidates, setPositionCandidates] = useState({});
  const [candidateName, setCandidateName] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");

  // --- College-level candidates (promoted after class wins) ---
  const [collegeCandidates, setCollegeCandidates] = useState([]);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeError, setCollegeError] = useState(null);

  const fetchCollegeCandidates = async (opts = { includeUnapproved: false }) => {
    setCollegeLoading(true);
    setCollegeError(null);
    try {
      const res = await getCollegeCandidates(opts.includeUnapproved);
      setCollegeCandidates(res.candidates || []);
    } catch (err) {
      console.error('fetchCollegeCandidates error:', err);
      setCollegeError(err.message || 'Failed to load college candidates');
      setCollegeCandidates([]);
    } finally {
      setCollegeLoading(false);
    }
  };

  const promoteClassWinnersHandler = async () => {
    setCollegeLoading(true);
    try {
      const res = await promoteClassWinners();
      return res;
    } finally {
      setCollegeLoading(false);
    }
  };
  const handlePromoteWinners = async () => {
    try {
      setCollegeLoading(true);
      const res = await promoteClassWinners();
      alert(res.message);
      fetchCollegeCandidates();
    } catch (err) {
      alert(err.message);
    } finally {
      setCollegeLoading(false);
    }
  };

  useEffect(() => {
    // load promoted college candidates when the admin opens this page
    fetchCollegeCandidates();
  }, []);

  const availablePositions = {
    core: [
      { id: "president", name: "President", category: "Core" },
      { id: "vicePresident", name: "Vice President", category: "Core" },
      { id: "generalSecretary", name: "General Secretary", category: "Core" },
      { id: "treasurer", name: "Treasurer", category: "Core" },
    ],
    functional: [
      { id: "culturalSecretary", name: "Cultural Secretary", category: "Functional" },
      { id: "sportsSecretary", name: "Sports Secretary", category: "Functional" },
      { id: "technicalSecretary", name: "Technical Secretary", category: "Functional" },
      { id: "womensRep", name: "Women's Representative", category: "Functional" },
    ]
  };

  const togglePosition = (positionId) => {
    if (selectedPositions.includes(positionId)) {
      setSelectedPositions(selectedPositions.filter(p => p !== positionId));
    } else {
      setSelectedPositions([...selectedPositions, positionId]);
    }
  };

  const createElection = () => {
    if (!electionName.trim()) {
      alert("Please enter an election name!");
      return;
    }
    if (selectedPositions.length === 0) {
      alert("Please select at least one position!");
      return;
    }

    // Initialize candidates object for selected positions
    const initialCandidates = {};
    selectedPositions.forEach(posId => {
      initialCandidates[posId] = [];
    });
    setPositionCandidates(initialCandidates);
    setCurrentPosition(selectedPositions[0]);
    setElectionCreated(true);
  };

  const addCandidate = () => {
    if (!candidateName.trim() || !currentPosition || electionStarted) return;

    const currentCandidates = positionCandidates[currentPosition] || [];

    if (currentCandidates.some(c => c.name.toLowerCase() === candidateName.trim().toLowerCase())) {
      alert("This candidate already exists for this position!");
      return;
    }

    setPositionCandidates({
      ...positionCandidates,
      [currentPosition]: [...currentCandidates, { name: candidateName.trim(), votes: 0 }]
    });
    setCandidateName("");
  };

  const removeCandidate = (positionId, candidateIndex) => {
    if (electionStarted) return;

    setPositionCandidates({
      ...positionCandidates,
      [positionId]: positionCandidates[positionId].filter((_, i) => i !== candidateIndex)
    });
  };

  const canStartElection = () => {
    return selectedPositions.every(posId =>
      positionCandidates[posId] && positionCandidates[posId].length >= 2
    );
  };

  const startElection = () => {
    if (!canStartElection()) {
      alert("Each position must have at least 2 candidates to start the election!");
      return;
    }
    setElectionStarted(true);
  };

  const castVote = (positionId, candidateIndex) => {
    if (!electionStarted) return;

    const updatedCandidates = [...positionCandidates[positionId]];
    updatedCandidates[candidateIndex].votes += 1;

    setPositionCandidates({
      ...positionCandidates,
      [positionId]: updatedCandidates
    });
  };

  const resetElection = () => {
    setElectionName("");
    setSelectedPositions([]);
    setPositionCandidates({});
    setElectionCreated(false);
    setElectionStarted(false);
    setCandidateName("");
    setCurrentPosition("");
  };

  const getPositionName = (positionId) => {
    const allPositions = [...availablePositions.core, ...availablePositions.functional];
    const position = allPositions.find(p => p.id === positionId);
    return position ? position.name : positionId;
  };

  const getTotalVotes = (positionId) => {
    return positionCandidates[positionId]?.reduce((sum, c) => sum + c.votes, 0) || 0;
  };

  const getSortedCandidates = (positionId) => {
    return [...(positionCandidates[positionId] || [])].sort((a, b) => b.votes - a.votes);
  };

  // Step 1: Create Election
  if (!electionCreated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Trophy className="h-12 w-12 text-emerald-400" />
              <h1 className="text-4xl font-bold text-white">College Election System</h1>
            </div>
            <p className="text-slate-400">Create a new election to get started</p>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-8 shadow-2xl backdrop-blur-sm border border-slate-700/50">
            <div className="mb-6 flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-emerald-400" />
              <h2 className="text-2xl font-semibold text-white">Create New Election</h2>
            </div>

            <div className="space-y-6">
              {/* Election Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Election Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Student Council Elections 2024"
                  value={electionName}
                  onChange={(e) => setElectionName(e.target.value)}
                  className="w-full rounded-lg border border-emerald-500/30 bg-slate-900/50 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>

              {/* Core Positions */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Core Positions (Select all that apply)
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {availablePositions.core.map((position) => (
                    <button
                      key={position.id}
                      onClick={() => togglePosition(position.id)}
                      className={`flex items-center justify-between rounded-lg border-2 p-4 transition-all ${selectedPositions.includes(position.id)
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                        }`}
                    >
                      <span className="font-medium text-white">{position.name}</span>
                      {selectedPositions.includes(position.id) && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Functional Positions */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Functional Positions (Select 4-6)
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {availablePositions.functional.map((position) => (
                    <button
                      key={position.id}
                      onClick={() => togglePosition(position.id)}
                      className={`flex items-center justify-between rounded-lg border-2 p-4 transition-all ${selectedPositions.includes(position.id)
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                        }`}
                    >
                      <span className="font-medium text-white">{position.name}</span>
                      {selectedPositions.includes(position.id) && (
                        <CheckCircle2 className="h-5 w-5 text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Count */}
              <div className="rounded-lg bg-slate-900/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Positions Selected:</span>
                  <span className="text-lg font-bold text-white">{selectedPositions.length}</span>
                </div>
              </div>

              <button
                onClick={createElection}
                disabled={!electionName.trim() || selectedPositions.length === 0}
                className="w-full rounded-lg bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4 text-lg font-semibold text-white transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
              >
                <Plus className="mr-2 inline-block h-5 w-5" />
                Create Election
              </button>
            </div>

            <div className="mt-6 rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
              <p className="text-sm text-blue-300">
                💡 <strong>Tip:</strong> After creating the election, you'll add candidates for each selected position before starting the voting process.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2 & 3: Add Candidates and Voting
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Trophy className="h-10 w-10 text-emerald-400" />
            <h1 className="text-4xl font-bold text-white">{electionName}</h1>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {selectedPositions.map(posId => (
              <span key={posId} className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                {getPositionName(posId)}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-slate-800/50 p-6 shadow-2xl backdrop-blur-sm border border-slate-700/50">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">
                  {electionStarted ? "Voting" : "Add Candidates"}
                </h2>
              </div>

              {!electionStarted && (
                <div className="space-y-4">
                  {/* Position Selector */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Select Position
                    </label>
                    <select
                      value={currentPosition}
                      onChange={(e) => setCurrentPosition(e.target.value)}
                      className="w-full rounded-lg border border-emerald-500/30 bg-slate-900/50 px-4 py-3 text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                    >
                      {selectedPositions.map(posId => (
                        <option key={posId} value={posId}>
                          {getPositionName(posId)} ({positionCandidates[posId]?.length || 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Candidate Input */}
                  <input
                    type="text"
                    placeholder="Enter candidate name..."
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCandidate()}
                    className="w-full rounded-lg border border-emerald-500/30 bg-slate-900/50 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  />

                  <button
                    onClick={addCandidate}
                    disabled={!candidateName.trim()}
                    className="w-full rounded-lg bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-3 font-semibold text-white transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
                  >
                    <Plus className="mr-2 inline-block h-4 w-4" />
                    Add Candidate
                  </button>
                </div>
              )}

              {electionStarted && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4">
                  <p className="text-sm text-emerald-300">
                    ✓ Election is now live! Cast your votes for each position below.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {!electionStarted && (
                  <button
                    onClick={startElection}
                    disabled={!canStartElection()}
                    className="w-full rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 px-4 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Play className="mr-2 inline-block h-4 w-4" />
                    Start Election
                  </button>
                )}

                <button
                  onClick={resetElection}
                  className="w-full rounded-lg bg-linear-to-r from-red-500 to-rose-500 px-4 py-3 font-semibold text-white transition-all hover:from-red-600 hover:to-rose-600 hover:shadow-lg hover:shadow-red-500/20"
                >
                  Reset Everything
                </button>
              </div>

              {/* Status */}
              <div className="mt-6 space-y-3">
                <div className="rounded-lg bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Status:</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${electionStarted
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-yellow-500/20 text-yellow-400"
                        }`}
                    >
                      {electionStarted ? "● Live" : "○ Preparing"}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Positions:</span>
                    <span className="text-lg font-bold text-white">{selectedPositions.length}</span>
                  </div>
                </div>
              </div>

              {/* Requirements Checklist */}
              {!electionStarted && (
                <div className="mt-6 rounded-lg bg-slate-900/50 p-4">
                  <p className="mb-2 text-xs font-semibold text-slate-400">REQUIREMENTS:</p>
                  <div className="space-y-2">
                    {selectedPositions.map(posId => {
                      const count = positionCandidates[posId]?.length || 0;
                      const isValid = count >= 2;
                      return (
                        <div key={posId} className="flex items-center justify-between text-xs">
                          <span className={isValid ? "text-emerald-400" : "text-slate-500"}>
                            {getPositionName(posId)}
                          </span>
                          <span className={isValid ? "text-emerald-400" : "text-red-400"}>
                            {count}/2 min
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Positions and Candidates */}
          <div className="lg:col-span-3">
            <div className="space-y-6">

              {/* Promoted college-level candidates (from class wins) */}
              <div className="rounded-xl bg-slate-800/50 p-6 shadow-2xl backdrop-blur-sm border border-slate-700/50">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-emerald-400" />
                    <h2 className="text-lg font-semibold text-white">Promoted College Candidates</h2>
                    <span className="ml-2 text-sm text-slate-400">(students marked `isCollegeCandidate`)</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePromoteWinners}
                      disabled={collegeLoading}
                      className="rounded-md bg-emerald-500/20 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50 border border-emerald-500/30"
                    >
                      Promote Winners
                    </button>
                    <button
                      onClick={() => fetchCollegeCandidates()}
                      disabled={collegeLoading}
                      className="rounded-md bg-slate-900/40 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900/60 disabled:opacity-50"
                    >
                      {collegeLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                </div>

                {collegeError && (
                  <div className="mb-3 rounded-md bg-rose-900/20 p-3 text-sm text-rose-300">{collegeError}</div>
                )}

                {!collegeLoading && collegeCandidates.length === 0 && (
                  <div className="text-sm text-slate-400">No promoted college candidates yet.</div>
                )}

                <div className="grid gap-3 sm:grid-cols-2 mt-4">
                  {collegeCandidates.map(c => (
                    <div key={c._id} className="flex items-center gap-3 rounded-lg bg-slate-900/40 p-3">
                      <img
                        src={c.photoUrl || '/images/default-avatar.png'}
                        alt={c.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="truncate text-sm font-semibold text-white">{c.name}</div>
                            <div className="truncate text-xs text-slate-400">{c.admissionNumber} • {c.className || 'College'} {c.section || ''}</div>
                          </div>
                          <div className="text-right text-xs text-slate-400">{c.position || '—'}</div>
                        </div>

                        {c.manifestoPoints && c.manifestoPoints.length > 0 && (
                          <div className="mt-2 truncate text-xs text-slate-300">{c.manifestoPoints[0]}</div>
                        )}

                        <div className="mt-2 flex items-center gap-3">
                          <div className="text-xs text-slate-400">Votes: <span className="text-sm font-semibold text-white">{c.votesCount || 0}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPositions.map(posId => {
                const candidates = getSortedCandidates(posId);
                const totalVotes = getTotalVotes(posId);

                return (
                  <div
                    key={posId}
                    className="rounded-xl bg-slate-800/50 p-6 shadow-2xl backdrop-blur-sm border border-slate-700/50"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-emerald-400" />
                        <h2 className="text-xl font-semibold text-white">
                          {getPositionName(posId)}
                        </h2>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">
                          {candidates.length} candidates
                        </span>
                        {electionStarted && (
                          <span className="text-sm text-slate-400">
                            {totalVotes} votes
                          </span>
                        )}
                      </div>
                    </div>

                    {candidates.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Users className="mb-2 h-12 w-12 text-slate-600" />
                        <p className="text-sm text-slate-500">No candidates added yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {candidates.map((candidate, index) => {
                          const originalIndex = positionCandidates[posId].findIndex(c => c.name === candidate.name);
                          const votePercentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
                          const isLeading = index === 0 && electionStarted && totalVotes > 0;

                          return (
                            <div
                              key={originalIndex}
                              className={`group relative overflow-hidden rounded-lg bg-slate-900/50 p-4 transition-all hover:bg-slate-900/70 ${isLeading ? "ring-2 ring-yellow-500/50" : ""
                                }`}
                            >
                              {/* Vote percentage background */}
                              {electionStarted && (
                                <div
                                  className="absolute inset-0 bg-linear-to-r from-emerald-500/10 to-transparent transition-all duration-500"
                                  style={{ width: `${votePercentage}%` }}
                                />
                              )}

                              <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${isLeading
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-emerald-500/20 text-emerald-400"
                                      }`}
                                  >
                                    {isLeading ? "👑" : index + 1}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-white">{candidate.name}</p>
                                    {electionStarted && (
                                      <p className="text-sm text-slate-400">
                                        {candidate.votes} votes ({votePercentage.toFixed(1)}%)
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {electionStarted ? (
                                    <button
                                      onClick={() => castVote(posId, originalIndex)}
                                      className="rounded-lg bg-emerald-500 px-6 py-2 font-semibold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20"
                                    >
                                      <Vote className="mr-2 inline-block h-4 w-4" />
                                      Vote
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => removeCandidate(posId, originalIndex)}
                                      className="rounded-lg bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeVoting;