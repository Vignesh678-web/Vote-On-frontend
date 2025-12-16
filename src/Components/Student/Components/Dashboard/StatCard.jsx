import React from "react";

const StatCard = ({ icon, title, value }) => {
  return (
    <div
      className="bg-[#0a0f0a] border border-green-500/20 hover:border-green-500/50 
                 rounded-2xl p-6 sm:p-8 transition-all duration-300 
                 hover:scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.15)] 
                 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] flex flex-col justify-between"
    >
      {/* Icon Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
          {icon}
        </div>
      </div>

      {/* Title and Value */}
      <div>
        <h3 className="text-gray-200 font-medium text-sm sm:text-base tracking-wide uppercase">
          {title}
        </h3>
        <p className="text-green-400 font-extrabold text-3xl sm:text-4xl mt-2 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
