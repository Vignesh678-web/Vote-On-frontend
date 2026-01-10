import React from "react";
import { Users, Ban, CheckCircle } from "lucide-react";

const FacultyList = ({ teachers, onToggleBlock }) => (
  <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-xl">
    <div className="flex items-center gap-2 mb-4">
      <Users className="w-5 h-5 text-green-400" />
      <h2 className="text-xl font-semibold text-green-400">Faculty List</h2>
    </div>
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {teachers.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No teachers added yet</p>
      ) : (
        teachers.map((teacher) => (
          <div
            key={teacher.facultyId || teacher.id} // ✅ fixed key
            className="bg-gray-800 border border-green-500/20 rounded p-4 flex justify-between items-center hover:border-green-500/50 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-green-400 font-semibold">
                  {teacher.name ||
                    `${teacher.firstName ?? ""} ${teacher.lastName ?? ""}`}
                </p>
                {teacher.status === "Blocked" && (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded font-semibold">
                    Blocked
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">
                ID: {teacher.facultyId || teacher.id}
              </p>
              <p className="text-sm text-gray-500">{teacher.department}</p>
            </div>
            <button
              onClick={() => onToggleBlock(teacher._id)}
              className={`flex items-center gap-2 font-semibold py-2 px-4 rounded transition-colors ${
                teacher.status === "Blocked"
                  ? "bg-green-500 hover:bg-green-600 text-black"
                  : "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
              }`}
            >
              {teacher.isBlocked === false ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  BLOCK
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4" />
                  UNBLOCK
                </>
              )}
            </button>
          </div>
        ))
      )}
    </div>
  </div>
);

export default FacultyList;
