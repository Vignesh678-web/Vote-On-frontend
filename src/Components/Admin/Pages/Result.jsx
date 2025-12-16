import react from 'react';
import { Eye, FileText } from 'lucide-react';


const Results = ({ results, onPrintPDF }) => (
  <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-xl">
    <div className="flex items-center gap-2 mb-4">
      <Eye className="w-5 h-5 text-green-400" />
      <h2 className="text-xl font-semibold text-green-400">Election Results</h2>
    </div>
    <div className="space-y-4">
      {results.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No results declared yet</p>
      ) : (
        results.map((result) => (
          <div
            key={result.id}
            className="bg-gray-800 border border-green-500/20 rounded p-4"
          >
            <h3 className="text-lg font-semibold text-green-400 mb-2">{result.title}</h3>
            <p className="text-sm text-gray-400 mb-3">Declared on: {result.declaredDate}</p>
            <div className="space-y-2 mb-3">
              {result.candidates.map((candidate, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">{candidate.name}</span>
                    {idx === 0 && <span className="text-yellow-400 text-xs">🏆 Winner</span>}
                  </div>
                  <span className="text-green-400 font-semibold">{candidate.votes} votes</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => onPrintPDF(result)}
              className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Print PDF
            </button>
          </div>
        ))
      )}
    </div>
  </div>
);
export default Results;