import React, { useState } from 'react';
import { Trophy, Award, Users, TrendingUp, Plus, Clock, CheckCircle } from 'lucide-react';

const Results = ({ election, candidates }) => {
  // Use passed candidates or fallback to election.candidates
  // We need to handle the structure variation between dashboards
  const rawCandidates = candidates || election?.candidates || [];

  const processedResults = rawCandidates.map(c => {
    // Determine votes count looking at different structures
    const votes = c.votesCount ?? c.votes ?? 0;

    // Normalize student data
    const studentInfo = c.student || c;
    const name = studentInfo.name || 'Unknown Candidate';
    const admission = studentInfo.admissionNumber || studentInfo.admission || 'N/A';
    const id = studentInfo._id || studentInfo.id;

    return {
      id,
      name,
      admission,
      votes,
      percentage: 0, // calculated below
      rank: 0,
      isWinner: false
    };
  }).sort((a, b) => b.votes - a.votes);

  const totalVotes = processedResults.reduce((sum, r) => sum + r.votes, 0);

  processedResults.forEach((r, index) => {
    r.rank = index + 1;
    r.percentage = totalVotes > 0 ? parseFloat((r.votes / totalVotes) * 100).toFixed(1) : 0;
    // Highlight first place as winner (or use election.winner ID if it exists and matches)
    r.isWinner = index === 0 && r.votes > 0;
  });

  const results = processedResults;

  if (!election && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-20">
        <Trophy size={64} className="opacity-10 mb-4" />
        <p className="text-xl font-medium">No results data available yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl p-8 border border-green-500/20 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] -z-10"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center border border-green-500/30">
              <Trophy className="text-yellow-400 w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                {election?.title || 'ELECTION RESULTS'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${election?.status === 'Completed' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
                  {election?.status || 'LIVE'}
                </span>
                <p className="text-gray-500 text-sm font-medium">| {election?.position || 'Academic Poll'}</p>
              </div>
            </div>
          </div>

          <div className="flex bg-black/40 px-6 py-3 rounded-2xl border border-white/5 divide-x divide-white/10 shadow-inner">
            <div className="pr-6 text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Participation</p>
              <p className="text-xl font-bold text-white leading-none">{totalVotes}</p>
            </div>
            <div className="pl-6 text-center font-mono">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 font-sans">Status</p>
              <p className={`text-sm font-bold uppercase ${election?.status === 'Completed' ? 'text-purple-400' : 'text-green-400'}`}>
                {election?.status === 'Completed' ? 'Final' : 'Ongoing'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid for Winner and Detail List */}
      <div className="grid lg:grid-cols-12 gap-8">

        {/* Left Column: Top Stats & Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-8 rounded-3xl border-2 transition-all duration-500 ${results[0]?.isWinner ? 'bg-linear-to-br from-yellow-500/10 to-transparent border-yellow-500/40 shadow-[0_0_50px_rgba(234,179,8,0.1)]' : 'bg-gray-900 border-gray-800'}`}>
            <div className="flex justify-between items-start mb-6">
              <Award className={`${results[0]?.isWinner ? 'text-yellow-400' : 'text-gray-600'}`} size={40} />
              {results.length > 0 && results[0].votes > 0 && (
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-[10px] font-black tracking-widest animate-bounce">LEADING</span>
              )}
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Projected Winner</p>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-4">
              {results.length > 0 && results[0].votes > 0 ? results[0].name : "Decision Pending"}
            </h3>
            {results.length > 0 && results[0].votes > 0 && (
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-white leading-none">{results[0].percentage}%</span>
                  <span className="text-yellow-500 font-bold mb-1">of total votes</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div className="h-full bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]" style={{ width: `${results[0].percentage}%` }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900/40 border border-white/5 rounded-3xl p-6">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Users size={12} /> Voter Statistics
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-medium">Valid Votes</span>
                <span className="text-white font-bold">{totalVotes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-medium">Candidates</span>
                <span className="text-white font-bold">{results.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Breakdown */}
        <div className="lg:col-span-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 mb-4">Cumulative Performance</h4>

            {results.map((result, index) => (
              <div
                key={result.id}
                className={`group relative bg-gray-900 border transition-all duration-300 rounded-2xl p-5 flex items-center gap-6 ${result.isWinner ? 'border-yellow-500/30 bg-yellow-500/[0.02]' : 'border-white/5 hover:border-green-500/30'
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shrink-0 transition-transform group-hover:scale-110 ${result.isWinner ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' :
                    index === 1 ? 'bg-gray-200 text-black' :
                      'bg-gray-800 text-gray-400'
                  }`}>
                  {result.rank}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="text-white font-bold tracking-tight text-lg mb-0.5 flex items-center gap-2">
                        {result.name}
                        {result.isWinner && <Trophy size={16} className="text-yellow-500" />}
                      </h5>
                      <p className="text-gray-500 text-xs font-mono font-bold tracking-tighter uppercase">{result.admission}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-white font-black text-xl leading-none block">{result.votes}</span>
                      <span className="text-gray-500 text-[9px] font-black uppercase">VOTES</span>
                    </div>
                  </div>

                  {/* Tiny Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full transition-all duration-700 rounded-full ${result.isWinner ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' : 'bg-green-500'
                          }`}
                        style={{ width: `${result.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-[10px] font-black w-8 text-right underline underline-offset-2 ${result.isWinner ? 'text-yellow-500' : 'text-gray-400'}`}>
                      {result.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Results;
