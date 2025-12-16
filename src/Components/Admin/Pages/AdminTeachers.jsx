import React, { useState } from "react";
import { Search, Trash2, Eye, UserCheck, Mail, Phone, Building } from "lucide-react";

export default function AdminTeachers({ teachers = [], onRemoveTeacher }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveTeacher = (id) => {
    if (onRemoveTeacher) {
      onRemoveTeacher(id);
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#00ff41]"
            style={{ textShadow: "0 0 20px rgba(0,255,65,0.5)" }}
          >
            Teachers Management
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            View and manage all teachers in the system
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#111111] border border-[#00ff41]/30 rounded-lg px-4 py-2">
            <span className="text-[#00ff41] font-bold text-lg">
              {teachers.length}
            </span>
            <span className="text-gray-400 text-sm ml-2">Teachers</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00ff41]/50"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, department, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] border border-[#00ff41]/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff41] transition-all"
            style={{ boxShadow: "0 0 10px rgba(0,255,65,0.1)" }}
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-[#111111] border border-[#00ff41]/20 rounded-xl p-4 sm:p-6 transition-all hover:border-[#00ff41]/60 hover:shadow-[0_0_20px_rgba(0,255,65,0.2)]"
          >
            {/* Teacher Header */}
            <div className="flex items-start gap-4 mb-4">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-[#00ff41]"
                style={{ boxShadow: "0 0 15px rgba(0,255,65,0.4)" }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">
                  {teacher.name}
                </h3>
                <p className="text-[#00ff41] text-sm font-semibold">
                  {teacher.subject}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-[#00ff41]/20 text-[#00ff41] text-xs rounded-full border border-[#00ff41]/30">
                    {teacher.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Teacher Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Building size={16} className="text-[#00ff41]/70" />
                <span>{teacher.department}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={16} className="text-[#00ff41]/70" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={16} className="text-[#00ff41]/70" />
                <span>{teacher.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <UserCheck size={16} className="text-[#00ff41]/70" />
                <span>{teacher.experience} experience</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTeacher(teacher)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 font-medium hover:bg-[#00ff41]/20 transition-all text-sm"
              >
                <Eye size={16} />
                View
              </button>
              <button
                onClick={() => setDeleteConfirm(teacher)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 font-medium hover:bg-red-500/20 transition-all text-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No teachers found matching your search.
          </p>
        </div>
      )}

      {/* View Teacher Modal */}
      {selectedTeacher && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTeacher(null)}
        >
          <div
            className="bg-[#111111] rounded-xl p-6 sm:p-8 w-full max-w-lg border border-[#00ff41]/40"
            style={{ boxShadow: "0 0 40px rgba(0,255,65,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2
                className="text-2xl font-bold text-[#00ff41]"
                style={{ textShadow: "0 0 15px rgba(0,255,65,0.3)" }}
              >
                Teacher Details
              </h2>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="text-[#00ff41] hover:text-[#00ff41]/70 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center text-center mb-6">
              <img
                src={selectedTeacher.image}
                alt={selectedTeacher.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-[#00ff41] mb-4"
                style={{ boxShadow: "0 0 25px rgba(0,255,65,0.5)" }}
              />
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedTeacher.name}
              </h3>
              <span className="px-3 py-1 bg-[#00ff41]/20 text-[#00ff41] text-sm rounded-full border border-[#00ff41]/30">
                {selectedTeacher.status}
              </span>
            </div>

            <div className="bg-[#0a0a0a] rounded-lg p-4 space-y-3 border border-[#00ff41]/20">
              <div className="flex items-center gap-3">
                <Building size={18} className="text-[#00ff41]" />
                <div>
                  <p className="text-gray-400 text-xs">Department</p>
                  <p className="text-white font-semibold">
                    {selectedTeacher.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <UserCheck size={18} className="text-[#00ff41]" />
                <div>
                  <p className="text-gray-400 text-xs">Subject</p>
                  <p className="text-white font-semibold">
                    {selectedTeacher.subject}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#00ff41]" />
                <div>
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-white font-semibold text-sm">
                    {selectedTeacher.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#00ff41]" />
                <div>
                  <p className="text-gray-400 text-xs">Phone</p>
                  <p className="text-white font-semibold">
                    {selectedTeacher.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <UserCheck size={18} className="text-[#00ff41]" />
                <div>
                  <p className="text-gray-400 text-xs">Experience</p>
                  <p className="text-white font-semibold">
                    {selectedTeacher.experience}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-[#111111] rounded-xl p-6 sm:p-8 w-full max-w-md border border-red-500/40"
            style={{ boxShadow: "0 0 40px rgba(239,68,68,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Confirm Removal
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to remove{" "}
              <span className="text-white font-bold">
                {deleteConfirm.name}
              </span>{" "}
              from the system? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-lg bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 font-medium hover:bg-[#00ff41]/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveTeacher(deleteConfirm.id)}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
                style={{ boxShadow: "0 0 20px rgba(239,68,68,0.4)" }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
