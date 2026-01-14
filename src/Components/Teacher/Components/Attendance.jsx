import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [selectedStudent, setSelectedStudent] = useState(null);
const [attendanceValue, setAttendanceValue] = useState("");
const [saving, setSaving] = useState(false);




  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Unauthorized: No token found");
        }

        const res = await axios.get(
          "http://localhost:5000/api/teacher/students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // HARD validation
        if (!Array.isArray(res.data)) {
          throw new Error("Invalid API response");
        }

        setStudents(res.data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading attendance...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      {/* Header */}
      <div className="bg-gray-900 rounded-xl p-6 border border-green-500/30">
        <h2 className="text-2xl font-bold text-white">Attendance</h2>
        <p className="text-sm text-green-400">Minimum 75% required</p>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl p-6 border border-green-500/30">
  <div className="overflow-x-auto">
    <table className="w-full min-w-[800px]">
      <thead>
        <tr className="border-b border-green-500/20 text-green-400">
          <th className="py-3 text-left">#</th>
          <th className="py-3 text-left">Student</th>
          <th className="py-3 text-left">Admission No</th>
          <th className="py-3 text-left">Class</th>
          <th className="py-3 text-left">Section</th>
          <th className="py-3 text-left">Attendance</th>
          <th className="py-3 text-left">Status</th>
        </tr>
      </thead>

      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="7" className="text-center text-gray-400 py-6">
              No students found
            </td>
          </tr>
        ) : (
          students.map((student, index) => {
            const attendance =
              typeof student.attendence === "number"
                ? student.attendence
                : 0;

            const isEligible = attendance >= 75;

            return (
              <tr
                key={student._id}
                className="border-b border-green-500/10 hover:bg-gray-800/40"
              >
                <td className="py-4 text-gray-400">{index + 1}</td>

                <td className="py-4 text-white font-semibold">
                  {student.name || "—"}
                </td>

                <td className="py-4 text-gray-300">
                  {student.admissionNumber || "—"}
                </td>

                <td className="py-4 text-gray-300">
                  {student.className ?? "—"}
                </td>

                <td className="py-4 text-gray-300">
                  {student.section ?? "—"}
                </td>

                <td className="py-4 text-white">
                  {attendance}%
                </td>

                <td className="py-4 flex items-center gap-4">
  {isEligible ? (
    <span className="text-green-400 flex items-center gap-1">
      <CheckCircle size={16} /> Eligible
    </span>
  ) : (
    <span className="text-red-400 flex items-center gap-1">
      <XCircle size={16} /> Not Eligible
    </span>
  )}
  <button
  onClick={() => {
    setSelectedStudent(student);
    setAttendanceValue("");
    setIsAddModalOpen(true);
  }}
  className="text-sm text-blue-400 hover:underline"
>
  Add
</button>

 <button
  onClick={() => {
    setSelectedStudent(student);
    setAttendanceValue(student.attendence ?? 0);
    setIsEditModalOpen(true);
  }}
  className="text-sm text-blue-400 hover:underline"
>
  Edit
</button>

</td>

              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
</div>
{isAddModalOpen && selectedStudent && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-900 w-full max-w-md rounded-xl p-6 border border-green-500/30">

      <h3 className="text-xl font-bold text-white mb-2">
        Add Attendance
      </h3>

      <p className="text-sm text-gray-400 mb-4">
        {selectedStudent.name} ({selectedStudent.admissionNumber})
      </p>

      <input
        type="number"
        min="0"
        max="100"
        value={attendanceValue}
        onChange={(e) => setAttendanceValue(e.target.value)}
        placeholder="Enter attendance percentage"
        className="w-full px-4 py-2 rounded-lg bg-black border border-gray-600 text-white focus:outline-none focus:border-green-500"
      />

      <div className="flex justify-end gap-4 mt-6">
         <button
    onClick={() => setIsAddModalOpen(false)}
    className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
  >
    Cancel
  </button>

  {/* ADD Attendance (REPLACED button) */}
  <button
    disabled={saving || attendanceValue === ""}
    onClick={async () => {
      try {
        const value = Number(attendanceValue);

        if (value < 0 || value > 100) {
          alert("Attendance must be between 0 and 100");
          return;
        }

        setSaving(true);

        const token = localStorage.getItem("token");

        await axios.post(
          "http://localhost:5000/api/teacher/attendance",
          {
            studentId: selectedStudent._id,
            attendancePercentage: value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // UI truth update
        setStudents((prev) =>
          prev.map((s) =>
            s._id === selectedStudent._id
              ? { ...s, attendence: value }
              : s
          )
        );

        setIsAddModalOpen(false);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to add attendance");
      } finally {
        setSaving(false);
      }
    }}
    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
  >
    {saving ? "Saving..." : "Add"}
  </button>
      </div>
    </div>
  </div>
)}

{isEditModalOpen && selectedStudent && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-900 w-full max-w-md rounded-xl p-6 border border-green-500/30">

      <h3 className="text-xl font-bold text-white mb-2">
        Edit Attendance
      </h3>

      <p className="text-sm text-gray-400 mb-4">
        {selectedStudent.name} ({selectedStudent.admissionNumber})
      </p>

      <input
        type="number"
        min="0"
        max="100"
        value={attendanceValue}
        onChange={(e) => setAttendanceValue(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-black border border-gray-600 text-white focus:outline-none focus:border-green-500"
      />

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setIsEditModalOpen(false)}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
        >
          Cancel
        </button>

        <button
          disabled={saving || attendanceValue === ""}
          onClick={async () => {
            try {
              const value = Number(attendanceValue);

              if (value < 0 || value > 100) {
                alert("Attendance must be between 0 and 100");
                return;
              }

              setSaving(true);

              const token = localStorage.getItem("token");

              await axios.post(
                "http://localhost:5000/api/teacher/update-attendance",
                {
                  studentId: selectedStudent._id,
                  attendancePercentage: value,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              // Update UI truthfully
              setStudents((prev) =>
                prev.map((s) =>
                  s._id === selectedStudent._id
                    ? { ...s, attendence: value }
                    : s
                )
              );

              setIsEditModalOpen(false);
            } catch (err) {
              alert(
                err.response?.data?.message ||
                "Failed to update attendance"
              );
            } finally {
              setSaving(false);
            }
          }}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update"}
        </button>
      </div>
    </div>
  </div>
)}



      {/* Warning */}
      <div className="bg-orange-500/10 border border-orange-500 rounded-xl p-5">
        <p className="text-orange-300 text-sm">
          Students below 75% cannot become candidates.
        </p>
      </div>
    </div>
  );
};

export default Attendance;
