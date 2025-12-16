import React from "react";
import StatCard from "./StatCard";
import ElectionCard from "./ElectionCard";
import { Users, Award, ClipboardList } from "lucide-react";

const Dashboard = () => {
  const elections = [
    { id: 1, title: "Class Representative", candidates: 4, status: "Ongoing" },
    { id: 2, title: "Sports Secretary", candidates: 3, status: "Completed" },
  ];

  return (
    <div className="min-h-screen p-6 sm:p-10 bg-gradient-to-b from-black to-[#0a0f0a] text-white">
      {/* Header */}
      <header className="mb-10">
        <h1
          className="text-3xl sm:text-4xl font-bold mb-2 text-green-400 drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]"
        >
          Dashboard Overview
        </h1>
        <p className="text-gray-300 text-sm sm:text-base">
          A quick summary of current system activity and election updates.
        </p>
      </header>

      {/* Stats Section */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        <StatCard
          icon={<Users className="text-green-400 w-7 h-7" />}
          title="Registered Students"
          value="1,245"
        />
        <StatCard
          icon={<ClipboardList className="text-green-400 w-7 h-7" />}
          title="Active Elections"
          value="3"
        />
        <StatCard
          icon={<Award className="text-green-400 w-7 h-7" />}
          title="Completed Elections"
          value="8"
        />
      </section>

      {/* Elections Section */}
      <section
        className="bg-[#0a0f0a] rounded-2xl border border-green-500/20 p-6 sm:p-8 shadow-[0_0_25px_rgba(34,197,94,0.15)]"
      >
        <h2
          className="text-2xl sm:text-3xl font-bold mb-6 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]"
        >
          Election Status
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {elections.map((election) => (
            <ElectionCard
              key={election.id}
              title={election.title}
              candidates={election.candidates}
              status={election.status}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
