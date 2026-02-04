import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trophy } from "lucide-react";

import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Overview from "../Components/Overview";
import Candidates from "../Components/Candidates";
import ManageElections from "../Components/ManageElections";
import ManageCollegeElections from "../Components/ManageCollegeElections";
import CandidateApproval from "../../Admin/Pages/CandidateApproval";

import UploadData from "../Components/Upload";
import Results from "../Components/Results";
import Settings from "../Components/Settings";

const ReturningOfficerDashboard = ({
  teacherName,
  teacherRole,
  classInfo,
  candidates,
  election,
  profileImage,
  profileInputRef,
  handleProfileImageUpload,
}) => {
  // 🔄 RECOVER STATE FROM LOCALSTORAGE ON REFRESH
  // Props are lost on refresh because App.jsx doesn't pass them, so we hydrate from storage.
  const storedTeacher = JSON.parse(localStorage.getItem("teacher") || "{}");
  const effectiveName = teacherName || storedTeacher.Name || "Returning Officer";
  const effectiveRole = teacherRole || storedTeacher.role || "Officer";
  const effectiveClass = classInfo || {
    className: storedTeacher.department || "Class A",
    academicYear: "2025"
  };

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [dynamicCandidates, setDynamicCandidates] = useState([]);
  const [dynamicClassInfo, setDynamicClassInfo] = useState(effectiveClass);
  const [dynamicElection, setDynamicElection] = useState(election);
  const [loadingData, setLoadingData] = useState(true);

  // 🔑 NEW
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  // Fetch students
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
        const token = localStorage.getItem("teachertoken") || localStorage.getItem("token");
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
        className: effectiveClass?.className || "Class A",
        academicYear: effectiveClass?.academicYear || "2025",
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

  // Helper: robust winner-name resolver (handles id, populated object, or derive from candidates)
  const getWinnerName = (el) => {
    if (!el) return '—';

    // 1) Already populated object
    if (el.winner && typeof el.winner === 'object' && el.winner.name) return el.winner.name;

    // 2) winner stored as an id (string or ObjectId-like) — try to match against candidates
    if (el.winner && (typeof el.winner === 'string' || typeof el.winner === 'number')) {
      const match = (el.candidates || []).find(c => {
        const sid = c.student?._id || c.student;
        return sid && String(sid) === String(el.winner);
      });
      if (match) return match.student?.name || match.name || String(el.winner);
      return String(el.winner).slice(0, 8); // show short id as fallback
    }

    // 3) Derive from candidates by highest votes (votesCount or votes)
    if (Array.isArray(el.candidates) && el.candidates.length > 0) {
      const winnerFromCandidates = el.candidates.reduce((best, cur) => {
        const bestVotes = best?.votesCount ?? best?.votes ?? -1;
        const curVotes = cur?.votesCount ?? cur?.votes ?? 0;
        return curVotes > bestVotes ? cur : best;
      }, null);
      if (winnerFromCandidates) return winnerFromCandidates.student?.name || winnerFromCandidates.name || '—';
    }

    return '—';
  };

  // Fetch all elections for results
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

  const renderContent = () => {
    if (loadingStudents || loadingElections) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-green-400">
          <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
          <p className="font-mono text-sm tracking-widest uppercase">Initializing Returning Officer Vault...</p>
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

      case "candidates":
        return <CandidateApproval />;

      case "elections":
        return <ManageElections />;

      case "college-elections":
        return <ManageCollegeElections />;

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

        // Show the selected election in detail and also render a scrollable list of all declared results
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

            {/* Detailed view for the currently selected election */}
            <Results
              election={currentElection}
              candidates={currentElection.candidates}
            />

            {/* All Declared Results (teacher wants to see every election result at once) */}
            <div className="px-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">All Declared Results</h3>
                <p className="text-sm text-gray-400">Showing {completedElections.length} completed poll{completedElections.length !== 1 ? 's' : ''}</p>
              </div>

              {completedElections.length === 0 ? (
                <div className="rounded-xl border border-white/5 bg-gray-900 p-8 text-center text-gray-400">
                  No declared results yet. Completed elections will appear here.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedElections.map((el) => (
                    <button
                      key={el._id}
                      className="text-left group bg-gray-900 border border-white/5 rounded-2xl p-4 hover:scale-[1.01] transition-shadow duration-200"
                      onClick={() => {
                        setDynamicElection(el);
                        // bring the detailed view into focus (accessibility + UX)
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      aria-label={`View results for ${el.title}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-3.5 h-12 rounded-md bg-linear-to-b from-green-400/30 to-transparent" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <div className="text-sm text-gray-400 uppercase tracking-wide text-xs">{el.position} • {el.className}-{el.section}</div>
                              <div className="text-white font-bold mt-1">{el.title}</div>
                              <div className="text-[11px] text-gray-500 mt-1">Declared: {el.endDate ? new Date(el.endDate).toLocaleDateString() : '—'}</div>
                            </div>

                            <div className="text-right">
                              <div className="text-[12px] text-gray-400">Winner</div>
                              <div className="text-sm font-black text-yellow-400 mt-1">{getWinnerName(el)}</div>
                              <div className="text-xs text-gray-500 mt-1">{el.totalVotes || 0} votes</div>
                            </div>
                          </div>

                          <div className="mt-3 text-xs text-gray-400">Click to open detailed result view</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
        candidates={dynamicCandidates}
        role="returning_officer"
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

export default ReturningOfficerDashboard;
