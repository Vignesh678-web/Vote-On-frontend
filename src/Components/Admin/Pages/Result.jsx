import React, { useState } from 'react';
import { 
  Trophy, 
  BarChart3, 
  Users, 
  Calendar, 
  Search, 
  Download, 
  ArrowRight,
  TrendingUp,
  Award,
  Filter,
  Users2
} from 'lucide-react';
import { useEffect } from 'react';

const Result = ({ results, onPrintPDF, refreshData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (refreshData) refreshData();
  }, []);

  const filteredResults = results.filter(res => {
    const title = res.title || '';
    const pos = res.position || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pos.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || res.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getWinner = (result) => {
    if (!result.winner) return null;
    // The winner is populated in backend
    return typeof result.winner === 'object' ? result.winner : null;
  };

  const calculatePercentage = (votes, total) => {
    if (!total) return 0;
    return ((votes / total) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Election Results</h1>
          <p className="text-slate-400">View and archive results for completed college and class elections</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900/50 border border-slate-700 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all w-full md:w-64"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-700">
            {['all', 'college', 'class'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  filterType === type 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Trophy className="w-6 h-6 text-emerald-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500/50" />
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Total Elections Cleared</h3>
          <p className="text-2xl font-bold text-white mt-1">{results.length}</p>
        </div>
        
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500/50" />
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Total Votes Recorded</h3>
          <p className="text-2xl font-bold text-white mt-1">
            {results.reduce((acc, curr) => acc + (curr.totalVotes || 0), 0)}
          </p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-500/50" />
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Class Participation</h3>
          <p className="text-2xl font-bold text-white mt-1">100%</p>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-8">
        {filteredResults.length === 0 ? (
          <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-3xl p-20 text-center">
            <div className="bg-slate-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-300">No results found</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
          </div>
        ) : (
          filteredResults.map((result) => {
            const winner = getWinner(result);
            const totalVotes = result.totalVotes || 0;
            const sortedCandidates = [...result.candidates].sort((a, b) => b.votesCount - a.votesCount);
            
            return (
              <div 
                key={result._id} 
                className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Left: Winner Hero Section */}
                  <div className="lg:w-1/3 p-8 bg-linear-to-br from-slate-900/80 to-slate-800/50 border-r border-slate-700/50">
                    <div className="flex items-center justify-between mb-8">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        result.type === 'college' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {result.type} Election
                      </span>
                      <p className="text-slate-500 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(result.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <img 
                          src={winner?.photoUrl || `https://ui-avatars.com/api/?name=${winner?.name || 'Winner'}&background=10b981&color=fff`}
                          alt={winner?.name}
                          className="relative w-32 h-32 rounded-3xl object-cover border-2 border-emerald-500/30 shadow-2xl mx-auto"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-900 p-2 rounded-xl shadow-xl transform rotate-12">
                          <Trophy className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-white mb-1">{winner?.name || "No Winner Declared"}</h2>
                      <p className="text-emerald-400 font-medium text-sm mb-4">Official {result.position}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-700/50">
                          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Votes</p>
                          <p className="text-xl font-bold text-white tracking-tight">{totalVotes}</p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-700/50">
                          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Win Margin</p>
                          <p className="text-xl font-bold text-white tracking-tight">
                            {calculatePercentage(sortedCandidates[0]?.votesCount, totalVotes)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Detailed Breakdown */}
                  <div className="lg:w-2/3 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-xl font-bold text-white leading-none">{result.title}</h3>
                          <p className="text-slate-500 text-sm mt-2 flex items-center gap-2">
                            <Users2 className="w-4 h-4" />
                            Contested by {result.candidates.length} Nominees
                          </p>
                        </div>
                        <button 
                          onClick={() => onPrintPDF(result)}
                          className="p-3 bg-slate-900/50 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/30 rounded-2xl transition-all"
                          title="Download Result Report"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {sortedCandidates.map((candidate, idx) => {
                          const percentage = calculatePercentage(candidate.votesCount, totalVotes);
                          const isWinner = winner?._id === candidate.student?._id;
                          
                          return (
                            <div key={idx} className="relative group/candidate">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                    isWinner ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900/50 text-slate-500'
                                  }`}>
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <p className={`font-semibold text-sm ${isWinner ? 'text-emerald-400' : 'text-slate-300'}`}>
                                      {candidate.student?.name || "Unknown Candidate"}
                                      {isWinner && <span className="ml-2 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full">ELECTED</span>}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{candidate.student?.admissionNumber || "—"}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-white">{candidate.votesCount} Votes</p>
                                  <p className="text-[10px] text-slate-500 font-bold">{percentage}%</p>
                                </div>
                              </div>
                              
                              <div className="h-2 w-full bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/30">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                    isWinner ? 'bg-linear-to-r from-emerald-500 to-teal-400' : 'bg-slate-700'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-700/50 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {sortedCandidates.slice(0, 5).map((c, i) => (
                          <img 
                            key={i}
                            src={c.student?.photoUrl || `https://ui-avatars.com/api/?name=${c.student?.name || 'U'}&background=random`}
                            className="w-8 h-8 rounded-full border-2 border-slate-800 object-cover"
                            alt="nominee"
                          />
                        ))}
                        {sortedCandidates.length > 5 && (
                          <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                            +{sortedCandidates.length - 5}
                          </div>
                        )}
                      </div>
                      
                      <button className="text-slate-400 hover:text-white text-sm font-semibold flex items-center gap-2 group/btn">
                        View Audit Log
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Result;