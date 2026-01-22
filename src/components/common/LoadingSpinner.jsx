// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-4"
        >
          <div className="w-full h-full rounded-full border-4 border-portal-blue border-t-transparent"></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
          className="text-xl font-bold gradient-text"
        >
          Loading Fun Portal...
        </motion.div>
        <div className="mt-4 text-gray-500">
          Preparing something awesome for you! ✨
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;