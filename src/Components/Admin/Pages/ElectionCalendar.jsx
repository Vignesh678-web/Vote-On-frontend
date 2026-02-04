import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ElectionCalendar = ({ elections = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);

  // Map elections to dates
  const electionDates = elections.reduce((acc, election) => {
    if (election.startDate) {
      const dateKey = new Date(election.startDate).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(election);
    }
    return acc;
  }, {});

  const calendarDays = [];
  for (let i = 0; i < offset; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= days; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  const selectedElections = selectedDate ? electionDates[selectedDate.toDateString()] || [] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 🔹 Calendar Grid */}
      <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-emerald-400" />
              {monthNames[month]} {year}
            </h3>
            <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">Election Schedule Registry</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center py-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
              {day}
            </div>
          ))}
          {calendarDays.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} className="h-24" />;
            
            const isToday = date.toDateString() === new Date().toDateString();
            const dateKey = date.toDateString();
            const hasElections = electionDates[dateKey];
            const isSelected = selectedDate?.toDateString() === dateKey;

            return (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={dateKey}
                onClick={() => setSelectedDate(date)}
                className={`
                  h-24 rounded-2xl border transition-all relative flex flex-col p-3 text-left
                  ${isSelected ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}
                  ${isToday && !isSelected ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : ''}
                `}
              >
                <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-slate-400'} ${isToday && !isSelected ? 'text-emerald-400' : ''}`}>
                  {date.getDate()}
                </span>
                
                {hasElections && (
                  <div className="mt-auto flex flex-col gap-1">
                    {hasElections.slice(0, 2).map((el, idx) => (
                      <div key={idx} className={`h-1.5 rounded-full ${isSelected ? 'bg-white/40' : 'bg-emerald-500/40'}`} style={{ width: '100%' }} />
                    ))}
                    {hasElections.length > 2 && (
                      <span className={`text-[8px] font-bold ${isSelected ? 'text-indigo-200' : 'text-slate-600'}`}>
                        +{hasElections.length - 2} more
                      </span>
                    )}
                  </div>
                )}
                
                {isToday && !isSelected && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 🔹 Details Sidebar */}
      <div className="space-y-6">
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 h-full min-h-[400px] flex flex-col">
          <div className="mb-6">
            <h4 className="text-xl font-bold text-white">Daily Agenda</h4>
            <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">
              {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Select a date'}
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto">
            <AnimatePresence mode="wait">
              {selectedElections.length > 0 ? (
                selectedElections.map((election, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.1 }}
                    key={election._id}
                    className="bg-slate-950/50 border border-slate-800 p-5 rounded-2xl group hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                        {election.status}
                      </div>
                      <span className="text-slate-600 text-[10px] font-mono">#{election._id?.slice(-6)}</span>
                    </div>
                    
                    <h5 className="text-white font-bold mb-4 group-hover:text-emerald-400 transition-colors uppercase tracking-tight line-clamp-2">
                       {election.title}
                    </h5>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {new Date(election.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {election.candidates?.length || 0} Candidates
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {election.className} {election.section}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40"
                >
                  <CalendarIcon className="w-12 h-12 text-slate-600 mb-4" />
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-tighter">No Events Scheduled</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionCalendar;
