import { BarChart3, Clock, CheckCircle, Play, AlertCircle, Loader2, HelpCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const ElectionMonitor = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    minAttendanceRequired: 75
  });

  // TIE RESOLUTION STATES
  const [showTieModal, setShowTieModal] = useState(false);
  const [tiedElection, setTiedElection] = useState(null);
  const [tossing, setTossing] = useState(false);
  const [tossResult, setTossResult] = useState(null);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/elections", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setElections(res.data.elections || []);
    } catch (err) {
      console.error("Fetch elections error:", err);
      setError("Failed to load elections");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/elections/create", {
        ...formData,
        type: 'college'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCreateModal(false);
      fetchElections();
      toast.success("College election created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create election");
    }
  };

  const handleStartElection = async (id) => {
    try {
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/elections/${id}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchElections();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start election");
    }
  };

  const handleDeclareResult = async (id) => {
    if (!window.confirm("Confirm ending election and declaring result?")) return;
    try {
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/elections/${id}/end`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.isTie) {
        setTiedElection({
          _id: id,
          title: res.data.message,
          candidates: res.data.tiedCandidates
        });
        setShowTieModal(true);
      } else {
        fetchElections();
        toast.success("Results declared successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to declare result");
    }
  };

  const handlePerformToss = () => {
    setTossing(true);
    setTossResult(null);
    setTimeout(() => {
      const candidates = tiedElection.candidates;
      const winner = candidates[Math.floor(Math.random() * candidates.length)];
      setTossResult(winner);
      setTossing(false);
    }, 2000);
  };

  const handleConfirmToss = async () => {
    try {
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/elections/${tiedElection._id}/resolve-tie`,
        { winnerId: tossResult.studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowTieModal(false);
      setTossResult(null);
      setTiedElection(null);
      fetchElections();
      toast.success("Tie resolved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resolve tie");
    }
  };

  const userRole = localStorage.getItem("role");
  const isReadOnly = userRole === 'admin'; // Admin is strictly read-only as requested

  if (loading) return <div className="p-10 text-center text-green-400 font-bold"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

  return (
    <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold text-green-400">{isReadOnly ? 'Election Monitor (View Only)' : 'Conduct Elections'}</h2>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchElections}
            className="text-xs text-green-400 hover:underline"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {elections.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-800/50 rounded-lg">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
            No elections found
          </div>
        ) : (
          elections.map((election) => (
            <div
              key={election._id}
              className="bg-gray-800 border border-green-500/20 rounded-xl p-5 hover:border-green-500/40 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{election.title}</h3>
                    <span className="bg-purple-900/50 text-purple-400 text-[10px] px-1.5 rounded border border-purple-800">{election.type}</span>
                  </div>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(election.startDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${election.status === 'Active'
                    ? 'bg-green-500/20 text-green-400'
                    : election.status === 'Completed'
                      ? 'bg-blue-500/20 text-blue-400'
                      : election.status === 'Tie'
                        ? 'bg-orange-500/20 text-orange-400 animate-pulse'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                >
                  {election.status === 'Tie' ? 'Tie Detected' : election.status}
                </span>
              </div>

              <div className="space-y-3 mb-5">
                {election.candidates.map((c, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{c.student?.name || 'Unknown'}</span>
                      <span className="text-green-400 font-bold">{c.votesCount} votes</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full"
                        style={{ width: `${election.totalVotes > 0 ? (c.votesCount / election.totalVotes) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {!isReadOnly && (
                <div className="flex gap-2">
                  {election.status === 'Scheduled' && (
                    <button
                      onClick={() => handleStartElection(election._id)}
                      className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <Play size={14} /> Start Now
                    </button>
                  )}
                  {election.status === 'Active' && (
                    <button
                      onClick={() => handleDeclareResult(election._id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={14} /> Declare Result
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
                      className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <HelpCircle size={14} /> Break Tie (Toss)
                    </button>
                  )}
                </div>
              )}

              {election.status === 'Completed' && election.winner && (
                <div className="mt-2 text-center py-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-[10px] text-yellow-500 uppercase font-black">
                    {election.candidates.filter(c => c.votesCount === election.candidates.find(wc => (wc.student?._id || wc.student) === (election.winner?._id || election.winner))?.votesCount).length > 1 
                      ? 'Winner (Via Toss)' 
                      : 'Winner'}
                  </p>
                  <p className="text-white font-bold">{election.winner?.name}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* TIE RESOLUTION MODAL */}
      <AnimatePresence>
        {showTieModal && tiedElection && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-orange-500/50 rounded-[2.5rem] p-10 max-w-2xl w-full shadow-[0_0_100px_rgba(249,115,22,0.15)] relative overflow-hidden"
            >
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/20 mb-6 font-sans">
                  <HelpCircle className="w-10 h-10 text-orange-500" />
                </div>
                
                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Voting Deadlock</h3>
                <p className="text-slate-400 text-sm font-medium mb-8">
                  Election <span className="text-white font-bold">{tiedElection.title}</span> is tied.
                  Break the tie with a protocol toss.
                </p>

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

                <div className="flex flex-col items-center gap-6">
                  {tossing ? (
                    <div className="flex flex-col items-center gap-4">
                      <motion.div 
                        animate={{ rotateY: 360 }}
                        transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                        className="w-20 h-20 rounded-full bg-linear-to-br from-orange-400 to-amber-600 border-4 border-white/20 shadow-2xl flex items-center justify-center"
                      >
                        <span className="text-4xl text-center">🪙</span>
                      </motion.div>
                      <p className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Tossing...</p>
                    </div>
                  ) : tossResult ? (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="w-full space-y-6"
                    >
                      <div className="bg-emerald-500/20 border border-emerald-500/30 p-6 rounded-3xl">
                        <p className="text-emerald-400 font-black uppercase tracking-widest text-xs mb-2 text-center font-sans">Outcome</p>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight text-center">
                          Winner: {tossResult.name}
                        </h4>
                      </div>
                      
                      <div className="flex gap-4">
                        <button 
                          onClick={handleConfirmToss}
                          className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest text-sm font-sans hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
                        >
                          Confirm Winner
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={handlePerformToss}
                      className="w-full py-5 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-[0.2em] rounded-3xl transition-all shadow-2xl shadow-orange-500/20 font-sans"
                    >
                      Perform Tie-Breaker Toss
                    </button>
                  )}
                  
                  {!tossing && !tossResult && (
                    <button 
                      onClick={() => setShowTieModal(false)}
                      className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest font-sans"
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
};

export default ElectionMonitor;
