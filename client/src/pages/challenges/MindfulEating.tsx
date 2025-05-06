
import { useQuery } from '@tanstack/react-query';
import { Challenge, Exercise } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/ui/PageTransition';

export default function MindfulEating() {
  const { t } = useLanguage();
  
  const { data: challenge } = useQuery<Challenge>({
    queryKey: ['/api/challenges/mindful-eating'],
  });

  const { data: exercises } = useQuery<Exercise[]>({
    queryKey: ['/api/challenges/mindful-eating/exercises'],
  });

  const currentDay = challenge?.currentDay || 1;
  const progress = (currentDay / 10) * 100;

  return (
    <PageTransition className="pt-4 pb-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">Mindful Eating Workshop</h1>
        <p className="text-gray-400">Learn to be present and aware during meals with daily mindfulness exercises</p>
      </div>

      <div className="bg-card rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-secondary">{`Day ${currentDay} of 10`}</span>
        </div>
        <Progress value={progress} className="mb-4" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Day 1</span>
          <span>Day 10</span>
        </div>
      </div>

      <div className="space-y-4">
        {exercises?.map((exercise, index) => (
          <div key={exercise.id} className="bg-card rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-white">{exercise.title}</h3>
              <div className="flex items-center">
                <i className="ri-time-line mr-2 text-gray-400"></i>
                <span className="text-sm text-gray-400">{exercise.duration}min</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4">{exercise.description}</p>
            <div className="bg-muted rounded-lg p-3 mb-4">
              <h4 className="text-sm font-medium text-white mb-2">Today's Focus</h4>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {exercise.focusPoints?.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            {index + 1 === currentDay && (
              <Button className="w-full bg-secondary hover:bg-green-500 text-gray-900">
                Start Exercise
              </Button>
            )}
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
