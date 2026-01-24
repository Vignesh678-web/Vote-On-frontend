import React, { useMemo, useState, useEffect } from 'react';
import { Users, Loader2, Search, Filter } from 'lucide-react';
import axios from 'axios';

export default function CandidateParticipationTracker() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state for filtering
  const [statusFilter, setStatusFilter] = useState('all'); // 'pending' | 'approved' | 'all'
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/candidates/get-candidates", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Backend returns array of candidate objects directly or in { candidates: [] }
      const data = Array.isArray(res.data) ? res.data : res.data.candidates || [];
      setCandidates(data);
    } catch (err) {
      console.error("Fetch candidates error:", err);
      setError("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/admin/candidates/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this candidate? They will be removed from candidates list.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/admin/candidates/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.message || "Rejection failed");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkApprove = async () => {
    if (selectedIds.size === 0) return;
    try {
      const token = localStorage.getItem("token");
      const ids = Array.from(selectedIds);
      // Sequential approvals (better to have bulk endpoint, but this works)
      for (const id of ids) {
        await axios.patch(`http://localhost:5000/api/admin/candidates/approve/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setSelectedIds(new Set());
      fetchCandidates();
      alert("Bulk approval successful");
    } catch (err) {
      alert("Bulk action failed partially");
    }
  };

  const filtered = useMemo(() => {
    return candidates
      .filter(c => {
        if (statusFilter === 'pending') return !c.isApproved;
        if (statusFilter === 'approved') return c.isApproved;
        return true;
      })
      .filter(c => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          c.name?.toLowerCase().includes(q) ||
          c.position?.toLowerCase().includes(q) ||
          c.className?.toLowerCase().includes(q)
        );
      });
  }, [candidates, statusFilter, search]);

  if (loading) return <div className="p-10 text-center text-green-400"><Loader2 className="animate-spin inline mr-2" /> Loading candidates...</div>;

  return (
    <div className="min-h-screen bg-black p-8" style={{ background: "linear-gradient(to bottom, #000000, #0a140a)" }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 flex items-center gap-3 mb-8">
          <Users className="w-8 h-8" />
          Candidate Participation Tracker
        </h1>

        {/* Filters */}
        <div className="bg-gray-900/80 border border-green-500/20 rounded-2xl p-6 shadow-2xl backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search candidates..."
                  className="bg-gray-800 border border-green-500/20 text-gray-300 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-green-500/50 w-64 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 bg-gray-800 border border-green-500/10 p-1 rounded-xl">
                {['all', 'pending', 'approved'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${statusFilter === s ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={selectedIds.size === 0}
              onClick={bulkApprove}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2"
            >
              Approve Selected ({selectedIds.size})
            </button>
          </div>
        </div>

        {/* Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
                No candidates found matching your criteria.
              </div>
            ) : (
              filtered.map(c => (
                <div key={c._id} className="bg-gray-900/60 border border-green-500/10 hover:border-green-500/30 rounded-2xl p-5 flex items-center justify-between transition-all group">
                  <div className="flex items-center gap-5">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c._id)}
                      onChange={() => toggleSelect(c._id)}
                      className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500 accent-green-500"
                    />
                    <div className="flex items-center gap-4">
                      {c.photoUrl ? (
                        <img src={c.photoUrl} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-green-500/20" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-800 border border-green-500/10 flex items-center justify-center text-green-500 font-bold">
                          {c.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-white font-bold text-lg">{c.name}</div>
                        <div className="text-green-500/80 text-sm font-semibold">{c.position} • {c.className || 'College'} {c.section || ''}</div>
                        <div className={`text-[10px] uppercase font-black mt-1 ${c.isApproved ? 'text-blue-400' : 'text-amber-500'}`}>
                          {c.isApproved ? 'Approved' : 'Pending Review'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!c.isApproved ? (
                      <button
                        onClick={() => handleApprove(c._id)}
                        className="p-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500 hover:text-black transition-all"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReject(c._id)}
                        className="p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-900/80 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-400" />
                Participation Stats
              </h3>

              <div className="space-y-4">
                <StatItem label="Total Nominees" value={candidates.length} />
                <StatItem label="Approved Candidates" value={candidates.filter(c => c.isApproved).length} color="text-blue-400" />
                <StatItem label="Pending Approvals" value={candidates.filter(c => !c.isApproved).length} color="text-amber-500" />
                <StatItem label="Class Nominees" value={candidates.filter(c => c.className).length} />
              </div>

              <div className="mt-8 pt-6 border-t border-green-500/10">
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  Note: Candidates marked as "College" are nominated by Admin for institution-wide positions.
                </p>
              </div>
            </div>

            <div className="bg-green-950/20 border border-green-500/20 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-2">Quick Tip</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                You can bulk-approve candidates by checking their boxes and using the primary action button at the top.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatItem = ({ label, value, color = 'text-green-400' }) => (
  <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

