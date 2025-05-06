import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import FlagIcon from './FlagIcon';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLanguageChange = (value: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setLanguage(value as Language);
      setIsAnimating(false);
    }, 300);
  };

  // Prepare page transition
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={language}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="flex items-center gap-2"
        >
          <div className="relative flex items-center">
            <Globe className="h-4 w-4 text-neutral-400" />
            <div className="absolute -top-1 -right-1">
              <FlagIcon language={language} size="sm" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <Select 
        value={language} 
        onValueChange={handleLanguageChange}
        onOpenChange={(open) => setIsOpen(open)}
      >
        <SelectTrigger 
          className={`w-[130px] h-8 text-sm bg-neutral-900 border-neutral-700 transition-all duration-300 ${isOpen ? 'ring-2 ring-secondary/50' : ''}`}
        >
          <SelectValue>
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={language}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  className="flex items-center gap-2"
                >
                  <FlagIcon language={language} size="sm" />
                  <span>{t.language.language}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-neutral-900 border-neutral-700">
          <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <SelectItem value="en" className="text-white hover:bg-neutral-800">
              <div className="flex items-center gap-2">
                <FlagIcon language="en" size="sm" />
                <span>{t.language.english}</span>
              </div>
            </SelectItem>
            <SelectItem value="es" className="text-white hover:bg-neutral-800">
              <div className="flex items-center gap-2">
                <FlagIcon language="es" size="sm" />
                <span>{t.language.spanish}</span>
              </div>
            </SelectItem>
            <SelectItem value="fr" className="text-white hover:bg-neutral-800">
              <div className="flex items-center gap-2">
                <FlagIcon language="fr" size="sm" />
                <span>{t.language.french}</span>
              </div>
            </SelectItem>
            <SelectItem value="de" className="text-white hover:bg-neutral-800">
              <div className="flex items-center gap-2">
                <FlagIcon language="de" size="sm" />
                <span>{t.language.german}</span>
              </div>
            </SelectItem>
            <SelectItem value="zh" className="text-white hover:bg-neutral-800">
              <div className="flex items-center gap-2">
                <FlagIcon language="zh" size="sm" />
                <span>{t.language.chinese}</span>
              </div>
            </SelectItem>
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;