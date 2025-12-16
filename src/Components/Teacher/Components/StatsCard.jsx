// components/StatsCard.jsx
import React from 'react';

const StatsCard = ({ icon: Icon, value, label, description, color, trend }) => {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-green-400/30 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-xl bg-gray-700 group-hover:bg-green-400/10 transition-colors duration-300">
              <Icon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                {label}
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {value}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              {description}
            </p>
            
            {trend && (
              <p className={`text-xs font-medium ${
                trend.includes('+') 
                  ? 'text-green-400' 
                  : 'text-gray-500'
              }`}>
                {trend}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;