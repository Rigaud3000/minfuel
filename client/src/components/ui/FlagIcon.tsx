import React from 'react';
import { Language } from '@/lib/i18n/translations';
import { motion } from 'framer-motion';

interface FlagIconProps {
  language: Language;
  size?: 'sm' | 'md' | 'lg';
}

const getFlagPath = (language: Language): string => {
  switch (language) {
    case 'en':
      return "M0,0 L60,0 L60,30 L0,30 L0,0 Z M0,0 L60,0 L60,4 L0,4 L0,0 Z M0,4 L60,4 L60,8 L0,8 L0,4 Z M0,8 L60,8 L60,12 L0,12 L0,8 Z M0,12 L60,12 L60,16 L0,16 L0,12 Z M0,16 L60,16 L60,20 L0,20 L0,16 Z M0,20 L60,20 L60,24 L0,24 L0,20 Z M0,24 L60,24 L60,28 L0,28 L0,24 Z M0,28 L60,28 L60,32 L0,32 L0,28 Z"; // US flag stripes
    case 'es':
      return "M0,0 L60,0 L60,10 L0,10 L0,0 Z M0,10 L60,10 L60,20 L0,20 L0,10 Z M0,20 L60,20 L60,30 L0,30 L0,20 Z"; // Spanish flag stripes
    case 'fr':
      return "M0,0 L20,0 L20,30 L0,30 L0,0 Z M20,0 L40,0 L40,30 L20,30 L20,0 Z M40,0 L60,0 L60,30 L40,30 L40,0 Z"; // French flag stripes
    case 'de':
      return "M0,0 L60,0 L60,10 L0,10 L0,0 Z M0,10 L60,10 L60,20 L0,20 L0,10 Z M0,20 L60,20 L60,30 L0,30 L0,20 Z"; // German flag stripes
    case 'zh':
      return "M0,0 L60,0 L60,30 L0,30 L0,0 Z"; // Chinese flag base
    default:
      return '';
  }
};

const getFlagColors = (language: Language): string[] => {
  switch (language) {
    case 'en':
      return ['#BD3D44', '#FFFFFF', '#192F5D']; // US flag colors
    case 'es':
      return ['#AA151B', '#F1BF00', '#AA151B']; // Spanish flag colors
    case 'fr':
      return ['#002395', '#FFFFFF', '#ED2939']; // French flag colors
    case 'de':
      return ['#000000', '#DD0000', '#FFCE00']; // German flag colors
    case 'zh':
      return ['#DE2910', '#FFDE00']; // Chinese flag colors
    default:
      return ['#CCCCCC'];
  }
};

const FlagIcon: React.FC<FlagIconProps> = ({ language, size = 'md' }) => {
  const colors = getFlagColors(language);
  const path = getFlagPath(language);
  
  const dimensions = {
    sm: { width: 20, height: 10 },
    md: { width: 30, height: 15 },
    lg: { width: 40, height: 20 }
  };
  
  const { width, height } = dimensions[size];
  
  // Animation variants
  const flagVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    exit: { scale: 0.8, opacity: 0 },
  };

  // Special handling for Chinese flag with star
  if (language === 'zh') {
    return (
      <motion.svg
        viewBox="0 0 60 30"
        width={width}
        height={height}
        variants={flagVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="rounded-sm shadow-sm"
      >
        <rect width="60" height="30" fill={colors[0]} />
        <path
          d="M12,8 L14.5,13.5 L20,12 L15.5,15.5 L18,21 L12,17.5 L6,21 L8.5,15.5 L4,12 L9.5,13.5 Z"
          fill={colors[1]}
        />
        <circle cx="2" cy="2" r="1" transform="translate(10 5)" fill={colors[1]} />
        <circle cx="2" cy="2" r="1" transform="translate(17 8)" fill={colors[1]} />
        <circle cx="2" cy="2" r="1" transform="translate(17 14)" fill={colors[1]} />
        <circle cx="2" cy="2" r="1" transform="translate(10 17)" fill={colors[1]} />
      </motion.svg>
    );
  }

  // For France vertical bars
  if (language === 'fr') {
    return (
      <motion.svg
        viewBox="0 0 60 30"
        width={width}
        height={height}
        variants={flagVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="rounded-sm shadow-sm"
      >
        <rect x="0" y="0" width="20" height="30" fill={colors[0]} />
        <rect x="20" y="0" width="20" height="30" fill={colors[1]} />
        <rect x="40" y="0" width="20" height="30" fill={colors[2]} />
      </motion.svg>
    );
  }

  // For Germany horizontal bars
  if (language === 'de') {
    return (
      <motion.svg
        viewBox="0 0 60 30"
        width={width}
        height={height}
        variants={flagVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="rounded-sm shadow-sm"
      >
        <rect x="0" y="0" width="60" height="10" fill={colors[0]} />
        <rect x="0" y="10" width="60" height="10" fill={colors[1]} />
        <rect x="0" y="20" width="60" height="10" fill={colors[2]} />
      </motion.svg>
    );
  }

  // For Spain horizontal bars with emblem hint
  if (language === 'es') {
    return (
      <motion.svg
        viewBox="0 0 60 30"
        width={width}
        height={height}
        variants={flagVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="rounded-sm shadow-sm"
      >
        <rect x="0" y="0" width="60" height="7.5" fill={colors[0]} />
        <rect x="0" y="7.5" width="60" height="15" fill={colors[1]} />
        <rect x="0" y="22.5" width="60" height="7.5" fill={colors[0]} />
        <circle cx="20" cy="15" r="3" fill="#AA151B" />
      </motion.svg>
    );
  }

  // For US simplified flag with stars hint
  return (
    <motion.svg
      viewBox="0 0 60 30"
      width={width}
      height={height}
      variants={flagVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="rounded-sm shadow-sm"
    >
      <rect x="0" y="0" width="60" height="30" fill={colors[1]} />
      <rect x="0" y="0" width="60" height="3.75" fill={colors[0]} />
      <rect x="0" y="7.5" width="60" height="3.75" fill={colors[0]} />
      <rect x="0" y="15" width="60" height="3.75" fill={colors[0]} />
      <rect x="0" y="22.5" width="60" height="3.75" fill={colors[0]} />
      <rect x="0" y="0" width="24" height="16.25" fill={colors[2]} />
      <g fill={colors[1]}>
        <circle cx="4" cy="4" r="1.5" />
        <circle cx="12" cy="4" r="1.5" />
        <circle cx="20" cy="4" r="1.5" />
        <circle cx="8" cy="8" r="1.5" />
        <circle cx="16" cy="8" r="1.5" />
        <circle cx="4" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="20" cy="12" r="1.5" />
      </g>
    </motion.svg>
  );
};

export default FlagIcon;