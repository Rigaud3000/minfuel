import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '',
}) => {
  const { language } = useLanguage();
  
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -5,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      }
    },
    exit: {
      opacity: 0,
      x: 5,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      }
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={language}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;