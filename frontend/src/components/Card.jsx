import React from "react";
import { motion } from "framer-motion";

const Card = ({ title, description, icon, gradient, onClick, animateIcon = true }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-6 w-72 flex flex-col items-center cursor-pointer transform transition-all hover:-translate-y-2 hover:shadow-2xl"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
    >
      {/* Icon Container */}
      <motion.div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-r ${gradient}`}
        whileHover={animateIcon ? { scale: 1.2, rotate: 10 } : {}}
        transition={{ type: "spring", stiffness: 150 }}
      >
        {icon}
      </motion.div>

      {/* Card text*/}
      <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  );
};

export default Card;
