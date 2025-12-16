import React, { useState } from 'react';
import { Trophy, Award, Users, TrendingUp, Plus } from 'lucide-react';

const Results = () => {
  const [results, setResults] = useState([
    { id: 1, name: 'John Doe', admission: 'ADM2024001', votes: 145, percentage: 35.8, rank: 1 },
    { id: 2, name: 'Sarah Smith', admission: 'ADM2024002', votes: 128, percentage: 31.6, rank: 2 },
    { id: 3, name: 'Mike Johnson', admission: 'ADM2024003', votes: 89, percentage: 22.0, rank: 3 },
    { id: 4, name: 'Emily Davis', admission: 'ADM2024004', votes: 43, percentage: 10.6, rank: 4 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newResult, setNewResult] = useState({
    name: '',
    admission: '',
    votes: ''
  });

  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

  const handleAddResult = () => {
    if (newResult.name && newResult.admission && newResult.votes) {
      const votes = parseInt(newResult.votes);
      const newTotal = totalVotes + votes;
      const percentage = ((votes / newTotal) * 100).toFixed(1);
      
      // Recalculate all percentages
      const updatedResults = results.map(r => ({
        ...r,
        percentage: parseFloat(((r.votes / newTotal) * 100).toFixed(1))
      }));

      const newEntry = {
        id: Date.now(),
        name: newResult.name,
        admission: newResult.admission,
        votes: votes,
        percentage: parseFloat(percentage),
        rank: results.length + 1
      };

      const allResults = [...updatedResults, newEntry].sort((a, b) => b.votes - a.votes);
      
      // Update ranks
      allResults.forEach((r, index) => {
        r.rank = index + 1;
      });

      setResults(allResults);
      setNewResult({ name: '', admission: '', votes: '' });
      setShowAddModal(false);
    }
  };



  return (
    <div className="min-h-screen bg-black p-6 space-y-6" style={{ background: 'linear-gradient(to bottom, #000000, #0a0f0a)' }}>
      {/* Header */}
      <div 
        className="bg-gray-900 rounded-xl shadow-sm p-6 border border-green-500/30"
        style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.15)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 bg-green-500/20 rounded-xl border border-green-500/40"
              style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}
            >
              <Trophy 
                className="w-6 h-6 text-green-400" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))' }} 
              />
            </div>
            <div>
              <h3 
                className="text-2xl font-bold text-white mb-1"
                style={{ textShadow: '0 0 15px rgba(34, 197, 94, 0.3)' }}
              >
                Class Representative Election Results
              </h3>
              <p className="text-sm text-green-400 font-semibold">Final voting results and rankings</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 text-black px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-bold border border-green-400/50 group"
            style={{ boxShadow: '0 0 25px rgba(34, 197, 94, 0.5)' }}
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Add Result
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="bg-gray-900 border border-green-500/30 rounded-xl p-6"
          style={{ boxShadow: '0 0 25px rgba(34, 197, 94, 0.1)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400 font-semibold">Total Votes Cast</span>
          </div>
          <p className="text-3xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(34, 197, 94, 0.3)' }}>
            {totalVotes}
          </p>
        </div>

        <div 
          className="bg-gray-900 border border-green-500/30 rounded-xl p-6"
          style={{ boxShadow: '0 0 25px rgba(34, 197, 94, 0.1)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-400 font-semibold">Winner</span>
          </div>
          <p className="text-2xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(34, 197, 94, 0.3)' }}>
            {results[0]?.name || 'N/A'}
          </p>
        </div>

        <div 
          className="bg-gray-900 border border-green-500/30 rounded-xl p-6"
          style={{ boxShadow: '0 0 25px rgba(34, 197, 94, 0.1)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400 font-semibold">Candidates</span>
          </div>
          <p className="text-3xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(34, 197, 94, 0.3)' }}>
            {results.length}
          </p>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <div 
            key={result.id}
            className="bg-gray-900 border border-green-500/30 hover:border-green-500/50 rounded-xl p-6 transition-all duration-300"
            style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.1)' }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                {/* Rank Number */}
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center"
                  style={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)' }}
                >
                  <span className="text-xl font-bold text-green-400">#{result.rank}</span>
                </div>

                {/* Candidate Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h4 
                      className="font-bold text-white text-xl"
                      style={{ textShadow: '0 0 12px rgba(34, 197, 94, 0.2)' }}
                    >
                      {result.name}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-400 font-semibold mb-3">{result.admission}</p>
                  
                  {/* Vote Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-semibold">{result.votes} votes</span>
                      <span className="text-green-400 font-bold">{result.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-green-500/30">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 rounded-full"
                        style={{ 
                          width: `${result.percentage}%`,
                          boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vote Count Display */}
              <div 
                className="flex-shrink-0 bg-green-500/10 border border-green-500/40 rounded-xl px-6 py-4 text-center"
                style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)' }}
              >
                <p className="text-3xl font-bold text-green-400" style={{ textShadow: '0 0 15px rgba(34, 197, 94, 0.4)' }}>
                  {result.votes}
                </p>
                <p className="text-xs text-gray-400 font-semibold mt-1">VOTES</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Result Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div 
            className="bg-gray-900 border border-green-500/40 rounded-2xl p-8 max-w-md w-full"
            style={{ boxShadow: '0 0 50px rgba(34, 197, 94, 0.3)' }}
          >
            <h3 
              className="text-2xl font-bold text-white mb-6"
              style={{ textShadow: '0 0 15px rgba(34, 197, 94, 0.3)' }}
            >
              Add Election Result
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Candidate Name</label>
                <input 
                  type="text"
                  value={newResult.name}
                  onChange={(e) => setNewResult({...newResult, name: e.target.value})}
                  className="w-full bg-gray-800 border border-green-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/60 transition-all"
                  style={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)' }}
                  placeholder="Enter candidate name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Admission Number</label>
                <input 
                  type="text"
                  value={newResult.admission}
                  onChange={(e) => setNewResult({...newResult, admission: e.target.value})}
                  className="w-full bg-gray-800 border border-green-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/60 transition-all"
                  style={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)' }}
                  placeholder="Enter admission number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Total Votes</label>
                <input 
                  type="number"
                  value={newResult.votes}
                  onChange={(e) => setNewResult({...newResult, votes: e.target.value})}
                  className="w-full bg-gray-800 border border-green-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/60 transition-all"
                  style={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)' }}
                  placeholder="Enter vote count"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-xl font-bold border border-gray-600/50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddResult}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 text-black px-6 py-3 rounded-xl font-bold border border-green-400/50 transition-all"
                style={{ boxShadow: '0 0 25px rgba(34, 197, 94, 0.5)' }}
              >
                Add Result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;