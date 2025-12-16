import React from "react";
import { BarChart3, CheckCircle, Users } from "lucide-react";

export default function DashboardHome() {
  const stats = [
    {
      icon: Users,
      title: "Active Elections",
      value: "3",
      subtitle: "Ongoing this week",
      color: "green",
    },
    {
      icon: CheckCircle,
      title: "Candidates",
      value: "12",
      subtitle: "Registered so far",
      color: "purple",
    },
    {
      icon: Users,
      title: "Total Voters",
      value: "150",
      subtitle: "Across all classes",
      color: "green",
    },
  ];

  return (
    <div
      className="min-h-screen flex justify-center items-start py-12 px-4 sm:px-8 lg:px-16"
      style={{
        background: "linear-gradient(to bottom, #000000, #0a0f0a)",
      }}
    >
      <div
        className="w-full max-w-6xl bg-gray-900 rounded-2xl border border-green-500/30 p-6 sm:p-10"
        style={{
          boxShadow: "0 0 40px rgba(34, 197, 94, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div
              className="p-3 bg-green-500/20 rounded-xl border border-green-500/40"
              style={{ boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)" }}
            >
              <BarChart3
                className="w-8 h-8 text-green-400"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))",
                }}
              />
            </div>
            <div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white leading-tight"
                style={{
                  textShadow: "0 0 15px rgba(34, 197, 94, 0.3)",
                }}
              >
                Dashboard Overview
              </h2>
              <p className="text-green-400 font-medium text-sm sm:text-base mt-1">
                Welcome back! Here's your voting activity summary.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isGreen = stat.color === "green";
            const colorClasses = isGreen
              ? {
                  border: "border-green-500/20",
                  hoverBorder: "hover:border-green-500/50",
                  text: "text-green-400",
                  shadow: "rgba(34, 197, 94, 0.25)",
                  iconShadow: "rgba(34, 197, 94, 0.5)",
                }
              : {
                  border: "border-purple-500/20",
                  hoverBorder: "hover:border-purple-500/50",
                  text: "text-purple-400",
                  shadow: "rgba(168, 85, 247, 0.25)",
                  iconShadow: "rgba(168, 85, 247, 0.5)",
                };

            return (
              <div
                key={index}
                className={`bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl ${colorClasses.border} ${colorClasses.hoverBorder} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                style={{
                  boxShadow: `0 0 25px ${colorClasses.shadow}`,
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <Icon
                    className={`w-8 h-8 ${colorClasses.text}`}
                    style={{
                      filter: `drop-shadow(0 0 6px ${colorClasses.iconShadow})`,
                    }}
                  />
                  <h3 className="text-xl font-semibold text-white">
                    {stat.title}
                  </h3>
                </div>

                <p
                  className={`text-4xl font-extrabold ${colorClasses.text} mb-3`}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
