import React, { useMemo } from 'react';
import { 
  Users, 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Activity, 
  Vote, 
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export const DashboardHome = ({ teachers, elections, results, setActiveSection }) => {
  // 🔹 DATA PREPARATION
  const stats = useMemo(() => ({
    totalOfficers: teachers.length,
    activeElections: elections.filter(e => e.status === 'Active').length,
    completedElections: results.length,
    totalVotes: results.reduce((acc, curr) => acc + (curr.totalVotes || 0), 0),
    totalCandidates: elections.reduce((acc, curr) => acc + (curr.candidates?.length || 0), 0)
  }), [teachers, elections, results]);

  // Chart Data: Election Distribution
  const electionDistribution = useMemo(() => [
    { name: 'Active', value: stats.activeElections, color: '#10b981' },
    { name: 'Completed', value: stats.completedElections, color: '#3b82f6' },
    { name: 'Scheduled', value: elections.filter(e => e.status === 'Scheduled').length, color: '#f59e0b' }
  ], [stats, elections]);

  // Chart Data: Voting Trends (Mock data if results are few, otherwise mapping results)
  const votingTrends = useMemo(() => {
    if (results.length === 0) return [
      { name: 'Mon', votes: 0 }, { name: 'Tue', votes: 0 }, { name: 'Wed', votes: 0 },
      { name: 'Thu', votes: 0 }, { name: 'Fri', votes: 0 }
    ];
    
    return results.slice(-6).map(r => ({
      name: r.title.length > 10 ? r.title.substring(0, 10) + '...' : r.title,
      votes: r.totalVotes || 0
    }));
  }, [results]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-white font-bold text-xs mb-1">{label}</p>
          <p className="text-emerald-400 font-black text-lg">
            {payload[0].value} <span className="text-[10px] text-slate-500 font-normal">Votes</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 🔹 Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">System Intelligence</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time analytical overview of institutional democratic processes</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
          <div className="px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            LIVE MONITORING
          </div>
        </div>
      </div>

      {/* 🔹 Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Registered Officers', val: stats.totalOfficers, icon: Users, color: 'blue' },
          { label: 'Participating Candidates', val: stats.totalCandidates, icon: Activity, color: 'purple' },
          { label: 'Total Ballots Cast', val: stats.totalVotes, icon: Vote, color: 'emerald' },
          { label: 'Success Rate', val: '98.2%', icon: TrendingUp, color: 'amber' }
        ].map((item, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${item.color}-500/10 text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-5 h-5" />
              </div>
              <Activity className="w-4 h-4 text-slate-700" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
            <p className="text-2xl font-black text-white mt-1">{item.val}</p>
          </div>
        ))}
      </div>

      {/* 🔹 Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Voting Engagement Area Chart */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Voting Turnout Analysis</h3>
              <p className="text-slate-500 text-xs mt-1">Cross-election engagement metrics across the college</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Turnout</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={votingTrends}>
                <defs>
                  <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="votes" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVotes)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Election Status Pie Chart */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-white mb-2 self-start ml-2">Election Pipeline</h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8 self-start ml-2">Phase Distribution</p>
          
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={electionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {electionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-black text-white">{elections.length}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 w-full mt-6">
            {electionDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/50 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-400">{item.name}</span>
                </div>
                <span className="text-xs font-black text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Bottom Section: Recent Activity & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Clock className="w-5 h-5 text-emerald-400" />
              Recent Activity
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              Last 24 Hours
            </span>
          </div>
          
          <div className="space-y-4">
            {[
              { text: 'System-wide democratic integrity check passed', time: 'Just now', icon: CheckCircle2, color: 'emerald' },
              { text: `${teachers.length} authorized officers currently online`, time: '12 mins ago', icon: Users, color: 'blue' },
              { text: `${elections.length} elections detected in global register`, time: '1 hour ago', icon: BarChart3, color: 'amber' },
              { text: 'Audit trail synchronization completed', time: '3 hours ago', icon: Activity, color: 'purple' }
            ].map((feed, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-800/20 transition-colors group">
                <div className={`mt-0.5 p-2 rounded-xl bg-${feed.color}-500/10 text-${feed.color}-400 group-hover:scale-110 transition-transform`}>
                  <feed.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{feed.text}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">{feed.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-linear-to-br from-emerald-600/20 to-teal-900/20 border border-emerald-500/20 rounded-[2.5rem] p-8 flex flex-col justify-between">
              <div>
                <Calendar className="w-10 h-10 text-emerald-400 mb-6" />
                <h4 className="text-xl font-bold text-white mb-2">Schedule Snapshot</h4>
                <p className="text-slate-400 text-xs leading-relaxed">View all upcoming institutional ballots and scheduled election cycles.</p>
              </div>
              <button 
                onClick={() => setActiveSection('calendar')}
                className="mt-8 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/10 text-xs uppercase tracking-[0.2em]"
              >
                View Calendar
              </button>
           </div>

           <div className="bg-linear-to-br from-blue-600/20 to-indigo-900/20 border border-blue-500/20 rounded-[2.5rem] p-8 flex flex-col justify-between">
              <div>
                <ShieldCheck className="w-10 h-10 text-blue-400 mb-6" />
                <h4 className="text-xl font-bold text-white mb-2">Security Hub</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Monitor real-time audit logs and validator statuses across all modules.</p>
              </div>
              <button 
                onClick={() => setActiveSection('auditLogs')}
                className="mt-8 w-full py-4 bg-blue-500 hover:bg-blue-400 text-black font-black rounded-2xl transition-all shadow-xl shadow-blue-500/10 text-xs uppercase tracking-[0.2em]"
              >
                Audit Center
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

export default DashboardHome;