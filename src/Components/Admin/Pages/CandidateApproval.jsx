import React, { useState } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";

const CandidateApproval = ({ initialCandidates = [] }) => {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [activeTab, setActiveTab] = useState("pending");
  const [loadingId, setLoadingId] = useState(null);

  // APPROVE
  const handleApprove = async (studentId) => {
    try {
      setLoadingId(studentId);

      await axios.patch(
        `http://localhost:5000/api/admin/candidates/approve/${studentId}`
      );

      setCandidates(prev =>
        prev.map(c =>
          c._id === studentId
            ? { ...c, status: "approved" }
            : c
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    } finally {
      setLoadingId(null);
    }
  };

  // REJECT
  const handleReject = async (studentId) => {
    try {
      setLoadingId(studentId);

      await axios.patch(
        `http://localhost:5000/api/admin/candidates/reject/${studentId}`
      );

      setCandidates(prev =>
        prev.map(c =>
          c._id === studentId
            ? { ...c, status: "rejected" }
            : c
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Rejection failed");
    } finally {
      setLoadingId(null);
    }
  };

  // FILTER BY STATUS
  const filteredCandidates = candidates.filter(
    c => c.status === activeTab
  );

  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        {["pending", "approved", "rejected"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === tab
                ? "bg-green-400 text-black"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredCandidates.length === 0 && (
        <div className="text-gray-400 text-center py-16">
          No {activeTab} candidates
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {filteredCandidates.map(candidate => (
          <div
            key={candidate._id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4"
          >
            <h3 className="text-white font-semibold text-lg">
              {candidate.name}
            </h3>

            {activeTab === "pending" && (
              <div className="flex gap-3 mt-4">
                <button
                  disabled={loadingId === candidate._id}
                  onClick={() => handleApprove(candidate._id)}
                  className="px-4 py-2 bg-green-400 text-black font-semibold rounded"
                >
                  <Check size={16} className="inline mr-1" />
                  Approve
                </button>

                <button
                  disabled={loadingId === candidate._id}
                  onClick={() => handleReject(candidate._id)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 font-semibold rounded"
                >
                  <X size={16} className="inline mr-1" />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateApproval;
