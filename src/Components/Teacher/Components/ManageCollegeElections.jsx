import React, { useState, useEffect } from "react";
import axios from "axios";
import { Vote, Plus, Play, Square, UserCheck, Calendar, Trophy, AlertCircle, Search } from "lucide-react";

export default function ManageCollegeElections() {
  const [elections, setElections] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    minAttendanceRequired: 75
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch only college elections
      const electionRes = await axios.get("http://localhost:5000/api/elections?type=college", { headers });
      setElections(electionRes.data.elections || []);

      // Fetch class winners
      const winnersRes = await axios.get("http://localhost:5000/api/elections/class-winners", { headers });
      setWinners(winnersRes.data.winners || []);

    } catch (err) {
      console.error("Failed to fetch college election data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/elections/create", {
        ...formData,
        type: 'college'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCreateModal(false);
      setFormData({
        title: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        minAttendanceRequired: 75
      });
      fetchData();
      alert("College election created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create election");
    }
  };

  const handleAddWinnerToElection = async (studentId) => {
    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/elections/add-college-candidate",
        {
          electionId: selectedElection._id,
          studentId: studentId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddCandidateModal(false);
      fetchData();
      alert("Candidate added to college election successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add candidate");
    }
  };

  const handleStartElection = async (electionId) => {
    if (!window.confirm("Start this college-level election? All students will be able to vote.")) return;
    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/elections/${electionId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start election");
    }
  };

  const handleEndElection = async (electionId) => {
    if (!window.confirm("End this college election and declare the winner?")) return;
    try {
      const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/elections/${electionId}/end`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to end election");
    }
  };

  const filteredWinners = winners.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-purple-400 p-6">Accessing College Election Vault...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
            <Trophy className="w-8 h-8 text-purple-400" />
            College Elections
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage institution-wide voting and promote class winners</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
        >
          <Plus size={20} /> New College Election
        </button>
      </div>

      <div className="grid gap-6">
        {elections.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
            <AlertCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No College Elections Found</h3>
            <p className="text-gray-600 max-w-sm mx-auto">Create a new institution-wide election to get started.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20"
            >
              Initialize First Election
            </button>
          </div>
        ) : (
          elections.map((election) => (
            <div key={election._id} className="bg-gray-900 border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all shadow-xl">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{election.title}</h3>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      election.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      election.status === 'Completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                      'bg-gray-800 text-gray-500 border border-gray-700'
                    }`}>
                      {election.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-6">
                    <div className="bg-black/40 p-3 rounded-xl border border-gray-800">
                      <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Position</p>
                      <p className="text-white font-bold">{election.position}</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-gray-800">
                      <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Schedule</p>
                      <p className="text-gray-300 text-xs">
                        {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                       Candidates <span className="text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded text-[10px]">{election.candidates.length}</span>
                    </p>
                    {election.candidates.length === 0 ? (
                      <div className="bg-black/20 border border-dashed border-gray-800 rounded-xl p-4 text-center text-gray-600 italic text-sm">
                        No candidates promoted to this election yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {election.candidates.map((c, i) => (
                          <div key={i} className="flex items-center gap-3 bg-gray-800/40 border border-gray-800 p-3 rounded-xl group hover:border-purple-500/30 transition-all">
                             <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-700">
                                {c.student?.photoUrl ? (
                                  <img src={c.student.photoUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                                    {c.student?.name?.[0]}
                                  </div>
                                )}
                             </div>
                             <div>
                               <p className="text-white font-bold text-sm leading-tight">{c.student?.name || "Candidate"}</p>
                               <p className="text-purple-400 text-[10px] font-bold mt-0.5 uppercase">{c.student?.className} {c.student?.section}</p>
                             </div>
                             <div className="ml-auto text-right pr-2">
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Votes</p>
                                <p className="text-green-400 font-black text-sm">{c.votesCount || 0}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:w-64">
                  {(election.status === 'Draft' || election.status === 'Scheduled') && (
                    <>
                      <button
                        onClick={() => { setSelectedElection(election); setShowAddCandidateModal(true); }}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all active:scale-95"
                      >
                        <UserCheck size={16} /> Promote Winner
                      </button>
                      
                      <button
                        disabled={election.candidates.length < 2}
                        onClick={() => handleStartElection(election._id)}
                        className="w-full py-4 bg-green-600/10 text-green-400 border border-green-500/30 hover:bg-green-600/20 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-20"
                      >
                        <Play size={16} /> Open College Polls
                      </button>
                    </>
                  )}
                  
                  {election.status === 'Active' && (
                    <button
                      onClick={() => handleEndElection(election._id)}
                      className="w-full py-4 bg-red-600/10 text-red-500 border border-red-500/30 hover:bg-red-600/20 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                      <Square size={16} /> End & Declare College Winner
                    </button>
                  )}

                  {election.status === 'Completed' && election.winner && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-2xl text-center shadow-xl shadow-yellow-500/5">
                      <Trophy size={40} className="text-yellow-500 mx-auto mb-3" />
                      <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">College Representative</p>
                      <p className="text-white font-black text-xl tracking-tight leading-tight">{election.winner.name}</p>
                      <p className="text-gray-500 text-[10px] mt-2 font-bold uppercase">{election.winner.className} {election.winner.section}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE ELECTION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-purple-500/50 rounded-2xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(168,85,247,0.2)]">
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
              Create College Election
            </h3>
            <form onSubmit={handleCreateElection} className="space-y-4">
              <div>
                <label className="block text-gray-500 mb-1 text-[10px] font-black uppercase">Election Title</label>
                <input required type="text" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-purple-500 transition-all outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Student Council President 2026" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1 text-[10px] font-black uppercase">Position</label>
                <input required type="text" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-purple-500 transition-all outline-none" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} placeholder="e.g. President" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 mb-1 text-[10px] font-black uppercase">Start Date</label>
                  <input required type="datetime-local" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-purple-500 transition-all outline-none [color-scheme:dark]" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1 text-[10px] font-black uppercase">End Date</label>
                  <input required type="datetime-local" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-purple-500 transition-all outline-none [color-scheme:dark]" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-all">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-black uppercase text-sm shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-all">
                  Launch Election
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROMOTE WINNER MODAL */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-purple-500/50 rounded-3xl p-8 max-w-2xl w-full shadow-[0_0_100px_rgba(168,85,247,0.15)] max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Promote to College Election</h3>
                <p className="text-gray-500 text-sm">Select a class election winner to add to "{selectedElection?.title}"</p>
              </div>
              <button 
                onClick={() => setShowAddCandidateModal(false)}
                className="p-2 bg-gray-800 text-gray-400 rounded-full hover:bg-gray-700 transition-all"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search winners by name or class..."
                className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-purple-500 transition-all outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {filteredWinners.length === 0 ? (
                <div className="py-12 text-center text-gray-600">
                   No eligible winners found matching your search.
                </div>
              ) : (
                filteredWinners.map(winner => {
                  const isAlreadyCandidate = selectedElection.candidates.some(c => (c.student?._id || c.student) === winner._id);
                  
                  return (
                    <div key={winner._id} className="flex items-center gap-4 bg-black/40 border border-gray-800 p-4 rounded-2xl group hover:border-purple-500/40 transition-all">
                       <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 border-2 border-gray-700">
                          {winner.photoUrl ? (
                            <img src={winner.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-600">
                              {winner.name[0]}
                            </div>
                          )}
                       </div>
                       <div className="flex-1">
                         <h4 className="text-white font-bold">{winner.name}</h4>
                         <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase">Winner: {winner.position}</span>
                           <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-bold uppercase">{winner.className} - {winner.section}</span>
                         </div>
                       </div>
                       <button
                         disabled={isAlreadyCandidate}
                         onClick={() => handleAddWinnerToElection(winner._id)}
                         className={`px-6 py-2 rounded-xl font-bold text-xs uppercase transition-all ${
                           isAlreadyCandidate 
                           ? "bg-gray-800 text-gray-600 cursor-not-allowed" 
                           : "bg-purple-600 text-white hover:bg-purple-500 active:scale-95"
                         }`}
                       >
                         {isAlreadyCandidate ? "Already Added" : "Select Winner"}
                       </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
