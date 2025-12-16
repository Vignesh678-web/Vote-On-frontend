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

// central teacher seed data
const initialTeachersData = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@college.edu",
    phone: "+91 98765 43210",
    department: "Computer Science",
    subject: "Data Structures",
    experience: "15 years",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "Active",
  },
  {
    id: 2,
    name: "Prof. Meera Patel",
    email: "meera.patel@college.edu",
    phone: "+91 98765 43211",
    department: "Information Technology",
    subject: "Web Development",
    experience: "12 years",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    status: "Active",
  },
  {
    id: 3,
    name: "Dr. Arjun Sharma",
    email: "arjun.sharma@college.edu",
    phone: "+91 98765 43212",
    department: "Electronics",
    subject: "Digital Electronics",
    experience: "18 years",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    status: "Active",
  },
  {
    id: 4,
    name: "Prof. Priya Singh",
    email: "priya.singh@college.edu",
    phone: "+91 98765 43213",
    department: "Mechanical",
    subject: "Thermodynamics",
    experience: "10 years",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "Active",
  },
  {
    id: 5,
    name: "Dr. Vikram Reddy",
    email: "vikram.reddy@college.edu",
    phone: "+91 98765 43214",
    department: "Civil Engineering",
    subject: "Structural Analysis",
    experience: "20 years",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    status: "Active",
  },
  {
    id: 6,
    name: "Prof. Ananya Nair",
    email: "ananya.nair@college.edu",
    phone: "+91 98765 43215",
    department: "Computer Science",
    subject: "Machine Learning",
    experience: "8 years",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    status: "Active",
  },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [teachers, setTeachers] = useState(initialTeachersData);
  const [elections, setElections] = useState([
    {
      id: 1,
      title: "Student Council President 2025",
      date: "2025-03-15",
      status: "Active",
      candidates: [
        { name: "John Doe", votes: 245 },
        { name: "Jane Smith", votes: 198 },
        { name: "Mike Johnson", votes: 156 },
      ],
    },
    {
      id: 2,
      title: "Department Representative",
      date: "2025-03-20",
      status: "Active",
      candidates: [
        { name: "Sarah Williams", votes: 89 },
        { name: "David Brown", votes: 112 },
      ],
    },
  ]);
  const [results, setResults] = useState([]);

  const handleAddTeacher = (teacher) => {
    setTeachers((prev) => [...prev, teacher]);
  };

  // flexible remove that works with id or facultyId
  const handleRemoveTeacher = (teacherId) => {
    setTeachers((prev) =>
      prev.filter((t) => t.id !== teacherId && t.facultyId !== teacherId)
    );
  };

  // ✅ NEW: toggle block/unblock in local state
  const handleToggleBlock = (teacherKey) => {
    setTeachers((prev) =>
      prev.map((t) => {
        const key = t.facultyId || t.id;
        if (key !== teacherKey) return t;

        return {
          ...t,
          status: t.status === "Blocked" ? "Active" : "Blocked",
        };
      })
    );
  };

  const handleDeclareResult = (electionId) => {
    const election = elections.find((e) => e.id === electionId);
    if (election) {
      const sortedCandidates = [...election.candidates].sort(
        (a, b) => b.votes - a.votes
      );
      const result = {
        ...election,
        status: "Completed",
        declaredDate: new Date().toLocaleDateString(),
        candidates: sortedCandidates,
      };
      setResults((prev) => [...prev, result]);
      setElections((prev) =>
        prev.map((e) =>
          e.id === electionId ? { ...e, status: "Completed" } : e
        )
      );
    }
  };

  const handlePrintPDF = (result) => {
    alert(
      `Generating PDF for: ${result.title}\n\nThis would trigger PDF generation in a real implementation with libraries like jsPDF or react-pdf.`
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
