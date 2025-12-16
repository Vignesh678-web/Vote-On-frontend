// components/students/StudentsTable.jsx
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const StudentsTable = ({ students }) => {
  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-4 px-4 text-gray-600 font-bold text-sm">Student Name</th>
            <th className="text-left py-4 px-4 text-gray-600 font-bold text-sm">Admission No</th>
            <th className="text-left py-4 px-4 text-gray-600 font-bold text-sm">Attendance</th>
            <th className="text-left py-4 px-4 text-gray-600 font-bold text-sm">Voting Status</th>
            <th className="text-left py-4 px-4 text-gray-600 font-bold text-sm">Eligibility</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 font-semibold text-gray-800">{student.name}</td>
              <td className="py-4 px-4 text-gray-600 text-sm">{student.admission}</td>
              <td className="py-4 px-4">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                  student.attendance >= 90 ? 'bg-emerald-100 text-emerald-700' : 
                  student.attendance >= 75 ? 'bg-blue-100 text-blue-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {student.attendance}%
                </span>
              </td>
              <td className="py-4 px-4">
                {student.hasVoted ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Voted
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
                    Not Voted
                  </span>
                )}
              </td>
              <td className="py-4 px-4">
                {student.eligible ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-sm font-bold shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Eligible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-full text-sm font-bold shadow-sm">
                    <XCircle className="w-3.5 h-3.5" />
                    Ineligible
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;