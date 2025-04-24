
import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 8
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -8
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
};

const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <motion.main
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex-1"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default AnimatedLayout;
