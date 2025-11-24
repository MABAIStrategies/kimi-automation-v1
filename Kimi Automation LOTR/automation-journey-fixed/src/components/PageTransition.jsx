import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children, direction = 1 }) => {
  return (
    <motion.div
      key={location.pathname}
      initial={{ 
        opacity: 0,
        x: direction > 0 ? 100 : -100
      }}
      animate={{ 
        opacity: 1,
        x: 0
      }}
      exit={{ 
        opacity: 0,
        x: direction > 0 ? -100 : 100
      }}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 20
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
