import React, { useState, useEffect } from "react";
import axios from "axios";
import { Vote, Plus, Play, Square, UserPlus, Calendar, Clock, AlertCircle, Edit2, Trash2 } from "lucide-react";

export default function ManageElections() {
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    position: "",
    className: "",
    section: "",
    startDate: "",
    endDate: "",
    description: "",
    minAttendanceRequired: 75
  });

  const [candidateForm, setCandidateForm] = useState({
    studentId: "",
    position: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch elections
      const electionRes = await axios.get("http://localhost:5000/api/teacher/class-election", { headers });
      setElections(electionRes.data.elections || []);

      // Fetch approved candidates to be added to elections
      const candidateRes = await axios.get("http://localhost:5000/api/teacher/approved-candidates", { headers });
      setCandidates(candidateRes.data.candidates || []);

    } catch (err) {
      console.error("Failed to fetch election data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/teacher/class-election/create",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowCreateModal(false);
      resetForm();
      fetchData();
      alert("Election created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create election");
    }
  };

  const handleEditClick = (election) => {
    setSelectedElection(election);

    // Format dates for datetime-local input (YYYY-MM-DDTHH:mm) using local time
    const toLocalISO = (dateStr) => {
      const d = new Date(dateStr);
      const offset = d.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
      return localISOTime;
    };

    setFormData({
      title: election.title,
      position: election.position,
      className: election.className,
      section: election.section,
      startDate: toLocalISO(election.startDate),
      endDate: toLocalISO(election.endDate),
      description: election.description || "",
      minAttendanceRequired: election.minAttendanceRequired || 75
    });
    setShowEditModal(true);
  };

  const handleUpdateElection = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/teacher/class-election/${selectedElection._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditModal(false);
      resetForm();
      fetchData();
      alert("Election updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update election");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      position: "",
      className: "",
      section: "",
      startDate: "",
      endDate: "",
      description: "",
      minAttendanceRequired: 75
    });
    setSelectedElection(null);
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/teacher/class-election/add-candidate",
        {
          electionId: selectedElection._id,
          studentId: candidateForm.studentId,
          position: candidateForm.position || selectedElection.position
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddCandidateModal(false);
      fetchData();
      alert("Candidate added successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add candidate");
    }
  };

  const handleStartElection = async (electionId) => {
    if (!window.confirm("Are you sure you want to start this election? Students will be able to vote.")) return;
    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/teacher/class-election/${electionId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start election");
    }
  };

  const handleEndElection = async (electionId) => {
    if (!window.confirm("Are you sure you want to end this election and declare the winner?")) return;
    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/teacher/class-election/${electionId}/end`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to end election");
    }
  };

  const handleDeleteElection = async (electionId) => {
    if (!window.confirm("ARE YOU ABSOLUTELY SURE? This will permanently delete this election and all its voting records. This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/teacher/class-election/${electionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Election deleted permanently.");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete election");
    }
  };

  if (loading) return <div className="text-green-400 p-6">Loading elections...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Vote className="w-8 h-8 text-green-400" />
          Manage Class Elections
        </h2>
        <button
          onClick={() => { resetForm(); setShowCreateModal(true); }}
          className="bg-green-600 hover:bg-green-500 text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Create New Election
        </button>
      </div>

      <div className="grid gap-6">
        {elections.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-500">
            No elections found. Create one to get started.
          </div>
        ) : (
          elections.map((election) => (
            <div key={election._id} className="bg-gray-900 border border-green-500/30 rounded-xl p-6 hover:border-green-500/60 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{election.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${election.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                      election.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400'
                      }`}>
                      {election.status}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">{election.className} - {election.section} • {election.position}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4 text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Start: {new Date(election.startDate).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>End: {new Date(election.endDate).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <p className="text-white text-sm font-semibold w-full mb-1">Candidates ({election.candidates.length}):</p>
                    {election.candidates.length === 0 ? (
                      <p className="text-gray-600 text-xs italic">No candidates added yet.</p>
                    ) : (
                      election.candidates.map((c, i) => (
                        <span key={c.student?._id || i} className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-xs border border-gray-700 flex items-center gap-2">
                          <span className="font-medium">{c.student?.name || "Deleted Student"}</span>
                          {c.student?.className && (
                            <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              {c.student.className}{c.student.section ? ` - ${c.student.section}` : ''}
                            </span>
                          )}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[150px]">
                  {(election.status === 'Draft' || election.status === 'Scheduled') && (
                    <>
                      <button
                        onClick={() => handleEditClick(election)}
                        className="p-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 text-xs font-bold transition-all"
                      >
                        <Edit2 size={14} /> Edit Details
                      </button>
                      <button
                        onClick={() => { setSelectedElection(election); setShowAddCandidateModal(true); }}
                        className="p-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 flex items-center gap-2 text-xs font-bold transition-all"
                      >
                        <UserPlus size={14} /> Add Candidate
                      </button>
                      <button
                        disabled={election.candidates.length < 2}
                        onClick={() => handleStartElection(election._id)}
                        className="p-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 flex items-center gap-2 text-xs font-bold disabled:opacity-30 transition-all"
                      >
                        <Play size={14} /> Start Election
                      </button>
                    </>
                  )}
                  {election.status === 'Active' && (
                    <button
                      onClick={() => handleEndElection(election._id)}
                      className="p-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 flex items-center gap-2 text-xs font-bold transition-all"
                    >
                      <Square size={14} /> End Election
                    </button>
                  )}
                  {election.status === 'Completed' && election.winner && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
                      <p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-1">Declared Winner</p>
                      <p className="text-white font-bold text-sm">{election.winner.name}</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleDeleteElection(election._id)}
                    className="p-2 mt-2 bg-red-600/10 text-red-500 border border-red-600/20 rounded-lg hover:bg-red-600/20 flex items-center justify-center gap-2 text-[10px] font-black uppercase transition-all"
                  >
                    <Trash2 size={12} /> Delete Election
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT ELECTION MODAL */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-green-500/50 rounded-2xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(34,197,94,0.2)]">
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
              {showCreateModal ? 'Create New Election' : 'Edit Election Details'}
            </h3>
            <form onSubmit={showCreateModal ? handleCreateElection : handleUpdateElection} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 mb-1 text-[10px] font-black uppercase">Class Name</label>
                  <input required type="text" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-green-500 transition-all outline-none" value={formData.className} onChange={e => setFormData({ ...formData, className: e.target.value })} placeholder="e.g. BSC CS" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1 text-[10px] font-black uppercase">Section</label>
                  <input required type="text" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-green-500 transition-all outline-none" value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })} placeholder="e.g. A" />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1 text-[10px] font-black uppercase">Election Title</label>
                <input required type="text" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-green-500 transition-all outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Class Representative 2026" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1 text-[10px] font-black uppercase">Position</label>
                <input required type="text" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-green-500 transition-all outline-none" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} placeholder="e.g. CR" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 mb-1 text-[10px] font-black uppercase">Start Date</label>
                  <div className="relative">
                    <input
                      required
                      type="datetime-local"
                      className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-green-500 transition-all outline-none cursor-pointer [color-scheme:dark]"
                      onClick={(e) => e.target.showPicker?.()}
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1 text-[10px] font-black uppercase">End Date</label>
                  <div className="relative">
                    <input
                      required
                      type="datetime-local"
                      className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-green-500 transition-all outline-none cursor-pointer [color-scheme:dark]"
                      onClick={(e) => e.target.showPicker?.()}
                      value={formData.endDate}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-all">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-green-600 text-black rounded-xl font-black uppercase text-sm shadow-lg shadow-green-600/20 hover:bg-green-500 transition-all">
                  {showCreateModal ? 'Create Election' : 'Update Election'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CANDIDATE MODAL */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-purple-500/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(168,85,247,0.2)]">
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Add Candidate to {selectedElection?.title}</h3>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div>
                <label className="block text-gray-500 mb-1 text-[10px] font-black uppercase">Select Approved Student</label>
                <select
                  required
                  className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-purple-500 transition-all outline-none appearance-none"
                  value={candidateForm.studentId}
                  onChange={e => setCandidateForm({ ...candidateForm, studentId: e.target.value })}
                >
                  <option value="">-- Choose Candidate --</option>
                  {candidates.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.name} • {c.className || 'N/A'} {c.section || ''} • {c.position || 'No Position'}
                    </option>
                  ))}
                </select>
                {candidates.length === 0 && (
                  <p className="text-amber-500 text-xs mt-3 flex items-center gap-1 font-medium bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    <AlertCircle size={14} /> No approved candidates found.
                  </p>
                )}
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowAddCandidateModal(false)} className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-all">Cancel</button>
                <button type="submit" disabled={!candidateForm.studentId} className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-black uppercase text-sm shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-all disabled:opacity-30">Add Candidate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

