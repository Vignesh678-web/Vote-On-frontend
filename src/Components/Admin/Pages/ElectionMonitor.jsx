import React, { useEffect, useState } from 'react';
import { BarChart3, Clock, CheckCircle, Play, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

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
      alert("College election created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create election");
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
      alert(err.response?.data?.message || "Failed to start election");
    }
  };

  const handleDeclareResult = async (id) => {
    if (!window.confirm("Confirm ending election and declaring result?")) return;
    try {
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/elections/${id}/end`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchElections();
      alert("Results declared successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to declare result");
    }
  };

  if (loading) return <div className="p-10 text-center text-green-400 font-bold"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

  return (
    <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold text-green-400">Monitor Elections</h2>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-lg font-bold text-sm"
          >
            + Create College Election
          </button>
          <button
            onClick={fetchElections}
            className="text-xs text-green-400 hover:underline"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-green-500 rounded-2xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Create College Election</h3>
            <form onSubmit={handleCreateElection} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Election Title</label>
                <input required type="text" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Student Council President 2026" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Position</label>
                <input required type="text" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} placeholder="e.g. President" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">Start Date</label>
                  <input required type="datetime-local" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">End Date</label>
                  <input required type="datetime-local" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-green-600 text-black rounded-xl font-bold">Launch Election</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                      : 'bg-gray-700 text-gray-400'
                    }`}
                >
                  {election.status}
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
              </div>

              {election.status === 'Completed' && election.winner && (
                <div className="mt-2 text-center py-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-[10px] text-yellow-500 uppercase font-black">Winner</p>
                  <p className="text-white font-bold">{election.winner?.name}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ElectionMonitor;
