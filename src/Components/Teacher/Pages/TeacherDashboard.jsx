import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trophy } from "lucide-react";

import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Overview from "../Components/Overview";
import MyStudent from "../Components/Students";
import ManageAttendance from "../Components/Attendance";
import Results from "../Components/Results";
import Settings from "../Components/Settings";
import Candidates from "../Components/Candidates";

const TeacherDashboard = ({
  teacherName,
  teacherRole,
  classInfo,
  profileImage,
  profileInputRef,
  handleProfileImageUpload,
}) => {
  const storedTeacher = JSON.parse(localStorage.getItem("teacher") || "{}");
  const effectiveName = teacherName || storedTeacher.Name || "Teacher";
  const effectiveRole = teacherRole || storedTeacher.role || "Teacher";
  const effectiveClass = classInfo || {
    className: storedTeacher.className || "N/A",
    section: storedTeacher.section || "N/A",
    academicYear: "2025"
  };

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [dynamicClassInfo, setDynamicClassInfo] = useState(effectiveClass);
  const [allElections, setAllElections] = useState([]);
  const [loadingElections, setLoadingElections] = useState(true);
  const [dynamicElection, setDynamicElection] = useState(null);

  // Fetch students (Server handles filtering for teachers now)
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/teacher/students",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data || [];
        setStudents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  // Fetch all elections for results view-only
  useEffect(() => {
    const fetchAllElections = async () => {
      try {
        const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/teacher/class-election", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllElections(res.data.elections || []);
      } catch (err) {
        console.error("Failed to fetch all elections:", err);
      } finally {
        setLoadingElections(false);
      }
    };
    fetchAllElections();
  }, []);

  // Helper: robust winner-name resolver
  const getWinnerName = (el) => {
    if (!el) return '—';
    if (el.winner && typeof el.winner === 'object' && el.winner.name) return el.winner.name;
    if (el.winner && (typeof el.winner === 'string' || typeof el.winner === 'number')) {
      const match = (el.candidates || []).find(c => {
        const sid = c.student?._id || c.student;
        return sid && String(sid) === String(el.winner);
      });
      if (match) return match.student?.name || match.name || String(el.winner);
      return String(el.winner).slice(0, 8);
    }
    return '—';
  };

  useEffect(() => {
    if (students.length > 0) {
      const eligibleCount = students.filter((s) => s.attendence >= 75).length;
      setDynamicClassInfo({
        totalStudents: students.length,
        eligibleVoters: eligibleCount,
        className: effectiveClass?.className || "Class",
        section: effectiveClass?.section || "A",
        academicYear: effectiveClass?.academicYear || "2025",
      });
    }
  }, [students]);

  const renderContent = () => {
    if (loadingStudents || loadingElections) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-green-400">
          <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
          <p className="font-mono text-sm tracking-widest uppercase">Initializing Teacher Vault...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <Overview
            classInfo={dynamicClassInfo}
            students={students}
            candidates={[]} // Teachers don't manage candidates
            election={null}
          />
        );

      case "students":
        return <MyStudent students={students} />;

      case "attendance":
        return <ManageAttendance students={students} />;

      case "candidates":
        return <Candidates />;

      case "results":
        if (allElections.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
              <Trophy size={64} className="opacity-10 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">No Results Available</h3>
              <p>Completed election results will appear here.</p>
            </div>
          );
        }

        const currentElection = dynamicElection || allElections[0];
        const completedElections = allElections.filter(e => e.status === 'Completed');

        return (
          <div className="space-y-8">
            <div className="px-8 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Election Library</h2>
              <div className="flex items-center gap-3 bg-gray-900 border border-white/10 px-4 py-2 rounded-xl text-gray-400 text-xs">
                <span>Viewing:</span>
                <select
                  className="bg-transparent text-green-400 font-bold outline-none cursor-pointer"
                  onChange={(e) => {
                    const sel = allElections.find(el => el._id === e.target.value);
                    setDynamicElection(sel);
                  }}
                  value={currentElection?._id}
                >
                  {allElections.map(el => (
                    <option key={el._id} value={el._id}>{el.title} ({el.status})</option>
                  ))}
                </select>
              </div>
            </div>

            <Results
              election={currentElection}
              candidates={currentElection.candidates}
            />
          </div>
        );

      case "settings":
        return (
          <Settings
            teacherName={effectiveName}
            teacherRole={effectiveRole}
            classInfo={effectiveClass}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role="teacher"
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          teacherName={effectiveName}
          teacherRole={effectiveRole}
          classInfo={effectiveClass}
          profileImage={profileImage}
          profileInputRef={profileInputRef}
          handleProfileImageUpload={handleProfileImageUpload}
        />

        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
