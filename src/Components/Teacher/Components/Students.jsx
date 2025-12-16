// components/Students.jsx
import React, { useState } from 'react';
import { Users, Upload, Award, X, Plus } from 'lucide-react';

const Students = ({
  classInfo = {},
  students = [],
  fileInputRef,
  handleFileUpload,
  onNominateCandidate,
  onRegisterStudent
}) => {

  const safeStudents = Array.isArray(students) ? students : [];
  const [activeFilter, setActiveFilter] = useState('all');
  const [showNominationModal, setShowNominationModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [position, setPosition] = useState('');
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    admission: '',
    attendance: ''
  });

  // Safe default for onNominateCandidate and onRegisterStudent
  const handleNominateCandidate = onNominateCandidate || (() => {
    console.warn('onNominateCandidate function not provided');
  });

  const handleRegisterStudent = onRegisterStudent || (() => {
    console.warn('onRegisterStudent function not provided');
  });

  const submitRegistration = () => {
    if (!newStudent.firstName.trim() || !newStudent.lastName.trim()) {
      alert('Please enter first name and last name');
      return;
    }
    if (!newStudent.admission.trim()) {
      alert('Please enter admission number');
      return;
    }
    if (!newStudent.attendance || isNaN(newStudent.attendance)) {
      alert('Please enter a valid attendance percentage');
      return;
    }

    const attendance = parseFloat(newStudent.attendance);
    if (attendance < 0 || attendance > 100) {
      alert('Attendance must be between 0 and 100');
      return;
    }

    const studentData = {
      id: `student-${Date.now()}`,
      name: `${newStudent.firstName.trim()} ${newStudent.lastName.trim()}`,
      admission: newStudent.admission.trim(),
      attendance: attendance,
      eligible: attendance >= 75
    };

    handleRegisterStudent(studentData);
    
    setShowRegistrationModal(false);
    setNewStudent({
      firstName: '',
      lastName: '',
      admission: '',
      attendance: ''
    });
    alert('Student registered successfully!');
  };

  const handleNominate = (student) => {
    if (!student.eligible) {
      alert('This student is not eligible due to low attendance (below 75%)');
      return;
    }
    setSelectedStudent(student);
    setShowNominationModal(true);
  };

  const submitNomination = () => {
    if (!position.trim()) {
      alert('Please enter a position');
      return;
    }
    if (!selectedStudent) {
      alert('No student selected');
      return;
    }

    // Call the nomination function safely
    handleNominateCandidate({
      id: `cand-${Date.now()}`,
      name: selectedStudent.name,
      admission: selectedStudent.admission,
      attendance: selectedStudent.attendance,
      position: position.trim(),
      status: 'pending'
    });

    setShowNominationModal(false);
    setSelectedStudent(null);
    setPosition('');
    alert('Student nominated successfully!');
  };

  const filteredStudents = students.filter(s => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'eligible') return s.eligible;
    if (activeFilter === 'ineligible') return !s.eligible;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-green-400" />
            Manage Students
          </h2>
          <p className="text-gray-400 mt-2 font-medium">{classInfo.className}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRegistrationModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-bold w-fit border border-blue-400/50 group"
            style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)' }}
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Register Student
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
            activeFilter === 'all'
              ? 'bg-green-600 text-black border-green-400/50'
              : 'bg-gray-800 text-gray-400 border-green-500/20 hover:border-green-500/40 hover:text-green-400'
          }`}
          style={activeFilter === 'all' ? { boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' } : {}}
        >
          All Students ({students.length})
        </button>
        <button
          onClick={() => setActiveFilter('eligible')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
            activeFilter === 'eligible'
              ? 'bg-green-600 text-black border-green-400/50'
              : 'bg-gray-800 text-gray-400 border-green-500/20 hover:border-green-500/40 hover:text-green-400'
          }`}
          style={activeFilter === 'eligible' ? { boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' } : {}}
        >
          Eligible ({students.filter(s => s.eligible).length})
        </button>
        <button
          onClick={() => setActiveFilter('ineligible')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
            activeFilter === 'ineligible'
              ? 'bg-red-600 text-white border-red-400/50'
              : 'bg-gray-800 text-gray-400 border-green-500/20 hover:border-red-500/40 hover:text-red-400'
          }`}
          style={activeFilter === 'ineligible' ? { boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' } : {}}
        >
          Ineligible ({students.filter(s => !s.eligible).length})
        </button>
      </div>

      {/* Students Table with Nominate Action */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-green-500 rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 0 40px rgba(34, 197, 94, 0.3)' }}>
        <table className="w-full">
          <thead>
            <tr className="bg-green-500/10 border-b border-green-500/30">
              <th className="px-6 py-4 text-left text-green-400 font-bold">Name</th>
              <th className="px-6 py-4 text-left text-green-400 font-bold">Admission No</th>
              <th className="px-6 py-4 text-left text-green-400 font-bold">Attendance</th>
              <th className="px-6 py-4 text-left text-green-400 font-bold">Status</th>
              <th className="px-6 py-4 text-left text-green-400 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id} className="border-b border-green-500/10 hover:bg-green-500/5 transition-all">
                <td className="px-6 py-4 text-white font-medium">{student.name}</td>
                <td className="px-6 py-4 text-gray-300">{student.admission}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${
                    student.attendance >= 90
                      ? 'bg-green-500/20 text-green-400 border-green-500/40'
                      : student.attendance >= 75
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      : 'bg-red-500/20 text-red-400 border-red-500/40'
                  }`}>
                    {student.attendance}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  {student.eligible ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-bold border border-green-500/40">
                      Eligible
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold border border-red-500/40">
                      Ineligible
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleNominate(student)}
                    disabled={!student.eligible}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                      student.eligible
                        ? 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                    }`}
                    style={student.eligible ? { boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)' } : {}}
                  >
                    <Award className="w-4 h-4" />
                    Nominate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowRegistrationModal(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500 rounded-2xl p-8 max-w-md w-full"
            style={{ boxShadow: '0 0 50px rgba(59, 130, 246, 0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Plus className="w-7 h-7 text-blue-400" />
                Register Student
              </h2>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-red-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={newStudent.firstName}
                  onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-blue-500 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
                />
              </div>

              <div>
                <label className="block text-gray-400 font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={newStudent.lastName}
                  onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-blue-500 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
                />
              </div>

              <div>
                <label className="block text-gray-400 font-medium mb-2">Admission Number</label>
                <input
                  type="text"
                  value={newStudent.admission}
                  onChange={(e) => setNewStudent({...newStudent, admission: e.target.value})}
                  placeholder="e.g., 2024001"
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-blue-500 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
                />
              </div>

              <div>
                <label className="block text-gray-400 font-medium mb-2">Attendance Percentage</label>
                <input
                  type="number"
                  value={newStudent.attendance}
                  onChange={(e) => setNewStudent({...newStudent, attendance: e.target.value})}
                  placeholder="e.g., 85"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-blue-500 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={submitRegistration}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold transition-all border border-blue-400/50"
                style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}
              >
                Submit
              </button>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nomination Modal */}
      {showNominationModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowNominationModal(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500 rounded-2xl p-8 max-w-md w-full"
            style={{ boxShadow: '0 0 50px rgba(168, 85, 247, 0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Award className="w-7 h-7 text-purple-400" />
                Nominate Candidate
              </h2>
              <button
                onClick={() => setShowNominationModal(false)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-red-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 font-medium mb-2">Student Name</label>
                <div className="px-4 py-3 bg-gray-800 border-2 border-purple-500/50 rounded-lg text-white font-medium">
                  {selectedStudent?.name}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-medium mb-2">Attendance</label>
                <div className="px-4 py-3 bg-gray-800 border-2 border-purple-500/50 rounded-lg text-white font-medium">
                  {selectedStudent?.attendance}%
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-medium mb-2">Position</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g., Class Representative"
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-purple-500 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)' }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={submitNomination}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl font-bold transition-all border border-purple-400/50"
                style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}
              >
                Confirm Nomination
              </button>
              <button
                onClick={() => setShowNominationModal(false)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add default props for safety
Students.defaultProps = {
  classInfo: {},
  students: [],
  onNominateCandidate: () => console.warn('onNominateCandidate not implemented'),
  onRegisterStudent: () => console.warn('onRegisterStudent not implemented'),
  handleFileUpload: () => console.warn('handleFileUpload not implemented'),
};

export default Students;