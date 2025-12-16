import React from 'react';
import { BarChart3 } from 'lucide-react';


const ElectionMonitor = ({ elections, onDeclareResult }) => (
  <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-xl">
    <div className="flex items-center gap-2 mb-4">
      <BarChart3 className="w-5 h-5 text-green-400" />
      <h2 className="text-xl font-semibold text-green-400">Monitor Elections</h2>
    </div>
    <div className="space-y-4">
      {elections.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No active elections</p>
      ) : (
        elections.map((election) => (
          <div
            key={election.id}
            className="bg-gray-800 border border-green-500/20 rounded p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-green-400">{election.title}</h3>
                <p className="text-sm text-gray-400">{election.date}</p>
              </div>
              <span
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  election.status === 'Active'
                    ? 'bg-green-500/20 text-green-400'
                    : election.status === 'Completed'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {election.status}
              </span>
            </div>
            <div className="space-y-2 mb-3">
              {election.candidates.map((candidate, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-300">{candidate.name}</span>
                  <span className="text-green-400 font-semibold">{candidate.votes} votes</span>
                </div>
              ))}
            </div>
            {election.status === 'Active' && (
              <button
                onClick={() => onDeclareResult(election.id)}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded transition-colors"
              >
                Declare Result
              </button>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);
export default ElectionMonitor;