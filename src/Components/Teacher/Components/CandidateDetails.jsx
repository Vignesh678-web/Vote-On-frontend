import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  User,
  Percent,
  Award,
  FileText,
  Edit,
  Plus,
  X,
  Trash2,
  Upload,
} from "lucide-react";

const CandidateDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    candidateBio: "",
    manifestoPoints: [""],
    photoFile: null,
    photoPreview: null,
  });
  const [submitting, setSubmitting] = useState(false);

  /* ============ MODAL FUNCTIONS ============ */
  
  const openModalForAdd = () => {
    setModalMode("add");
    setFormData({
      candidateBio: candidate?.candidateBio || "",
      manifestoPoints: candidate?.manifesto?.length > 0 ? candidate.manifesto : [""],
      photoFile: null,
      photoPreview: candidate?.photoUrl || null,
    });
    setShowModal(true);
  };

  const openModalForEdit = () => {
    setModalMode("edit");
    setFormData({
      candidateBio: candidate?.candidateBio || "",
      manifestoPoints: candidate?.manifesto?.length > 0 ? candidate.manifesto : [""],
      photoFile: null,
      photoPreview: candidate?.photoUrl || null,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      candidateBio: "",
      manifestoPoints: [""],
      photoFile: null,
      photoPreview: null,
    });
  };

  const handleBioChange = (e) => {
    setFormData({ ...formData, candidateBio: e.target.value });
  };

  const handleManifestoChange = (index, value) => {
    const updated = [...formData.manifestoPoints];
    updated[index] = value;
    setFormData({ ...formData, manifestoPoints: updated });
  };

  const addManifestoField = () => {
    setFormData({
      ...formData,
      manifestoPoints: [...formData.manifestoPoints, ""],
    });
  };

  const removeManifestoField = (index) => {
    const updated = formData.manifestoPoints.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      manifestoPoints: updated.length > 0 ? updated : [""],
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photoFile: file,
          photoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      const formPayload = new FormData();
      formPayload.append("candidateBio", formData.candidateBio);
      formData.manifestoPoints.forEach((point, index) => {
        formPayload.append(`manifestoPoints[${index}]`, point);
      });
      if (formData.photoFile) {
        formPayload.append("photo", formData.photoFile);
      }

      const endpoint = modalMode === "add"
        ? `http://localhost:5000/api/teacher/candidates/adddetails/${studentId}`
        : `http://localhost:5000/api/teacher/candidates/adddetails/${studentId}`;

      const method = modalMode === "add" ? "POST" : "PUT";

      const response = await axios({
        method,
        url: endpoint,
        data: formPayload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update candidate state with response
      setCandidate({
        ...candidate,
        candidateBio: response.data.student.candidateBio,
        manifesto: response.data.student.manifestoPoints,
        photoUrl: response.data.student.photoUrl,
      });

      closeModal();
      alert(response.data.message);
    } catch (err) {
      alert(
        err.response?.data?.message ||
        err.message ||
        "Failed to save details"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ============ FETCH CANDIDATE ============ */
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Session expired. Please login again.");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/teacher/candidates/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 🔒 Normalize response defensively
        const manifestoData = res.data.manifesto || res.data.manifestoPoints || [];
        setCandidate({
          _id: res.data._id,
          name: res.data.name,
          position: res.data.position,
          attendence: res.data.attendence ?? 0,
          candidateBio: res.data.candidateBio || "",
          manifesto: Array.isArray(manifestoData) ? manifestoData : [],
          photoUrl: res.data.photoUrl || null,
        });

        
        
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load candidate"
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidate();
  }, [studentId]);
  
  console.log(candidate,"candidate");
  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center p-6">
        <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <p className="text-red-400 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Candidate not found
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="relative max-w-5xl mx-auto">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* CARD */}
        <div className="bg-gray-900/80 border border-emerald-500/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* PHOTO */}
              <img
                src={candidate.photoUrl || "/placeholder.png"}
                alt={candidate.name}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-2 border-emerald-400/50"
              />

              {/* INFO */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    {candidate.name}
                  </h1>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <User size={18} />
                    <span className="text-lg">{candidate.position}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <Percent size={20} className="text-emerald-400" />
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">
                      {candidate.attendence}%
                    </div>
                    <div className="text-xs text-emerald-300/70">
                      Attendance
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BIO */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-emerald-400" />
                <h2 className="text-2xl font-bold text-white">About</h2>
              </div>

              <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6">
                <p className="text-gray-300">
                  {candidate.candidateBio || "No bio provided"}
                </p>
              </div>
            </section>

            {/* MANIFESTO */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Award size={20} className="text-emerald-400" />
                <h2 className="text-2xl font-bold text-white">Manifesto</h2>
              </div>

              {candidate.manifesto.length > 0 ? (
                <div className="grid gap-4">
                  {candidate.manifesto.map((point, i) => (
                    <div
                      key={i}
                      className="bg-black/40 border border-emerald-500/20 rounded-2xl p-5"
                    >
                      <p className="text-gray-300">
                        {i + 1}. {point}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-black/20 border border-emerald-500/10 rounded-2xl p-6 text-center text-gray-500">
                  No manifesto points added yet
                </div>
              )}
            </section>

            {/* ACTION BUTTONS */}
            <div className="pt-6 border-t border-emerald-500/20">
              <button
                onClick={openModalForEdit}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:shadow-2xl transform hover:scale-105"
              >
                <Edit size={20} />
                <span>Edit Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ MODAL ============ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900/95 border border-emerald-500/30 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* MODAL HEADER */}
            <div className="sticky top-0 bg-linear-to-r from-gray-900 to-gray-800 border-b border-emerald-500/20 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {modalMode === "add" ? "Add Candidate Details" : "Edit Candidate Details"}
                </h3>
                <p className="text-emerald-400 text-sm mt-1">
                  {candidate?.name}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* MODAL BODY */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-6">
              {/* BIO SECTION */}
              <div className="space-y-3">
                <label className="block text-white font-semibold text-sm">
                  Candidate Bio
                </label>
                <textarea
                  value={formData.candidateBio}
                  onChange={handleBioChange}
                  placeholder="Enter candidate biography..."
                  className="w-full px-4 py-3 bg-black/40 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                  rows="4"
                />
              </div>

              {/* MANIFESTO POINTS SECTION */}
              <div className="space-y-3">
                <label className="block text-white font-semibold text-sm">
                  Manifesto Points
                </label>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {formData.manifestoPoints.map((point, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => handleManifestoChange(index, e.target.value)}
                          placeholder={`Point ${index + 1}...`}
                          className="w-full px-4 py-3 bg-black/40 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                      {formData.manifestoPoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeManifestoField(index)}
                          className="px-3 py-3 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addManifestoField}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30 text-emerald-400 rounded-xl transition-colors font-medium"
                >
                  <Plus size={18} />
                  Add Point
                </button>
              </div>

              {/* PHOTO SECTION */}
              <div className="space-y-3">
                <label className="block text-white font-semibold text-sm">
                  Candidate Photo
                </label>
                
                {formData.photoPreview && (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-emerald-500/30">
                    <img
                      src={formData.photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, photoFile: null, photoPreview: null })}
                      className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-black/40 border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 rounded-xl cursor-pointer transition-colors">
                  <Upload size={20} className="text-emerald-400" />
                  <span className="text-emerald-400 font-medium">
                    {formData.photoFile ? "Change Photo" : "Upload Photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-6 border-t border-emerald-500/20">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Edit size={18} />
                      <span>{modalMode === "add" ? "Add Details" : "Update Details"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetails;
