import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, X, Award, User, BookOpen, Percent, Calendar, Mail, Hash, GraduationCap } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const CandidateApproval = ({ initialCandidates = [] }) => {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [activeTab, setActiveTab] = useState("pending");
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/candidates/get-candidates",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!Array.isArray(res.data)) {
        throw new Error("Invalid candidates response");
      }

      setCandidates(res.data);
    } catch (err) {
      console.error("Fetch candidates error:", err);
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Failed to load candidates"
      );
    } finally {
      setLoading(false);
    }
  };

  // APPROVE
  const handleApprove = async (studentId, studentName) => {
    try {
      setLoadingId(studentId);

      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/candidates/approve/${studentId}`,
        {}, // Empty body for PATCH
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCandidates(prev =>
        prev.map(c =>
          c._id === studentId
            ? { ...c, iscandidate: true, isApproved: true, electionStatus: "Active" }
            : c
        )
      );

      toast.success(`${studentName} approved as candidate`);

    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    } finally {
      setLoadingId(null);
    }
  };

  // REJECT - completely removes candidate status
  const handleReject = async (studentId, studentName) => {
    try {
      setLoadingId(studentId);

      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/candidates/reject/${studentId}`,
        {}, // Empty body
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCandidates(prev =>
        prev.map(c =>
          c._id === studentId
            ? { ...c, iscandidate: true, isApproved: false, electionStatus: "Rejected" }
            : c
        )
      );

      toast.success(`${studentName} moved to rejected list`);

    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection failed");
    } finally {
      setLoadingId(null);
    }
  };

  // REVOKE - moves approved candidate back to pending
  const handleRevoke = async (studentId, studentName) => {
    try {
      setLoadingId(studentId);

      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/candidates/revoke/${studentId}`,
        {}, // Empty body
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCandidates(prev =>
        prev.map(c =>
          c._id === studentId
            ? { ...c, isApproved: false, electionStatus: "Pending" }
            : c
        )
      );

      toast.success(`${studentName} moved back to pending`);

    } catch (err) {
      toast.error(err.response?.data?.message || "Revoke failed");
    } finally {
      setLoadingId(null);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // FILTER BY STATUS
  const filteredCandidates = candidates.filter((c) => {
    if (activeTab === "pending") {
      // Pending = iscandidate true AND isApproved is false/undefined/null AND not rejected
      return c.iscandidate === true && !c.isApproved && c.electionStatus !== "Rejected";
    }
    if (activeTab === "approved") {
      // Approved = iscandidate true AND isApproved true
      return c.iscandidate === true && c.isApproved === true;
    }
    if (activeTab === "rejected") {
      return c.electionStatus === "Rejected";
    }
    return true;
  });

  // Count badges
  const pendingCount = candidates.filter(c => c.iscandidate === true && !c.isApproved && c.electionStatus !== "Rejected").length;
  const approvedCount = candidates.filter(c => c.iscandidate === true && c.isApproved === true).length;
  const rejectedCount = candidates.filter(c => c.electionStatus === "Rejected").length;

  if (loading) {
    return (
      <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">
        Loading candidates...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-500/20 rounded-xl">
          <Award className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Candidate Approval</h2>
          <p className="text-sm text-gray-400">Review and approve candidate nominations</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activeTab === "pending"
              ? "bg-amber-500 text-black"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Pending
          {pendingCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "pending" ? "bg-black/20 text-black" : "bg-amber-500/20 text-amber-400"
            }`}>
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activeTab === "approved"
              ? "bg-green-500 text-black"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Approved
          {approvedCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "approved" ? "bg-black/20 text-black" : "bg-green-500/20 text-green-400"
            }`}>
              {approvedCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activeTab === "rejected"
              ? "bg-red-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Rejected
          {rejectedCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "rejected" ? "bg-white/20 text-white" : "bg-red-500/20 text-red-400"
            }`}>
              {rejectedCount}
            </span>
          )}
        </button>
      </div>

      {/* EMPTY STATE */}
      {filteredCandidates.length === 0 && (
        <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
          <User className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No {activeTab} candidates</p>
        </div>
      )}

      {/* CANDIDATE CARDS */}
      <div className="grid gap-4">
        {filteredCandidates.map(candidate => (
          <div
            key={candidate._id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-all"
          >
            <div className="flex flex-col lg:flex-row gap-5">
              
              {/* Photo */}
              <div className="flex-shrink-0">
                {candidate.photoUrl ? (
                  <img
                    src={candidate.photoUrl}
                    alt={candidate.name}
                    className="w-24 h-24 rounded-xl object-cover border-2 border-gray-700"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500/20 to-green-500/20 flex items-center justify-center border border-gray-700">
                    <User className="w-10 h-10 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 space-y-3">
                {/* Name & Position */}
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {candidate.name}
                  </h3>
                  {candidate.position && (
                    <p className="text-purple-400 font-semibold text-sm">
                      Position: {candidate.position}
                    </p>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Class & Section */}
                  <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-2 rounded-lg">
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Class</p>
                      <p className="text-sm text-white font-medium">
                        {candidate.className || "N/A"} {candidate.section ? `- ${candidate.section}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Admission No */}
                  <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-2 rounded-lg">
                    <Hash className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Admission</p>
                      <p className="text-sm text-white font-medium">{candidate.admissionNumber || "N/A"}</p>
                    </div>
                  </div>

                  {/* Attendance */}
                  <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-2 rounded-lg">
                    <Percent className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Attendance</p>
                      <p className={`text-sm font-bold ${
                        (candidate.attendence || 0) >= 75 ? "text-green-400" : "text-red-400"
                      }`}>
                        {candidate.attendence || 0}%
                      </p>
                    </div>
                  </div>

                  {/* Nominated On */}
                  <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Nominated</p>
                      <p className="text-sm text-white font-medium">{formatDate(candidate.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                {candidate.email && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Mail className="w-4 h-4" />
                    <span>{candidate.email}</span>
                  </div>
                )}

                {/* Manifesto */}
                {candidate.manifesto && (
                  <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Manifesto</p>
                    </div>
                    <p className="text-gray-300 text-sm">{candidate.manifesto}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {activeTab === "pending" && (
                <div className="flex lg:flex-col gap-3 lg:justify-start">
                  <button
                    disabled={loadingId === candidate._id}
                    onClick={() => handleApprove(candidate._id, candidate.name)}
                    className="flex-1 lg:flex-none px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check size={18} />
                    {loadingId === candidate._id ? "..." : "Approve"}
                  </button>

                  <button
                    disabled={loadingId === candidate._id}
                    onClick={() => handleReject(candidate._id, candidate.name)}
                    className="flex-1 lg:flex-none px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <X size={18} />
                    {loadingId === candidate._id ? "..." : "Reject"}
                  </button>
                </div>
              )}

              {/* Approved - Show Revoke Button */}
              {activeTab === "approved" && (
                <div className="flex lg:flex-col gap-3 lg:justify-start items-start">
                  <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl mb-2">
                    <p className="text-green-400 font-bold text-xs flex items-center gap-2">
                      <Check size={14} /> Approved
                    </p>
                  </div>
                  <button
                    disabled={loadingId === candidate._id}
                    onClick={() => handleRevoke(candidate._id, candidate.name)}
                    className="px-5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <X size={18} />
                    {loadingId === candidate._id ? "..." : "Revoke"}
                  </button>
                </div>
              )}

              {/* Rejected - Show Approve Button */}
              {activeTab === "rejected" && (
                <div className="flex lg:flex-col gap-3 lg:justify-start items-start">
                  <div className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl mb-2">
                    <p className="text-red-400 font-bold text-xs flex items-center gap-2">
                      <X size={14} /> Rejected
                    </p>
                  </div>
                  <button
                    disabled={loadingId === candidate._id}
                    onClick={() => handleApprove(candidate._id, candidate.name)}
                    className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check size={18} />
                    {loadingId === candidate._id ? "..." : "Approve"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default CandidateApproval;
