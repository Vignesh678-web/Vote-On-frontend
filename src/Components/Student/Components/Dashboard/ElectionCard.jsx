import React from "react";
import { Timer, CheckCircle } from "lucide-react";

const ElectionCard = ({ title, candidates, status }) => {
  const statusColor =
    status === "Ongoing"
      ? "text-green-400"
      : status === "Completed"
      ? "text-blue-400"
      : "text-gray-400";

  const borderColor =
    status === "Ongoing"
      ? "border-green-500/40"
      : status === "Completed"
      ? "border-blue-500/40"
      : "border-gray-600";

  return (
    <div
      className={`bg-gray-800 border ${borderColor} p-6 rounded-xl transition-all hover:border-green-500/50`}
      style={{ boxShadow: "0 0 25px rgba(34,197,94,0.15)" }}
    >
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">
        {candidates} candidates participating
      </p>

      <div className="flex items-center gap-2">
        {status === "Ongoing" ? (
          <Timer className="w-5 h-5 text-green-400" />
        ) : (
          <CheckCircle className="w-5 h-5 text-blue-400" />
        )}
        <span className={`font-bold text-sm ${statusColor}`}>{status}</span>
      </div>
    </div>
  );
};

export default ElectionCard;
