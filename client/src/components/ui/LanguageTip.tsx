import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/lib/i18n/translations';
import { X } from 'lucide-react';

// Language tips for each language
const languageTips: Record<Language, string[]> = {
  en: [
    "Did you know? English has the largest vocabulary of any language, with over 170,000 words in current use.",
    "Pronunciation tip: 'Though', 'through', 'tough', and 'thorough' all sound different despite similar spelling.",
    "English idiom: 'Break a leg' means 'good luck' in performance contexts.",
    "Practice tip: Reading English books aloud helps improve pronunciation and fluency."
  ],
  es: [
    "¿Sabías que? El español es el segundo idioma más hablado del mundo por número de hablantes nativos.",
    "Consejo de pronunciación: La letra 'h' es siempre muda en español.",
    "Expresión española: 'Estar como una cabra' significa estar loco o comportarse de manera extraña.",
    "Consejo práctico: Escuchar música en español ayuda a mejorar la comprensión y el vocabulario."
  ],
  fr: [
    "Le saviez-vous? Le français est la seule langue, avec l'anglais, qui est parlée sur les cinq continents.",
    "Conseil de prononciation: En français, l'accent est généralement mis sur la dernière syllabe d'un mot.",
    "Expression française: 'Avoir la pêche' signifie être en pleine forme ou de bonne humeur.",
    "Conseil pratique: Regarder des films français avec sous-titres peut améliorer votre compréhension."
  ],
  de: [
    "Wussten Sie? Deutsch hat viele lange zusammengesetzte Wörter wie 'Donaudampfschifffahrtsgesellschaftskapitän'.",
    "Aussprachetipp: Der deutsche 'ch'-Laut wird nach 'e', 'i', 'ä', 'ö', 'ü' wie ein weiches 'h' ausgesprochen.",
    "Deutscher Ausdruck: 'Ich verstehe nur Bahnhof' bedeutet, dass man nichts versteht.",
    "Praktischer Tipp: Deutsche Märchen zu lesen kann Ihnen helfen, grundlegende Vokabeln zu lernen."
  ],
  zh: [
    "你知道吗？汉语是世界上使用人数最多的语言，有超过13亿人使用。",
    "发音提示：汉语是一种声调语言，相同的音节用不同的声调发音可以表达完全不同的含义。",
    "中文表达：'马马虎虎' 意思是一般或还可以。",
    "实用技巧：学习汉字时，理解部首可以帮助你记忆和推断字义。"
  ]
};

interface LanguageTipProps {
  show: boolean;
}

const LanguageTip: React.FC<LanguageTipProps> = ({ show }) => {
  const { language } = useLanguage();
  const [tip, setTip] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  // Get a random tip when language changes
  useEffect(() => {
    if (show && languageTips[language]) {
      const randomIndex = Math.floor(Math.random() * languageTips[language].length);
      setTip(languageTips[language][randomIndex]);
      setIsVisible(true);
      
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [language, show]);
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 right-4 left-4 md:left-auto md:w-80 bg-neutral-800 rounded-lg p-4 shadow-lg border border-secondary/20 z-50"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="mr-3 bg-secondary/20 rounded-full p-2 text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
              <div className="text-sm font-medium text-white">Language Tip</div>
            </div>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-300 pl-10">
            {tip}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguageTip;