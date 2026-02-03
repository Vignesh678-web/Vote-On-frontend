import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Shield, 
  User as UserIcon, 
  Calendar, 
  Activity, 
  Download,
  AlertCircle,
  RefreshCw,
  Clock,
  ExternalLink,
  Loader2,
  Trash2,
  Lock,
  Vote,
  UserPlus,
  Ban
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admintoken') || 
                    localStorage.getItem('teachertoken') || 
                    localStorage.getItem('token');
      
      console.log('[AUDIT] Attempting fetch. Token exists:', !!token);

      if (!token) {
        toast.error('Identity verification failed. Please login again.');
        setLoading(false);
        return;
      }

      const activeToken = token || localStorage.getItem('token');
      const moduleParam = filterModule !== 'all' ? `&module=${filterModule.toUpperCase()}` : '';
      
      const res = await axios.get(`http://localhost:5000/api/admin/audit?page=${page}${moduleParam}`, {
        headers: { 
          'Authorization': `Bearer ${activeToken}`,
          'Accept': 'application/json'
        }
      });
      
      setLogs(res.data.logs || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || 1);
    } catch (err) {
      console.error('[AUDIT] API Response Error:', err.response?.data);
      const msg = err.response?.data?.message || 'Failed to sync system audit trail';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterModule]);

  const getLogIcon = (action) => {
    if (action.includes('LOGIN')) return <Lock className="w-4 h-4 text-amber-400" />;
    if (action.includes('CREATE') || action.includes('ADD')) return <UserPlus className="w-4 h-4 text-emerald-400" />;
    if (action.includes('BLOCK') || action.includes('REJECT')) return <Ban className="w-4 h-4 text-rose-400" />;
    if (action.includes('VOTE')) return <Vote className="w-4 h-4 text-blue-400" />;
    return <Activity className="w-4 h-4 text-slate-400" />;
  };

  const getModuleColor = (module) => {
    switch (module.toUpperCase()) {
      case 'ELECTION': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'CANDIDATE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'AUTH': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'STUDENT': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'SYSTEM': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'TEACHER': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'VOTE': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const filteredLogs = logs.filter(log => 
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-12 space-y-8 animate-in fade-in duration-500">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <HistoryIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Audit Logs</h1>
          </div>
          <p className="text-slate-400">Security trail and system-wide activity monitoring</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchLogs(currentPage)}
            className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 rounded-xl transition-all"
            title="Refresh logs"
          >
            <RefreshCw className={`w-5 h-5 ${loading && 'animate-spin'}`} />
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text"
              placeholder="Filter by action, user, or specific details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto max-w-full no-scrollbar">
            {['all', 'election', 'candidate', 'auth', 'student', 'teacher', 'vote', 'system'].map((mod) => (
              <button
                key={mod}
                onClick={() => {
                  setFilterModule(mod);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filterModule === mod 
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Module</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Action & Subject</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Performed By</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Decrypting security logs...</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center">
                    <div className="bg-slate-950 bg-indigo-500/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/10">
                      <Search className="w-8 h-8 text-indigo-900" />
                    </div>
                    <p className="text-white font-bold text-xl">No logs detected</p>
                    <p className="text-slate-500 mt-2">No activity matches your current filtering criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-indigo-500/[0.02] group transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-slate-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-300">{new Date(log.timestamp).toLocaleDateString()}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{new Date(log.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${getModuleColor(log.module)}`}>
                        {log.module}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 bg-slate-950 rounded-lg group-hover:bg-indigo-500/10 transition-colors">
                          {getLogIcon(log.action)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors capitalize">
                            {log.action.replace(/_/g, ' ')}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed max-w-md">
                            {log.details}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                          {log.performedBy.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="text-xs font-bold text-slate-300 uppercase">{log.performedBy}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                        log.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                        log.role === 'teacher' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        <Shield className="w-2.5 h-2.5" />
                        {log.role}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="px-6 py-5 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
             Analyzed <span className="text-white">{logs.length}</span> security events in this view
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => fetchLogs(currentPage - 1)}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white rounded-xl text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <div className="flex items-center gap-1 mx-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchLogs(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1 
                    ? 'bg-indigo-500 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => fetchLogs(currentPage + 1)}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white rounded-xl text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
