// components/Students.jsx
import React, { useState, useEffect } from "react";
import { Users, Award, X } from "lucide-react";
import axios from "axios";

const Students = ({ classInfo = {}, onNominateCandidate }) => {
  const [students, setStudents] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showNominationModal, setShowNominationModal] = useState(false);
  const [position, setPosition] = useState("");

  const handleNominate = (student) => {
    if (!student.eligible) {
      alert("This student is not eligible (attendance < 75%)");
      return;
    }

    setSelectedStudent(student);
    setShowNominationModal(true);
  };

  const submitNomination = async () => {
    if (!position.trim()) {
      alert("Please enter a position");
      return;
    }

    if (!selectedStudent) {
      alert("No student selected");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/teacher/nominate",
        {
          studentId: selectedStudent.id, // IMPORTANT
          position,
          manifesto: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowNominationModal(false);
      setSelectedStudent(null);
      setPosition("");

      alert("Student nominated successfully. Awaiting admin approval.");
    } catch (err) {
      console.error("Nomination failed:", err);
      alert(
        err.response?.data?.message || "Failed to nominate student"
      );
    }
  };


  // -------- FETCH STUDENTS FROM BACKEND --------
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/teacher/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // BACKEND RETURNS ARRAY
      if (!Array.isArray(res.data)) {
        throw new Error("Invalid students response");
      }

      const formatted = res.data.map((s) => {
        const attendance =
          typeof s.attendence === "number" ? s.attendence : 0;

        return {
          id: s._id,
          name: s.name,
          admission: s.admissionNumber,
          attendance,                 // normalized
          eligible: attendance >= 75, // correct logic
        };
      });

      setStudents(formatted);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      alert("Could not load students");
    }
  };

  const filteredStudents = students.filter((s) => {
    if (activeFilter === "eligible") return s.eligible;
    if (activeFilter === "ineligible") return !s.eligible;
    return true;
  });

  // -------- UI --------
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-green-400" />
            Manage Students
          </h2>
          <p className="text-gray-400 mt-2">{classInfo.className}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-5 py-2.5 rounded-xl ${activeFilter === "all"
              ? "bg-green-600 text-black"
              : "bg-gray-800 text-gray-400"
            }`}
        >
          All ({students.length})
        </button>

        <button
          onClick={() => setActiveFilter("eligible")}
          className={`px-5 py-2.5 rounded-xl ${activeFilter === "eligible"
              ? "bg-green-600 text-black"
              : "bg-gray-800 text-gray-400"
            }`}
        >
          Eligible ({students.filter((s) => s.eligible).length})
        </button>

        <button
          onClick={() => setActiveFilter("ineligible")}
          className={`px-5 py-2.5 rounded-xl ${activeFilter === "ineligible"
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-gray-400"
            }`}
        >
          Ineligible ({students.filter((s) => !s.eligible).length})
        </button>
      </div>

      {/* ---- STUDENTS TABLE ---- */}
      <div className="bg-gray-900 border-2 border-green-500 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-green-500/10 border-b border-green-500/30">
              <th className="px-6 py-4 text-left text-green-400">Name</th>
              <th className="px-6 py-4 text-left text-green-400">Admission No</th>
              <th className="px-6 py-4 text-left text-green-400">Attendance</th>
              <th className="px-6 py-4 text-left text-green-400">Status</th>
              <th className="px-6 py-4 text-left text-green-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-green-500/10">
                <td className="px-6 py-4 text-white">{student.name}</td>
                <td className="px-6 py-4 text-gray-300">{student.admission}</td>
                <td className="px-6 py-4 text-gray-300">{student.attendance}%</td>
                <td className="px-6 py-4">
                  {student.eligible ? (
                    <span className="text-green-400">Eligible</span>
                  ) : (
                    <span className="text-red-400">Ineligible</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleNominate(student)}
                    disabled={!student.eligible || student.nominated}
                    className={`px-4 py-2 rounded-lg ${student.eligible && !student.nominated
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-500"
                      }`}
                  >
                    <Award className="w-4 h-4 inline-block mr-1" />
                    {student.nominated ? "Nominated" : "Nominate"}
                  </button>

                </td>
              </tr>
            ))}

            {filteredStudents.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-gray-400 text-center" colSpan="5">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---- NOMINATION MODAL ---- */}
      {showNominationModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className="bg-gray-900 border-2 border-purple-500 rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Award className="w-7 h-7 text-purple-400" />
                Nominate Candidate
              </h2>
              <button onClick={() => setShowNominationModal(false)}>
                <X className="w-6 h-6 text-red-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-white">
                <label className="block text-gray-400">Student Name</label>
                {selectedStudent?.name}
              </div>

              <div className="text-white">
                <label className="block text-gray-400">Attendance</label>
                {selectedStudent?.attendance}%
              </div>

              <div>
                <label className="block text-gray-400">Position</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Class Representative"
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={submitNomination}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold"
              >
                Confirm Nomination
              </button>
              <button
                onClick={() => setShowNominationModal(false)}
                className="px-6 py-3 bg-gray-700 text-white rounded-xl font-bold"
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

export default Students;
