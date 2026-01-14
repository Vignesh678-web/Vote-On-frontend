import React, { useEffect, useState } from "react";
import axios from "axios";

import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Overview from "../Components/Overview";
import MyStudent from "../Components/Students";
import ManageAttendance from "../Components/Attendance";
import Candidates from "../Components/Candidates";
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
  // UI STATE
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // DATA STATE
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // ==============================
  // FETCH STUDENTS
  // ==============================
    useEffect(() => {
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

          console.log("RAW API RESPONSE 👉", res.data);

          let extractedStudents = [];

          if (Array.isArray(res.data)) {
            extractedStudents = res.data;
          }
          else if (Array.isArray(res.data.students)) {
            extractedStudents = res.data.students;
          }
          else if (Array.isArray(res.data.data)) {
            extractedStudents = res.data.data;
          }
          else if (Array.isArray(res.data.data?.students)) {
            extractedStudents = res.data.data.students;
          }
          else {
            console.error("❌ Cannot find students array in response");
          }

          console.log("EXTRACTED STUDENTS 👉", extractedStudents);
          setStudents(extractedStudents);

        } catch (err) {
          console.error("Failed to fetch students:", err);
          setStudents([]);
        } finally {
          setLoadingStudents(false);
        }
      };

      fetchStudents();
    }, []);

  // ==============================
  // TAB CONTENT
  // ==============================
  const renderContent = () => {
    if (loadingStudents) {
      return (
        <div className="flex items-center justify-center h-full text-green-400">
          Loading students...
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <Overview
            classInfo={classInfo}
            students={students}
            candidates={candidates}
            election={election}
          />
        );

      case "students":
        return <MyStudent students={students} />;

      case "attendance":
        return <ManageAttendance students={students} />;

      case "candidates":
        return <Candidates candidates={candidates} />;

      case "upload":
        return <UploadData />;

      case "results":
        return <Results election={election} candidates={candidates} />;

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

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        candidates={candidates}
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
