import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, translations, en } from './translations';
import LanguageTip from '@/components/ui/LanguageTip';

// Define the context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  showTips: boolean;
  setShowTips: (show: boolean) => void;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: en,
  showTips: true,
  setShowTips: () => {},
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

// Language provider component
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Get saved language from local storage or default to 'en'
  const getSavedLanguage = (): Language => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      return savedLanguage && Object.keys(translations).includes(savedLanguage) 
        ? savedLanguage 
        : 'en';
    }
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getSavedLanguage());
  const [t, setTranslations] = useState<Translations>(translations[language]);
  const [showTips, setShowTips] = useState<boolean>(true);
  const [showCurrentTip, setShowCurrentTip] = useState<boolean>(false);

  // Update the language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
    setTranslations(translations[lang]);
    
    // Show a language tip when language changes (if tips are enabled)
    if (showTips && lang !== language) {
      setShowCurrentTip(true);
      
      // Hide the tip after displaying it once
      setTimeout(() => {
        setShowCurrentTip(false);
      }, 12000); // 12 seconds (to account for animation)
    }
  };

  // Initialize language from local storage on first render
  useEffect(() => {
    const savedLang = getSavedLanguage();
    setLanguageState(savedLang);
    setTranslations(translations[savedLang]);
    
    // Check if language tips are disabled in localStorage
    if (typeof window !== 'undefined') {
      const tipsDisabled = localStorage.getItem('languageTipsDisabled') === 'true';
      setShowTips(!tipsDisabled);
    }
  }, []);

  // Update localStorage when showTips changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('languageTipsDisabled', (!showTips).toString());
    }
  }, [showTips]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, showTips, setShowTips }}>
      {children}
      <LanguageTip show={showCurrentTip} />
    </LanguageContext.Provider>
  );
};