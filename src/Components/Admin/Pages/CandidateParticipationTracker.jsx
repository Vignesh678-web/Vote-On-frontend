import React, { useMemo, useState } from 'react';
import { Users } from 'lucide-react';

export default function CandidateParticipationTracker() {
  // example seed data — replace with your real data source if you have one
  const [candidates, setCandidates] = useState({
    class: [
      { id: 1, firstName: 'Arjun', lastName: 'K', position: 'President', approved: false },
      { id: 2, firstName: 'Maya', lastName: 'R', position: 'Secretary', approved: false },
    ],
    college: [
      { id: 11, firstName: 'Ravi', lastName: 'P', position: 'Treasurer', approved: false },
    ],
  });

  // UI state for filtering / bulk selection
  const [levelFilter, setLevelFilter] = useState('all'); // 'all' | 'class' | 'college'
  const [statusFilter, setStatusFilter] = useState('pending'); // 'pending' | 'approved' | 'all'
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const list = [];
    if (levelFilter === 'all' || levelFilter === 'class') {
      candidates.class.forEach(c => list.push({ ...c, level: 'class' }));
    }
    if (levelFilter === 'all' || levelFilter === 'college') {
      candidates.college.forEach(c => list.push({ ...c, level: 'college' }));
    }

    return list
      .filter(c => {
        if (statusFilter === 'pending') return !c.approved;
        if (statusFilter === 'approved') return c.approved;
        return true;
      })
      .filter(c => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.position.toLowerCase().includes(q)
        );
      });
  }, [candidates, levelFilter, statusFilter, search]);

  // Approve a single candidate. If candidate is in class and approved, move to college and mark approved.
  const approveCandidate = (candidate) => {
    if (candidate.level === 'class') {
      // remove from class, add to college as approved
      setCandidates(prev => ({
        class: prev.class.filter(c => c.id !== candidate.id),
        college: [...prev.college, { ...candidate, approved: true }]
      }));
      // also remove from selected set if present
      setSelectedIds(s => { const n = new Set(s); n.delete(candidate.id); return n; });
    } else {
      // mark approved in college list
      setCandidates(prev => ({
        ...prev,
        college: prev.college.map(c => c.id === candidate.id ? { ...c, approved: true } : c)
      }));
      setSelectedIds(s => { const n = new Set(s); n.delete(candidate.id); return n; });
    }
  };

  // Bulk approve
  const bulkApprove = () => {
    if (selectedIds.size === 0) return;

    // collect selected from both lists
    const sel = Array.from(selectedIds);
    // process class -> move to college
    setCandidates(prev => {
      const moving = prev.class.filter(c => sel.includes(c.id));
      const remainingClass = prev.class.filter(c => !sel.includes(c.id));
      const updatedCollege = prev.college.map(c => sel.includes(c.id) ? { ...c, approved: true } : c);

      // any moving candidates should be marked approved when moved
      const movedApproved = moving.map(c => ({ ...c, approved: true }));

      return {
        class: remainingClass,
        college: [...updatedCollege, ...movedApproved]
      };
    });

    setSelectedIds(new Set());
  };

  const revokeApproval = (candidate) => {
    // only allow revoking approval: for college candidates, set approved false
    if (candidate.level === 'college') {
      setCandidates(prev => ({
        ...prev,
        college: prev.college.map(c => c.id === candidate.id ? { ...c, approved: false } : c)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-green-400 text-center mb-8">🎓 Candidate Approval & Filter</h1>

        {/* Filters */}
        <div className="bg-gray-900 border border-green-500/30 rounded-lg p-4 shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-300">Level:</label>
              <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="bg-gray-800 border border-green-500/20 text-gray-300 px-3 py-2 rounded">
                <option value="all">All</option>
                <option value="class">Class</option>
                <option value="college">College</option>
              </select>

              <label className="text-sm text-gray-300 ml-4">Status:</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-800 border border-green-500/20 text-gray-300 px-3 py-2 rounded">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="all">All</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or position"
                className="bg-gray-800 border border-green-500/20 text-gray-300 px-3 py-2 rounded w-60"
              />

              <button onClick={bulkApprove} className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-3 rounded transition-colors">
                Approve Selected ({selectedIds.size})
              </button>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: filtered list */}
          <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-500/20">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold text-green-400">Filtered Candidates</h2>
              </div>
              <span className="text-gray-500 font-semibold">({filtered.length})</span>
            </div>

            <div className="space-y-3">
              {filtered.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No candidates match the filters</p>
              ) : (
                filtered.map(c => (
                  <div key={c.id} className="bg-gray-800 border border-green-500/20 rounded p-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} className="accent-green-400" />
                        <div>
                          <div className="text-gray-300 font-semibold">{c.firstName} {c.lastName}</div>
                          <div className="text-green-400 text-sm font-semibold">{c.position} • {c.level}</div>
                          <div className="text-sm text-gray-400">Status: {c.approved ? 'Approved' : 'Pending'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {!c.approved ? (
                        <button onClick={() => approveCandidate(c)} className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-3 rounded text-sm transition-colors">Approve</button>
                      ) : (
                        <button onClick={() => revokeApproval(c)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded text-sm transition-colors">Revoke</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: quick overview */}
          <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-500/20">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold text-green-400">Overview</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-gray-300">Class candidates: <span className="text-green-400 font-semibold">{candidates.class.length}</span></div>
              <div className="text-gray-300">College candidates: <span className="text-green-400 font-semibold">{candidates.college.length}</span></div>
              <div className="text-gray-300">Approved (college): <span className="text-green-400 font-semibold">{candidates.college.filter(c => c.approved).length}</span></div>
              <div className="text-gray-300">Pending (class): <span className="text-green-400 font-semibold">{candidates.class.filter(c => !c.approved).length}</span></div>

              <div className="pt-4 border-t border-green-500/20">
                <p className="text-gray-400 text-sm">Tip: select multiple candidates using the checkboxes and click <span className="text-green-300">Approve Selected</span> to bulk-approve (class - college or mark college approved).</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
