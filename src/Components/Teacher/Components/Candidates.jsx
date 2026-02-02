// components/Candidates.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  UserCheck, Percent, Award, Trash2, AlertTriangle, 
  User, GraduationCap, Hash, Mail, BookOpen, FileText, 
  CheckCircle, XCircle, Edit3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";




const Candidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);


  const [candidateBio, setCandidateBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [manifestoPoints, setManifestoPoints] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null); // stores ID of candidate being deleted
  const [confirmDelete, setConfirmDelete] = useState(null); // stores candidate to confirm deletion


  // Handle delete candidate - opens confirmation modal
  const openDeleteConfirm = (e, candidate) => {
    e.stopPropagation();
    setConfirmDelete(candidate);
  };

  // Confirm and execute delete
  const executeDelete = async () => {
    if (!confirmDelete) return;
    
    const candidateId = confirmDelete.id;
    const candidateName = confirmDelete.name;

    try {
      setDeleting(candidateId);
      setConfirmDelete(null);
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/teacher/candidates/${candidateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove from local state
      setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
      toast.success(`${candidateName} removed from candidates`);

    } catch (err) {
      console.error("Delete candidate error:", err);
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Failed to delete candidate"
      );
    } finally {
      setDeleting(null);
    }
  };


  useEffect(() => {
    fetchApprovedCandidates();
  }, []);

  const fetchApprovedCandidates = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No auth token found");
      }

      const res = await axios.get(
        "http://localhost:5000/api/admin/candidates/get-candidates",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // EXPECTING: { candidates: [...] }
      const rawCandidates = Array.isArray(res.data)
        ? res.data
        : res.data.candidates;

      if (!Array.isArray(rawCandidates)) {
        throw new Error("Invalid candidates response");
      }

      // Filter to only show approved candidates who are still candidates
      const approvedCandidates = rawCandidates.filter(
        (c) => c.iscandidate === true && c.isApproved === true
      );

      const normalized = approvedCandidates.map((c) => {
        const manifestoArray = Array.isArray(c.manifestoPoints)
          ? c.manifestoPoints.filter(Boolean)
          : [];

        return {
          id: c._id,
          name: c.name,
          email: c.email || "",
          admissionNumber: c.admissionNumber || "",
          position: c.position || "",
          className: c.className || "",
          section: c.section || "",
          attendance: c.attendence ?? 0,
          candidateBio: c.candidateBio?.trim() || "",
          manifesto: c.manifesto?.trim() || "",
          manifestoPoints: manifestoArray,
          photoUrl: c.photoUrl?.trim() || "",
          electionStatus: c.electionStatus || "Active",
          votesCount: c.votesCount || 0,
        };
      });


      setCandidates(normalized);
    } catch (err) {
      console.error("Fetch approved candidates error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load approved candidates"
      );
    } finally {
      setLoading(false);
    }
  };



  const handleSaveCandidateDetails = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const formData = new FormData();

      // Bio
      formData.append("candidateBio", candidateBio);

      // Manifesto points (ONE PER LINE)
      manifestoPoints
        .split("\n")
        .map(p => p.trim())
        .filter(Boolean)
        .forEach(point => {
          formData.append("manifestoPoints[]", point);
        });

      // Photo
      if (photoFile) {
        formData.append("photo", photoFile); //  must match multer field
      }

      await axios.put(
        `http://localhost:5000/api/teacher/candidates/adddetails/${selectedCandidate.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Candidate details saved successfully");
      setIsModalOpen(false);
      await fetchApprovedCandidates();


    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Failed to save candidate details"
      );
    } finally {
      setSaving(false);
    }
  };





  /* ---------------- UI STATES ---------------- */

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        Loading approved candidates...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-400">
        {error}
      </div>
    );
  }



  const isCandidateIncomplete = (candidate) => {
    return (
      !candidate.candidateBio ||
      candidate.manifestoPoints.length === 0 ||
      !candidate.photoUrl
    );
  };


  return (
    <div
      className="min-h-screen bg-black p-6 space-y-6"
      style={{ background: "linear-gradient(to bottom, #000000, #0a0f0a)" }}
    >
      {/* HEADER */}
      <div className="bg-gray-900 rounded-xl p-6 border border-green-500/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/40">
            <UserCheck className="w-6 h-6 text-purple-400" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white">
              Approved Candidates
            </h3>
            <p className="text-sm text-purple-400">
              Candidates approved by admin
            </p>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {candidates.length === 0 ? (
        <div className="bg-gray-900 border border-green-500/30 rounded-xl p-12 text-center">
          <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-gray-400 mb-2">
            No Approved Candidates
          </h4>
          <p className="text-gray-500">
            Candidates will appear here once approved by admin
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-gray-900 border border-green-500/30 rounded-xl p-5 hover:border-green-400 transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-5">
                
                {/* Photo */}
                <div 
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/candidates/${candidate.id}`)}
                >
                  {candidate.photoUrl ? (
                    <img
                      src={candidate.photoUrl}
                      alt={candidate.name}
                      className="w-28 h-28 rounded-xl object-cover border-2 border-green-500/30 group-hover:border-green-400 transition-all"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-green-500/20 to-purple-500/20 flex items-center justify-center border-2 border-green-500/30">
                      <User className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3">
                  {/* Name & Position Row */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 
                        className="text-xl font-bold text-white cursor-pointer hover:text-green-400 transition-colors"
                        onClick={() => navigate(`/candidates/${candidate.id}`)}
                      >
                        {candidate.name}
                      </h4>
                      {candidate.position && (
                        <p className="text-purple-400 font-semibold text-sm mt-0.5">
                          {candidate.position}
                        </p>
                      )}
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {isCandidateIncomplete(candidate) ? (
                        <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Incomplete
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Complete
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Class & Section */}
                    <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                      <GraduationCap className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Class</p>
                        <p className="text-sm text-white font-medium">
                          {candidate.className || "N/A"} {candidate.section ? `- ${candidate.section}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Admission No */}
                    <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                      <Hash className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Admission</p>
                        <p className="text-sm text-white font-medium">{candidate.admissionNumber || "N/A"}</p>
                      </div>
                    </div>

                    {/* Attendance */}
                    <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                      <Percent className="w-4 h-4 text-green-400" />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Attendance</p>
                        <p className={`text-sm font-bold ${
                          candidate.attendance >= 75 ? "text-green-400" : "text-red-400"
                        }`}>
                          {candidate.attendance}%
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                      <Award className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Status</p>
                        <p className="text-sm text-amber-400 font-medium">{candidate.electionStatus}</p>
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

                  {/* Bio */}
                  {candidate.candidateBio && (
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Bio</p>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">{candidate.candidateBio}</p>
                    </div>
                  )}

                  {/* Manifesto Points */}
                  {candidate.manifestoPoints.length > 0 && (
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-green-400" />
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Manifesto Points</p>
                      </div>
                      <ul className="space-y-1">
                        {candidate.manifestoPoints.slice(0, 3).map((point, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">•</span>
                            <span className="line-clamp-1">{point}</span>
                          </li>
                        ))}
                        {candidate.manifestoPoints.length > 3 && (
                          <li className="text-gray-500 text-xs italic">
                            +{candidate.manifestoPoints.length - 3} more points...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex lg:flex-col gap-3 lg:justify-start items-start">
                  {isCandidateIncomplete(candidate) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCandidate(candidate);
                        setCandidateBio(candidate.candidateBio);
                        setManifestoPoints(candidate.manifestoPoints.join("\n"));
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-xl text-sm font-semibold hover:bg-purple-500/30 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                      Add Details
                    </button>
                  )}

                  <button
                    onClick={(e) => openDeleteConfirm(e, candidate)}
                    disabled={deleting === candidate.id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-500/20 hover:border-red-500/50 transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleting === candidate.id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && selectedCandidate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 w-full max-w-lg rounded-xl p-6 border border-green-500/30">

            <h3 className="text-xl font-bold text-white mb-4">
              Candidate Details – {selectedCandidate.name}
            </h3>

            {/* Candidate Bio */}
            <label className="block text-sm text-gray-400 mb-1">
              Candidate Bio
            </label>
            <textarea
              value={candidateBio}
              onChange={(e) => setCandidateBio(e.target.value)}
              rows={3}
              className="w-full mb-4 p-3 rounded-lg bg-black border border-gray-600 text-white"
            />

            {/* Manifesto */}
            <label className="block text-sm text-gray-400 mb-1">
              Manifesto Points (one per line)
            </label>
            <textarea
              value={manifestoPoints}
              onChange={(e) => setManifestoPoints(e.target.value)}
              rows={4}
              className="w-full mb-4 p-3 rounded-lg bg-black border border-gray-600 text-white"
            />

            {/* Photo URL */}
            <label className="block text-sm text-gray-400 mb-1">
              Candidate Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files[0])}
              className="w-full mb-6 text-sm text-gray-300
             file:mr-4 file:py-2 file:px-4
             file:rounded-lg file:border-0
             file:bg-purple-600 file:text-white
             hover:file:bg-purple-500"
            />

            {photoFile && (
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={URL.createObjectURL(photoFile)}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setPhotoFile(null)}
                  className="text-sm text-red-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}


            {/* ACTIONS */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={handleSaveCandidateDetails}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>


            </div>

          </div>
        </div>
      )
      }

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-red-500/50 rounded-2xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Remove Candidate</h3>
            </div>
            
            <p className="text-gray-400 mb-6">
              Are you sure you want to remove <span className="text-white font-semibold">{confirmDelete.name}</span> as a candidate? 
              This will reset their candidate status and all associated details.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Candidates;
