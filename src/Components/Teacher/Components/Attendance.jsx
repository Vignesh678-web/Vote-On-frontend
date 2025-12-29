// components/Attendance.jsx
import React from 'react';
import { Percent, CheckCircle, XCircle, Edit2, Save } from 'lucide-react';
import axios from 'axios';
import {useState, useEffect} from 'react';


const Attendance = ({ 
  classInfo = { className: "Unknown Class" }, 
  students = [], 
  editingAttendance, 
  setEditingAttendance, 
  handleAttendanceEdit, 
  saveAttendance 
}) => {
  return (
    <div className="min-h-screen bg-black p-6 space-y-6" style={{ background: 'linear-gradient(to bottom, #000000, #0a0f0a)' }}>
      
      {/* Header */}
      <div 
        className="bg-gray-900 rounded-xl shadow-sm p-6 border border-green-500/30"
        style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.15)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/40">
              <Percent className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                Manage Attendance
              </h3>
              <p className="text-sm text-green-400 font-semibold">
                {classInfo?.className || "Class Information Not Found"}
              </p>
            </div>
          </div>

          <div className="px-5 py-3 bg-green-500/10 border border-green-500/40 rounded-xl">
            <p className="text-sm text-green-400 font-bold flex items-center gap-2">
               Minimum 75% for eligibility
            </p>
          </div>
        </div>
      </div>


      {/* Attendance Table */}
      <div className="bg-gray-900 rounded-xl shadow-sm p-6 border border-green-500/30">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-green-500/20">
                <th className="py-4 text-green-400">Student</th>
                <th className="py-4 text-green-400">Admission No</th>
                <th className="py-4 text-green-400">Attendance</th>
                <th className="py-4 text-green-400">Status</th>
                <th className="py-4 text-green-400">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 py-5">
                     No students found
                  </td>
                </tr>
              ) : (
                students.map(student => (
                  <tr key={student?.id} className="border-b border-green-500/10">
                    <td className="py-4 text-white font-semibold">{student?.name}</td>
                    <td className="py-4 text-gray-400">{student?.admission}</td>

                    <td className="py-4">
                      {editingAttendance === student?.id ? (
                        <input 
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={student?.attendance}
                          onChange={(e) => handleAttendanceEdit(student?.id, e.target.value)}
                          className="w-20 px-3 py-2 bg-black/50 border-2 border-green-500 text-white rounded-lg"
                        />
                      ) : (
                        <span className="px-3 py-1 rounded-lg text-white">
                          {student?.attendance}%
                        </span>
                      )}
                    </td>

                    <td className="py-4">
                      {student?.attendance >= 75 ? (
                        <span className="text-green-400 flex items-center gap-1">
                          <CheckCircle size={16}/> Eligible
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1">
                          <XCircle size={16}/> Not Eligible
                        </span>
                      )}
                    </td>

                    <td className="py-4">
                      {editingAttendance === student?.id ? (
                        <button 
                          onClick={() => saveAttendance(student?.id)}
                          className="bg-green-600 px-4 py-2 rounded-lg text-black font-bold"
                        >
                          <Save size={16}/> Save
                        </button>
                      ) : (
                        <button 
                          onClick={() => setEditingAttendance(student?.id)}
                          className="text-green-400 font-bold"
                        >
                          <Edit2 size={16}/> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-orange-500/10 border border-orange-500 rounded-xl p-6">
        <p className="text-orange-300 text-sm">
           Students below 75% cannot become candidates.
        </p>
      </div>

    </div>
  );
};

export default Attendance;
