import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Vote, Plus, Play, Square, UserPlus, Calendar, Clock, AlertCircle, Edit2, Trash2, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  // TIE RESOLUTION STATES
  const [showTieModal, setShowTieModal] = useState(false);
  const [tiedElection, setTiedElection] = useState(null);
  const [tossing, setTossing] = useState(false);
  const [tossResult, setTossResult] = useState(null);

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
      toast.success("Election created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create election");
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
      toast.success("Election updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update election");
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

  const handleAddCandidate = async (e, directStudentId = null) => {
    if (e && e.preventDefault) e.preventDefault();

    const studentId = directStudentId || candidateForm.studentId;
    const position = directStudentId ? selectedElection.position : (candidateForm.position || selectedElection.position);

    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/teacher/class-election/add-candidate",
        {
          electionId: selectedElection._id,
          studentId: studentId,
          position: position
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddCandidateModal(false);
      fetchData();
      toast.success("Candidate added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add candidate");
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
      toast.success("Election started successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start election");
    }
  };

  const handleEndElection = async (electionId) => {
    if (!window.confirm("Are you sure you want to end this election and declare the winner?")) return;
    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/teacher/class-election/${electionId}/end`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.isTie) {
        setTiedElection({
          _id: electionId,
          title: res.data.message,
          candidates: res.data.tiedCandidates
        });
        setShowTieModal(true);
      } else {
        fetchData();
        toast.success("Election ended successfully.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to end election");
    }
  };

  const handlePerformToss = () => {
    setTossing(true);
    setTossResult(null);
    
    // Simulate toss animation
    setTimeout(() => {
      const candidates = tiedElection.candidates;
      const winner = candidates[Math.floor(Math.random() * candidates.length)];
      setTossResult(winner);
      setTossing(false);
    }, 2000);
  };

  const handleConfirmToss = async () => {
    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/elections/${tiedElection._id}/resolve-tie`,
        { winnerId: tossResult.studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowTieModal(false);
      setTossResult(null);
      setTiedElection(null);
      fetchData();
      toast.success("Tie resolved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resolve tie");
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
      toast.success("Election deleted permanently.");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete election");
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
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      election.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                      election.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' : 
                      election.status === 'Tie' ? 'bg-orange-500/20 text-orange-400 animate-pulse' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {election.status === 'Tie' ? 'Voting Deadlock (Tie)' : election.status}
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
                  {election.status === 'Tie' && (
                    <button
                      onClick={() => {
                        const sorted = [...election.candidates].sort((a,b) => b.votesCount - a.votesCount);
                        const winners = sorted.filter(c => c.votesCount === sorted[0].votesCount);
                        setTiedElection({
                          _id: election._id,
                          title: election.title,
                          candidates: winners.map(c => ({
                            studentId: c.student?._id || c.student,
                            name: c.student?.name || "Unknown",
                            votes: c.votesCount
                          }))
                        });
                        setShowTieModal(true);
                      }}
                      className="p-2 bg-orange-500 hover:bg-orange-400 text-black rounded-lg flex items-center gap-2 text-xs font-black uppercase transition-all shadow-lg shadow-orange-500/20"
                    >
                      <HelpCircle size={14} /> Break Tie (Toss)
                    </button>
                  )}
                  {election.status === 'Completed' && election.winner && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
                      <p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-1">
                        {election.candidates.filter(c => c.votesCount === election.candidates.find(wc => (wc.student?._id || wc.student) === (election.winner?._id || election.winner))?.votesCount).length > 1 
                          ? 'Toss Winner' 
                          : 'Declared Winner'}
                      </p>
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
      <AnimatePresence>
        {showAddCandidateModal && selectedElection && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-purple-500/50 rounded-[2.5rem] p-8 max-w-2xl w-full shadow-[0_0_100px_rgba(168,85,247,0.15)] max-h-[90vh] flex flex-col relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Add Nominee</h3>
                    <p className="text-slate-400 text-sm font-medium">Select an approved candidate for <span className="text-white font-bold">{selectedElection.title}</span></p>
                  </div>
                  <button 
                    onClick={() => setShowAddCandidateModal(false)}
                    className="p-2 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 transition-all border border-slate-700"
                  >
                    <Plus size={20} className="rotate-45" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {candidates.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                        <AlertCircle className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No Approved Candidates Found</p>
                      <p className="text-slate-600 text-[10px] mt-1">Candidates must meet attendance requirements and be approved by administration.</p>
                    </div>
                  ) : (
                    candidates
                      .filter(c => !selectedElection.candidates.some(ec => (ec.student?._id || ec.student) === c._id))
                      .map(candidate => (
                        <div key={candidate._id} className="flex items-center gap-4 bg-slate-950/50 border border-slate-800 p-4 rounded-3xl group hover:border-purple-500/40 transition-all">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-800 group-hover:border-purple-500/30 transition-all">
                            {candidate.photoUrl ? (
                              <img src={candidate.photoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-700">
                                {candidate.name[0]}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-bold tracking-tight">{candidate.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 font-black uppercase tracking-widest">{candidate.className}-{candidate.section}</span>
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-black uppercase tracking-widest">{candidate.attendence}% Attendance</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddCandidate(null, candidate._id)}
                            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-purple-600/20"
                          >
                            Add to Poll
                          </button>
                        </div>
                      ))
                  )}
                  
                  {candidates.length > 0 && candidates.filter(c => !selectedElection.candidates.some(ec => (ec.student?._id || ec.student) === c._id)).length === 0 && (
                     <div className="py-12 text-center">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">All candidates added</p>
                        <p className="text-slate-600 text-[10px] mt-1">Every approved candidate is already participating in this election.</p>
                     </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Election: {selectedElection.title}</p>
                  <button 
                    onClick={() => setShowAddCandidateModal(false)}
                    className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TIE RESOLUTION MODAL */}
      <AnimatePresence>
        {showTieModal && tiedElection && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-orange-500/50 rounded-[2.5rem] p-10 max-w-2xl w-full shadow-[0_0_100px_rgba(249,115,22,0.15)] relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/20 mb-6">
                  <HelpCircle className="w-10 h-10 text-orange-500" />
                </div>
                
                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Voting Deadlock Detected</h3>
                <p className="text-slate-400 text-sm font-medium mb-8">
                  The election for <span className="text-white font-bold">{tiedElection.title}</span> has resulted in an equal vote count.
                  System protocol requires a manual toss resolution by the Returning Officer.
                </p>

                {/* Tied Candidates */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {tiedElection.candidates.map((c) => (
                    <div key={c.studentId} className={`p-6 rounded-3xl border-2 transition-all duration-500 ${tossResult?.studentId === c.studentId ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-slate-950/50 border-slate-800'}`}>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Nominee</p>
                      <p className="text-xl font-bold text-white mb-2">{c.name}</p>
                      <div className="inline-flex items-center px-3 py-1 bg-slate-900 rounded-full border border-slate-800 text-orange-400 font-bold text-sm">
                        {c.votes} Votes
                      </div>
                    </div>
                  ))}
                </div>

                {/* Animation / Button Area */}
                <div className="flex flex-col items-center gap-6">
                  {tossing ? (
                    <div className="flex flex-col items-center gap-4">
                      <motion.div 
                        animate={{ rotateY: 360 }}
                        transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                        className="w-20 h-20 rounded-full bg-linear-to-br from-orange-400 to-amber-600 border-4 border-white/20 shadow-2xl flex items-center justify-center"
                      >
                        <span className="text-4xl">🪙</span>
                      </motion.div>
                      <p className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Tossing the coin...</p>
                    </div>
                  ) : tossResult ? (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="w-full space-y-6"
                    >
                      <div className="bg-emerald-500/20 border border-emerald-500/30 p-6 rounded-3xl">
                        <p className="text-emerald-400 font-black uppercase tracking-widest text-xs mb-2">Outcome</p>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">
                          Winner: {tossResult.name}
                        </h4>
                      </div>
                      
                      <div className="flex gap-4">
                        <button 
                          onClick={handleConfirmToss}
                          className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
                        >
                          Confirm & Declare Winner
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={handlePerformToss}
                      className="w-full py-5 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-[0.2em] rounded-3xl transition-all shadow-2xl shadow-orange-500/20 group"
                    >
                      Perform Tie-Breaker Toss
                    </button>
                  )}
                  
                  {!tossing && !tossResult && (
                    <button 
                      onClick={() => setShowTieModal(false)}
                      className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      Close Window
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

