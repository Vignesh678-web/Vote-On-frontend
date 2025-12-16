import React, { useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Overview from '../Components/Overview';
import MyStudent from '../Components/Students';
import ManageAttendance from '../Components/Attendance';
import Candidates from '../Components/Candidates';
import UploadData from '../Components/Upload';
import Results from '../Components/Results';
import Settings from '../Components/Settings';

const TeacherDashboard = ({
  teacherName,
  teacherRole,
  classInfo,
  students,
  candidates,
  election,
  profileImage,
  profileInputRef,
  handleProfileImageUpload,
}) => {

  // 🟢 FIX — LOCAL STATE
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
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
        return <Overview />;
    }
  };

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
