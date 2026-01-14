// components/Candidates.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserCheck, Percent, Award } from "lucide-react";

const Candidates = () => {
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

      const normalized = rawCandidates.map((c) => ({
        id: c._id,
        name: c.name,
        position: c.position,
        attendance: c.attendence ?? 0,
      }));


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

      alert("Candidate details saved successfully");
      setIsModalOpen(false);
      await fetchApprovedCandidates();


    } catch (err) {
      alert(
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
            Candidates will appear here once approved
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-gray-900 border border-green-500/30 rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-lg">
                    {candidate.name}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {candidate.position}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/40 rounded-lg">
                    <Percent className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-bold text-green-400">
                      {candidate.attendance}% Attendance
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setCandidateBio(candidate.candidateBio || "");
                      setManifestoPoints(
                        Array.isArray(candidate.manifestoPoints)
                          ? candidate.manifestoPoints.join("\n")
                          : ""
                      );
                      setIsModalOpen(true);
                    }}
                    className="text-sm  text-purple-400 hover:text-purple-300 underline"
                  >
                    Add / Edit
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

    </div >
  );
};

export default Candidates;
