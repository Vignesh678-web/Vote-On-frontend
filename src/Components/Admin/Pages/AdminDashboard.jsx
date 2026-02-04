import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
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
import ElectionCalendar from "./ElectionCalendar";
import CollegeVoting from "../Pages/CollegeVoting";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [teachers, setTeachers] = useState([]);
  const [elections, setElections] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");
      if (!token) {
        console.warn("[DASHBOARD] No admin token found in localStorage");
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
      const token = localStorage.getItem("admintoken") || localStorage.getItem("teachertoken") || localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/elections/${electionId}/end`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchStats();
      toast.success("Results declared successfully!");
    } catch {
      toast.error("Failed to declare result");
    }
  };

  const handlePrintPDF = (result) => {
    Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]).then(([{ jsPDF }, { default: autoTable }]) => {
      const doc = new jsPDF();
      const winner = typeof result.winner === 'object' ? result.winner?.name : result.winner || 'N/A';
      
      // 🔹 Theme Colors
      const primaryColor = [16, 185, 129]; // Emerald 500
      
      // 🔹 Header
      doc.setFontSize(22);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("Official Election Report", 105, 20, { align: "center" });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 28, { align: "center" });
      
      // 🔹 Divider
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      // 🔹 Election Details
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("Election Intelligence Overview", 20, 45);
      
      const summaryData = [
        ["Election Title", result.title],
        ["Position", result.position],
        ["Winner Elect", winner],
        ["Total Ballots Cast", String(result.totalVotes || 0)],
        ["Election Type", result.type?.toUpperCase() || "N/A"],
        ["Institution Unit", `${result.className || ''} ${result.section || ''}`]
      ];
      
      autoTable(doc, {
        startY: 50,
        head: [["Metric", "Data Points"]],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillStyle: 'dark', fillColor: [30, 41, 59] },
        margin: { left: 20, right: 20 }
      });
      
      // 🔹 Nominee Standings
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("Nominee Performance Breakdown", 20, finalY);
      
      const candidateData = result.candidates
        .sort((a, b) => b.votesCount - a.votesCount)
        .map((c, index) => [
          index + 1,
          c.student?.name || "Unknown",
          c.student?.admissionNumber || "—",
          String(c.votesCount),
          `${((c.votesCount / (result.totalVotes || 1)) * 100).toFixed(1)}%`
        ]);
        
      autoTable(doc, {
        startY: finalY + 5,
        head: [["Rank", "Nominee", "Adm. No", "Votes", "Margin"]],
        body: candidateData,
        theme: 'grid',
        headStyles: { fillColor: primaryColor },
        margin: { left: 20, right: 20 }
      });
      
      // 🔹 Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`VoteOn Digital Registry - Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
      }
      
      doc.save(`${result.title}_Result_Report.pdf`);
      toast.success("PDF report generated!");
    }).catch(err => {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF. Please try again.");
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardHome
            teachers={teachers}
            elections={elections}
            results={results}
            setActiveSection={setActiveSection}
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

      case "results":
        return (
          <Result
            results={results}
            onPrintPDF={handlePrintPDF}
            refreshData={fetchStats}
          />
        );

      case "adminTeacherApproval":
        return (
          <AdminTeachers
            teachers={teachers}
            onRemoveTeacher={handleRemoveTeacher}
          />
        );

      case "auditLogs":
        return <AuditLogs />;

      case "calendar":
        return <ElectionCalendar elections={elections} />;

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
