import React from "react";

const DashboardCard = ({ title, value, icon: Icon, color = "text-blue-500" }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center w-64 text-center transform transition-all duration-300 hover:-translate-y-2 hover:scale-105`}
    >
      {/* Icon */}
      {Icon && (
        <div className={`text-4xl mb-3 ${color}`}>
          <Icon />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold mb-1">{title}</h3>

      {/* Value */}
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default DashboardCard;
