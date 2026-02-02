import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AdminLayout from "./AdminLayout";
import DashboardHome from "./DashboardHome";
import FacultyManagement from "./FacultyManagement";
import ElectionMonitor from "./ElectionMonitor";
import Result from "./Result";
import AdminSettings from "./AdminSetting";
import CandidateApprovalSection from "./CandidateApproval";
import AdminTeachers from "./AdminTeachers";
import AuditLogs from "./AuditLogs";
import CollegeVoting from "../Pages/CollegeVoting";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [teachers, setTeachers] = useState([]);
  const [elections, setElections] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const isAuthorized = role === 'admin' || role === 'teacher';

    if (!token || !isAuthorized) {
      console.error("[DASHBOARD] Access denied. Redirecting to login...");
      navigate("/"); // Redirect to main login page
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("[DASHBOARD] No token found in localStorage");
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch teachers
      const teachersRes = await axios.get(
        "http://localhost:5000/api/admin/teacher/all",
        { headers }
      );

      const teachersData = teachersRes.data.teachers || [];
      setTeachers(
        teachersData.map(t => ({
          ...t,
          id: t._id,
          name: t.Name || t.name,
          status: t.isBlocked ? "Blocked" : "Active",
          image:
            t.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              t.Name || "T"
            )}&background=random`,
        }))
      );

      // Fetch elections
      const electionsRes = await axios.get(
        "http://localhost:5000/api/elections",
        { headers }
      );

      const allElections = electionsRes.data.elections || [];
      setElections(allElections);
      setResults(allElections.filter(e => e.status === "Completed"));
    } catch (error) {
      console.error("Dashboard Fetch Error:", error.response?.data || error.message);
      // If unauthorized, could redirect to login here
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = teacher => {
    setTeachers(prev => [...prev, teacher]);
  };

  const handleRemoveTeacher = teacherId => {
    setTeachers(prev => prev.filter(t => t._id !== teacherId));
  };

  const handleToggleBlock = () => {
    fetchStats();
  };

  const handleDeclareResult = async electionId => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/elections/${electionId}/end`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchStats();
    } catch {
      alert("Failed to declare result");
    }
  };

  const handlePrintPDF = result => {
    alert(`Generating PDF for: ${result.title}`);
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
            refreshData={fetchStats}
          />
        );

      case "elections":
        return (
          <ElectionMonitor
            elections={elections}
            onDeclareResult={handleDeclareResult}
          />
        );

      case "collegeVoting":
        return <CollegeVoting refreshData={fetchStats} />;

      case "results":
        return (
          <Result
            results={results}
            onPrintPDF={handlePrintPDF}
            refreshData={fetchStats}
          />
        );

      case "candidateApproval":
        return <CandidateApprovalSection />;

      case "adminTeacherApproval":
        return (
          <AdminTeachers
            teachers={teachers}
            onRemoveTeacher={handleRemoveTeacher}
          />
        );

      case "auditLogs":
        return <AuditLogs />;

      case "settings":
        return <AdminSettings />;

      default:
        return null;
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      loading={loading}
    >
      {renderContent()}
    </AdminLayout>
  );
}
