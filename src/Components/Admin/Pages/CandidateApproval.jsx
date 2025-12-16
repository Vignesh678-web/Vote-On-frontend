import React, { useState } from 'react';
import { Award, Check, X, User, Calendar, Mail, Phone } from 'lucide-react';

const CandidateApprovalSection = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [candidates, setCandidates] = useState([]);

  const handleApprove = (id) => {
    setCandidates(candidates.map(c =>
      c.id === id ? { ...c, status: 'approved' } : c
    ));
  };

  const handleReject = (id) => {
    setCandidates(candidates.map(c =>
      c.id === id ? { ...c, status: 'rejected' } : c
    ));
  };

  // COUNTS
  const pendingCount = candidates.filter(c => c.status === 'pending').length;
  const approvedCount = candidates.filter(c => c.status === 'approved').length;
  const rejectedCount = candidates.filter(c => c.status === 'rejected').length;

  // FILTER
  const filteredCandidates = candidates.filter(c => c.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="bg-gray-900 rounded-xl p-4 sm:p-6 mb-6 border border-gray-800">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">
            <div className="bg-purple-600 p-3 rounded-xl">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Class Representative Candidates
              </h1>
              <p className="text-purple-400 text-sm sm:text-lg mt-1">
                Nominated candidates for class elections
              </p>
            </div>
          </div>

          {/* TABS — ONLY 3 */}
          <div className="flex flex-wrap gap-2 sm:gap-3">

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === 'pending'
                  ? 'bg-green-400 text-black'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              Pending ({pendingCount})
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === 'approved'
                  ? 'bg-green-400 text-black'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              Approved ({approvedCount})
            </button>

            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === 'rejected'
                  ? 'bg-green-400 text-black'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              Rejected ({rejectedCount})
            </button>

          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 min-h-[400px]">

        {filteredCandidates.length === 0 ? (
          
          <div className="flex flex-col items-center justify-center h-72 text-center">
            <Award className="w-20 h-20 text-gray-700 mb-4" />

            <h2 className="text-2xl font-bold text-gray-400 mb-2">
              {activeTab === 'pending' && 'No Pending Candidates'}
              {activeTab === 'approved' && 'No Approved Candidates'}
              {activeTab === 'rejected' && 'No Rejected Candidates'}
            </h2>

            <p className="text-gray-500">
              {activeTab === 'pending'
                ? 'No pending candidates to review.'
                : activeTab === 'approved'
                ? 'Approved candidates will appear here.'
                : 'Rejected candidates will appear here.'}
            </p>
          </div>

        ) : (
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredCandidates.map(candidate => (
              <div
                key={candidate.id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-green-400 transition-all"
              >

                {/* HEADER */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-700 p-3 rounded-full">
                      <User className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {candidate.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{candidate.class}</p>
                    </div>
                  </div>

                  {/* STATUS BADGES */}
                  {candidate.status === 'pending' && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30">
                      Pending
                    </span>
                  )}
                  {candidate.status === 'approved' && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                      Approved
                    </span>
                  )}
                  {candidate.status === 'rejected' && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/30">
                      Rejected
                    </span>
                  )}
                </div>

                {/* DETAILS */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-green-400" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span>Nominated: {candidate.nominatedDate}</span>
                  </div>
                </div>

                {/* GPA */}
                <div className="bg-gray-700 rounded-lg p-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">GPA</span>
                    <span className="text-green-400 font-bold text-lg">
                      {candidate.gpa}
                    </span>
                  </div>
                </div>

                {/* MANIFESTO */}
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="text-green-400 font-semibold mb-1">Manifesto</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {candidate.manifesto}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                {candidate.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(candidate.id)}
                      className="flex-1 bg-green-400 hover:bg-green-500 text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <Check className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(candidate.id)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <X className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default CandidateApprovalSection;
