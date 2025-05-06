import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { MoodType } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function DailyCheckin() {
  const { t } = useLanguage();
  const [selectedMood, setSelectedMood] = useState<MoodType>(null);
  const [cravingIntensity, setCravingIntensity] = useState(3);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Translated mood labels
  const MOODS: { type: MoodType; icon: string; color: string; label: string }[] = [
    { type: 'great', icon: 'ri-emotion-happy-line', color: 'text-yellow-400', label: t.general.great || 'Great' },
    { type: 'good', icon: 'ri-emotion-normal-line', color: 'text-blue-400', label: t.general.good || 'Good' },
    { type: 'okay', icon: 'ri-emotion-unhappy-line', color: 'text-orange-400', label: t.general.okay || 'Okay' },
    { type: 'rough', icon: 'ri-emotion-sad-line', color: 'text-red-400', label: t.general.rough || 'Rough' }
  ];

  const saveCheckInMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMood) {
        throw new Error(t.general.selectMood || 'Please select your mood');
      }
      
      const response = await apiRequest('POST', '/api/checkins', {
        mood: selectedMood,
        cravingIntensity,
        date: new Date().toISOString().split('T')[0]
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t.general.success || 'Check-in saved',
        description: t.general.checkinSaved || 'Your daily check-in has been recorded',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/checkins'] });
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    },
    onError: (error) => {
      toast({
        title: t.general.error || 'Error saving check-in',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handleMoodSelection = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const handleSaveCheckIn = () => {
    saveCheckInMutation.mutate();
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-6 shadow-lg card-hover">
      <h3 className="text-lg font-medium text-white mb-3">{t.general.howAreYouFeeling || 'How are you feeling today?'}</h3>
      <div className="flex justify-between mb-4">
        {MOODS.map((mood) => (
          <button
            key={mood.type}
            className={`mood-btn w-[70px] py-2 px-1 bg-muted rounded-button flex flex-col items-center cursor-pointer transition-colors ${
              selectedMood === mood.type ? 'active' : ''
            }`}
            onClick={() => handleMoodSelection(mood.type)}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <i className={`${mood.icon} ${mood.color} ri-lg`}></i>
            </div>
            <span className="text-xs mt-1 text-gray-300">{mood.label}</span>
          </button>
        ))}
      </div>
      
      <h3 className="text-lg font-medium text-white mb-3">{t.progress.cravingScore || 'Craving intensity?'}</h3>
      <div className="flex items-center mb-2">
        <Slider 
          min={0} 
          max={10} 
          step={1}
          value={[cravingIntensity]}
          onValueChange={(value) => setCravingIntensity(value[0])}
          className="w-full"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{t.general.none || 'None'}</span>
        <span>{t.general.mild || 'Mild'}</span>
        <span>{t.general.strong || 'Strong'}</span>
        <span>{t.general.intense || 'Intense'}</span>
      </div>
      
      <Button 
        className="w-full mt-4 py-6 bg-secondary hover:bg-green-500 text-gray-900 font-medium rounded-button"
        onClick={handleSaveCheckIn}
        disabled={saveCheckInMutation.isPending}
      >
        {saveCheckInMutation.isPending ? (t.general.saving || 'Saving...') : (t.general.saveCheckin || 'Save Today\'s Check-in')}
      </Button>
    </div>
  );
}
