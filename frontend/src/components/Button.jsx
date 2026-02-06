import React from "react";
import { motion } from "framer-motion";

const Button = ({ children, onClick, className = "" }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
                 text-white font-semibold rounded-full shadow-lg px-8 py-3 
                 transition-all ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
