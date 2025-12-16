import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

const AddTeacher = ({ onAddTeacher }) => {
  const [facultyId, setFacultyId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (facultyId && name && department && password) {
      onAddTeacher({ facultyId, name, department, password,email });
      setFacultyId('');
      setName('');
      setDepartment('');
      setPassword('');
    }
  };

  return (
    <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold text-green-400">Add Teacher</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Faculty ID</label>
          <input
            type="text"
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            className="w-full bg-gray-800 border border-green-500/50 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
            placeholder="Enter Faculty ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 border border-green-500/50 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
            placeholder="Enter Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-gray-800 border border-green-500/50 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
            placeholder="Enter Department"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-green-500/50 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
            placeholder="Enter Password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-green-500/50 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
            placeholder="Enter Email"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded transition-colors shadow-lg shadow-green-500/30"
        >
          Add Teacher
        </button>
      </div>
    </div>
  );
};
export default AddTeacher;