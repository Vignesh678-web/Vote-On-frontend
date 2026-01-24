import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import DashboardHome from "./DashboardHome";
import FacultyManagement from "./FacultyManagement";
import ElectionMonitor from "./ElectionMonitor";
import Results from "./Result";
import AdminSettings from "./AdminSetting";
import CandidateApprovalSection from "./CandidateApproval";
import AdminTeachers from "./AdminTeachers";
import CandidateParticipationTracker from "./CandidateParticipationTracker";
import { useEffect } from "react";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [teachers, setTeachers] = useState([]);
  const [elections, setElections] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Teachers
      const teachersRes = await axios.get("http://localhost:5000/api/admin/teacher/all", { headers });
      const rawTeachers = teachersRes.data.teachers || [];

      // Map backend fields to consistent frontend interface
      const mappedTeachers = rawTeachers.map(t => ({
        ...t,
        id: t._id, // Add id alias for components expecting it
        name: t.Name || t.name, // Handle case difference
        status: t.isBlocked ? "Blocked" : "Active",
        image: t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.Name || 'T')}&background=random`
      }));

      setTeachers(mappedTeachers);

      // 2. Fetch Elections
      const electionsRes = await axios.get("http://localhost:5000/api/elections", { headers });
      const allElections = electionsRes.data.elections || [];
      setElections(allElections);

      // 3. Filter Results (Completed Elections)
      setResults(allElections.filter(e => e.status === 'Completed'));

    } catch (err) {
      console.error("Dashboard stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = (teacher) => {
    setTeachers((prev) => [...prev, teacher]);
  };

  const handleRemoveTeacher = (teacherId) => {
    setTeachers((prev) =>
      prev.filter((t) => t._id !== teacherId)
    );
  };

  const handleToggleBlock = (teacherKey) => {
    fetchStats(); // Refresh from backend instead of local toggle
  };

  const handleDeclareResult = async (electionId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/elections/${electionId}/end`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStats();
    } catch (err) {
      alert("Failed to declare result");
    }
  };

  const handlePrintPDF = (result) => {
    alert(
      `Generating PDF for: ${result.title}\n\nThis functionality will be triggered via jsPDF.`
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardHome
            teachers={teachers}
            elections={elections}
            results={results}
          />
        );
      case "faculty":
        return (
          <FacultyManagement
            teachers={teachers}
            onAddTeacher={handleAddTeacher}
            onToggleBlock={handleToggleBlock}  // ✅ pass the function
          />
        );
      case "elections":
        return (
          <ElectionMonitor
            elections={elections}
            onDeclareResult={handleDeclareResult}
          />
        );
      case "results":
        return <Results results={results} onPrintPDF={handlePrintPDF} />;
      case "candidateApproval":
        return <CandidateApprovalSection />;
      case "adminTeacherApproval":
        return (
          <AdminTeachers
            teachers={teachers}
            onRemoveTeacher={handleRemoveTeacher}
          />
        );
      case "candidateParticipationTracker":
        return <CandidateParticipationTracker />;
      case "settings":
        return <AdminSettings />;
      default:
        return (
          <DashboardHome
            teachers={teachers}
            elections={elections}
            results={results}
          />
        );
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {renderContent()}
    </AdminLayout>
  );
}
