import { useState } from "react";
import DashboardHome from "./Components/DashboardHome/DashboardHome";
import Elections from "./Components/Elections/Elections";
import Candidates from "./Components/Candidates/Candidate";
import Profile from "./Components/Profile/Profile";
import Layout from "./Components/Layout/Layout";
import Votingpage from "./Pages/VotePage";


export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  // Render different components based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardHome />;
        case "classvote":
        return <Votingpage />;
      case "elections":
        return <Elections />;
      case "candidates":
        return <Candidates />;

      case "profile":
        return <Profile />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderContent()}
    </Layout>
  );
}
