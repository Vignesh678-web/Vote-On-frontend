import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  MoreVertical,
  Mail,
  Building2,
  Lock,
  Loader2,
  Trash2,
  Ban,
  CheckCircle,
  Filter,
  RefreshCw,
  Plus,
  X,
  TrendingUp
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const FacultyManagement = ({ refreshData }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    facultyId: '',
    Name: '',
    department: '',
    password: '',
    email: '',
    role: 'returning_officer',
    className: '',
    section: ''
  });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/teacher/all", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const mapped = (res.data.teachers || []).map(t => ({
        ...t,
        name: t.Name || t.name,
        status: t.isBlocked ? "Blocked" : "Active"
      }));

      setTeachers(mapped);
      if (refreshData) refreshData();
    } catch (err) {
      toast.error("Failed to sync faculty records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleToggleBlock = async (teacherId, currentStatus) => {
    try {
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/teacher/toggle-block/${teacherId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(currentStatus === "Active" ? "Officer Access Suspended" : "Officer Access Restored");
      fetchTeachers();
      if (refreshData) refreshData();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!formData.facultyId || !formData.Name || !formData.password) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/admin/teacher/create",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`${formData.Name} added to faculty`);
      setFormData({ 
        facultyId: '', 
        Name: '', 
        department: '', 
        password: '', 
        email: '', 
        role: 'returning_officer',
        className: '',
        section: ''
      });
      setShowAddForm(false);
      fetchTeachers();
      if (refreshData) refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.facultyId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "active" && !t.isBlocked) ||
                         (filterStatus === "blocked" && t.isBlocked);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: teachers.length,
    active: teachers.filter(t => !t.isBlocked).length,
    blocked: teachers.filter(t => t.isBlocked).length
  };

  return (
    <div className="min-h-screen pb-12 space-y-8 animate-in fade-in duration-500">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Faculty Officers</h1>
          <p className="text-slate-400 mt-1">Manage institutional and departmental election supervisors</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
            showAddForm 
            ? 'bg-slate-800 text-slate-300 border border-slate-700' 
            : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
          }`}
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showAddForm ? "Close Form" : "Register Officer"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Officers', val: stats.total, icon: Users, color: 'blue' },
          { label: 'Active Supervisors', val: stats.active, icon: ShieldCheck, color: 'emerald' },
          { label: 'Suspended Access', val: stats.blocked, icon: ShieldAlert, color: 'rose' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm group hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2.5 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-white mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Registration Form (Conditionally Rendered) */}
      {showAddForm && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <UserPlus className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Officer Registration</h2>
              <p className="text-slate-500 text-sm">Create a new administrative supervisor profile</p>
            </div>
          </div>

          <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Faculty ID *</label>
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400" />
                <input 
                  required
                  type="text"
                  placeholder="e.g. FAC8821"
                  value={formData.facultyId}
                  onChange={e => setFormData({...formData, facultyId: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name *</label>
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400" />
                <input 
                  required
                  type="text"
                  placeholder="e.g. Dr. Sarah Johnson"
                  value={formData.Name}
                  onChange={e => setFormData({...formData, Name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Department</label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400" />
                <input 
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400" />
                <input 
                  type="email"
                  placeholder="sarah.j@college.edu"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value.toLowerCase()})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Access Password *</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400" />
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Authority Role *</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400" />
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="returning_officer">Returning Officer</option>
                  <option value="teacher">Class Teacher</option>
                </select>
              </div>
            </div>

            {formData.role === 'teacher' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Class Assignment</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. BCA"
                    value={formData.className}
                    onChange={e => setFormData({...formData, className: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Section</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. A"
                    value={formData.section}
                    onChange={e => setFormData({...formData, section: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </>
            )}

            <div className="flex items-end">
              <button 
                disabled={isSubmitting}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                Register Faculty Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400" />
          <input 
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-12 pr-4 text-white outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            {['all', 'active', 'blocked'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filterStatus === status 
                  ? 'bg-emerald-500 text-black' 
                  : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button 
            onClick={fetchTeachers}
            className="p-2.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading && 'animate-spin'}`} />
          </button>
        </div>
      </div>

      {/* Officers List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Profile Info</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Department</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Officer Credentials</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Account Status</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading && filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Syncing with encrypted servers...</p>
                  </td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="bg-slate-950 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-800">
                      <Search className="w-6 h-6 text-slate-700" />
                    </div>
                    <p className="text-slate-400 font-bold text-lg">No officers found</p>
                    <p className="text-slate-600 text-sm mt-1">Try broadening your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=10b981&color=000&bold=true`}
                            alt={teacher.name}
                            className="w-10 h-10 rounded-xl"
                          />
                          {!teacher.isBlocked && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{teacher.name}</p>
                          <p className="text-[10px] text-emerald-500/80 font-black uppercase tracking-widest mt-0.5">
                            {teacher.role === 'returning_officer' ? 'Returning Officer' : 'Class Teacher'}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" /> {teacher.email || 'No email provided'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold rounded-lg uppercase tracking-wider">
                        {teacher.department || 'GLOBAL'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-slate-300">ID: {teacher.facultyId}</p>
                      <p className="text-[10px] text-slate-600 uppercase font-black mt-1">Hashed Integrity Verified</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        teacher.isBlocked 
                        ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${teacher.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        {teacher.isBlocked ? 'Access Restricted' : 'Active Privileges'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleToggleBlock(teacher._id, teacher.status)}
                          className={`p-2 rounded-xl border transition-all ${
                            teacher.isBlocked 
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white'
                          }`}
                          title={teacher.isBlocked ? "Restore Access" : "Suspend Access"}
                        >
                          {teacher.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>
                        <button className="p-2 bg-slate-950 border border-slate-800 text-slate-500 hover:text-white rounded-xl hover:border-slate-700 transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination/Footer */}
        <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing {filteredTeachers.length} unique faculty records</p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-not-allowed">
              Previous
            </button>
            <button disabled className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyManagement;
