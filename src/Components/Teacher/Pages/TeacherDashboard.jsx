import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trophy } from "lucide-react";

import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Overview from "../Components/Overview";
import MyStudent from "../Components/Students";
import ManageAttendance from "../Components/Attendance";
import Candidates from "../Components/Candidates";
import ManageElections from "../Components/ManageElections";

import UploadData from "../Components/Upload";
import Results from "../Components/Results";
import Settings from "../Components/Settings";

const TeacherDashboard = ({
  teacherName,
  teacherRole,
  classInfo,
  candidates,
  election,
  profileImage,
  profileInputRef,
  handleProfileImageUpload,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [dynamicCandidates, setDynamicCandidates] = useState([]);
  const [dynamicClassInfo, setDynamicClassInfo] = useState(classInfo);
  const [dynamicElection, setDynamicElection] = useState(election);
  const [loadingData, setLoadingData] = useState(true);

  // 🔑 NEW
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/teacher/students",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data =
          res.data?.students ||
          res.data?.data?.students ||
          res.data?.data ||
          res.data ||
          [];

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

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/admin/candidates/get-candidates",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const rawCandidates = Array.isArray(res.data)
          ? res.data
          : res.data.candidates || [];

        const formatted = rawCandidates.map((c) => ({
          id: c._id,
          name: c.name,
          position: c.position,
          status: c.isApproved ? "approved" : "pending",
          attendance: c.attendence ?? 0,
          candidateBio: c.candidateBio,
          manifestoPoints: c.manifestoPoints,
        }));

        setDynamicCandidates(formatted);
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
        setDynamicCandidates([]);
      }
    };

    fetchCandidates();
  }, []);

  // Build class info from students
  useEffect(() => {
    if (students.length > 0) {
      const eligibleCount = students.filter((s) => s.eligible).length;
      setDynamicClassInfo({
        totalStudents: students.length,
        eligibleVoters: eligibleCount,
        className: classInfo?.className || "Class A",
        academicYear: classInfo?.academicYear || "2025",
      });
    }
  }, [students]);

  // Build election info from candidates and students
  useEffect(() => {
    if (students.length > 0 || dynamicCandidates.length > 0) {
      const totalVotes = students.filter((s) => s.votedFor).length;
      const eligibleVoters = students.filter((s) => s.eligible).length;

      setDynamicElection({
        totalVotes,
        eligibleVoters: eligibleVoters || 1,
        status: "active",
        startedAt: new Date().toISOString(),
      });
    }
  }, [students, dynamicCandidates]);

  // 🔑 NEW: All Elections for Results
  const [allElections, setAllElections] = useState([]);
  const [loadingElections, setLoadingElections] = useState(true);

  // Fetch all elections for results
  useEffect(() => {
    const fetchAllElections = async () => {
      try {
        const token = localStorage.getItem("token");
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

  const renderContent = () => {
    if (loadingStudents || loadingElections) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-green-400">
          <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
          <p className="font-mono text-sm tracking-widest uppercase">Initializing Dashboard Vault...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <Overview
            classInfo={dynamicClassInfo}
            students={students}
            candidates={dynamicCandidates}
            election={dynamicElection}
          />
        );

      case "students":
        return <MyStudent students={students} />;

      case "attendance":
        return <ManageAttendance students={students} />;

      case "candidates":
        return (
          <Candidates
            onViewCandidate={(id) => {
              setSelectedCandidateId(id);
              setActiveTab("candidate-details");
            }}
          />
        );

      case "elections":
        return <ManageElections />;

      case "candidate-details":
        return (
          <CandidateDetails
            studentId={selectedCandidateId}
            onBack={() => {
              setActiveTab("candidates");
              setSelectedCandidateId(null);
            }}
          />
        );

      case "upload":
        return <UploadData />;

      case "results":
        if (allElections.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
              <Trophy size={64} className="opacity-10 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">No Polls Found</h3>
              <p>Create and complete an election to see results here.</p>
            </div>
          );
        }

        // Find the most robust version of the selected election from our full list
        const currentElectionId = dynamicElection?._id || allElections[0]?._id;
        const currentElection = allElections.find(el => el._id === currentElectionId) || allElections[0];

        return (
          <div className="space-y-6">
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
            teacherName={teacherName}
            teacherRole={teacherRole}
            classInfo={classInfo}
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
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          teacherName={teacherName}
          teacherRole={teacherRole}
          classInfo={classInfo}
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
