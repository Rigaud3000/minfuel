import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import PageTransition from '@/components/ui/PageTransition';
import { motion } from 'framer-motion';

// Icons
import { 
  Languages, 
  MessageSquareText, 
  Eye, 
  EyeOff, 
  Lightbulb, 
  Volume2, 
  Clock, 
  Type 
} from 'lucide-react';

const SettingsPage = () => {
  const { t, language, showTips, setShowTips } = useLanguage();
  const [highContrast, setHighContrast] = React.useState<boolean>(false);
  const [largeText, setLargeText] = React.useState<boolean>(false);
  const [screenReader, setScreenReader] = React.useState<boolean>(false);
  const [slowTransitions, setSlowTransitions] = React.useState<boolean>(false);
  
  // Loading saved settings on initial mount
  React.useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedLargeText = localStorage.getItem('largeText') === 'true';
    const savedScreenReader = localStorage.getItem('screenReader') === 'true';
    const savedSlowTransitions = localStorage.getItem('slowTransitions') === 'true';
    
    setHighContrast(savedHighContrast);
    setLargeText(savedLargeText);
    setScreenReader(savedScreenReader);
    setSlowTransitions(savedSlowTransitions);
    
    // Apply accessibility settings
    if (savedLargeText) {
      document.documentElement.classList.add('large-text');
    }
    if (savedHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('large-text', 'high-contrast');
    };
  }, []);
  
  // Handle toggle changes
  const handleHighContrastChange = (checked: boolean) => {
    setHighContrast(checked);
    localStorage.setItem('highContrast', checked.toString());
    
    if (checked) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };
  
  const handleLargeTextChange = (checked: boolean) => {
    setLargeText(checked);
    localStorage.setItem('largeText', checked.toString());
    
    if (checked) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  };
  
  const handleScreenReaderChange = (checked: boolean) => {
    setScreenReader(checked);
    localStorage.setItem('screenReader', checked.toString());
    // In a real app, we would integrate with actual screen reader APIs
  };
  
  const handleSlowTransitionsChange = (checked: boolean) => {
    setSlowTransitions(checked);
    localStorage.setItem('slowTransitions', checked.toString());
    
    if (checked) {
      document.documentElement.classList.add('slow-transitions');
    } else {
      document.documentElement.classList.remove('slow-transitions');
    }
  };
  
  const handleLanguageTipsChange = (checked: boolean) => {
    setShowTips(checked);
  };
  
  return (
    <PageTransition className="pb-20">
      <div className="max-w-xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Accessibility & Language Settings</h1>
        
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <Languages className="mr-2 h-5 w-5 text-secondary" />
            <h2 className="text-xl font-semibold text-white">Language Options</h2>
          </div>
          
          <div className="bg-card rounded-lg p-4 space-y-4 shadow-md">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquareText className="h-4 w-4 text-gray-400" />
                  <Label htmlFor="language-tips" className="text-white">Show language learning tips</Label>
                </div>
                <Switch 
                  id="language-tips" 
                  checked={showTips}
                  onCheckedChange={handleLanguageTipsChange}
                />
              </div>
              <p className="text-sm text-gray-400 pl-6">Display helpful tips when switching languages</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Label htmlFor="slow-transitions" className="text-white">Slower language transitions</Label>
                </div>
                <Switch 
                  id="slow-transitions" 
                  checked={slowTransitions}
                  onCheckedChange={handleSlowTransitionsChange}
                />
              </div>
              <p className="text-sm text-gray-400 pl-6">Makes language switching more gentle</p>
            </div>
          </div>
        </section>
        
        <section>
          <div className="flex items-center mb-4">
            <Eye className="mr-2 h-5 w-5 text-secondary" />
            <h2 className="text-xl font-semibold text-white">Visual Accessibility</h2>
          </div>
          
          <div className="bg-card rounded-lg p-4 space-y-4 shadow-md">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <EyeOff className="h-4 w-4 text-gray-400" />
                  <Label htmlFor="high-contrast" className="text-white">High contrast mode</Label>
                </div>
                <Switch 
                  id="high-contrast" 
                  checked={highContrast}
                  onCheckedChange={handleHighContrastChange}
                />
              </div>
              <p className="text-sm text-gray-400 pl-6">Increases contrast for better readability</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4 text-gray-400" />
                  <Label htmlFor="large-text" className="text-white">Larger text</Label>
                </div>
                <Switch 
                  id="large-text" 
                  checked={largeText}
                  onCheckedChange={handleLargeTextChange}
                />
              </div>
              <p className="text-sm text-gray-400 pl-6">Increases font size throughout the app</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-gray-400" />
                  <Label htmlFor="screen-reader" className="text-white">Screen reader optimization</Label>
                </div>
                <Switch 
                  id="screen-reader" 
                  checked={screenReader}
                  onCheckedChange={handleScreenReaderChange}
                />
              </div>
              <p className="text-sm text-gray-400 pl-6">Provides better experience for screen readers</p>
            </div>
          </div>
        </section>
        
        <div className="mt-8 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            These settings help make MindFuel more accessible and personalized to your needs.
            Changes are automatically saved and will persist across sessions.
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default SettingsPage;