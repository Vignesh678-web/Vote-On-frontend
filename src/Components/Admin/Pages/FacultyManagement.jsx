import React from 'react';
import AddTeacher from './AddTeacher';
import FacultyList from './FacultyList';

export const FacultyManagement = ({
  teachers,
  onAddTeacher,
  onToggleBlock,
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-green-400">Faculty Management</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AddTeacher onAddTeacher={onAddTeacher} />
      <FacultyList teachers={teachers} onToggleBlock={onToggleBlock} />
    </div>
  </div>
);

export default FacultyManagement;
