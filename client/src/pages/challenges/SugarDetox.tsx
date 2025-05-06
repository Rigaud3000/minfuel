
import { useQuery } from '@tanstack/react-query';
import { Challenge, Task } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/ui/PageTransition';

export default function SugarDetox() {
  const { t } = useLanguage();
  
  const { data: challenge } = useQuery<Challenge>({
    queryKey: ['/api/challenges/sugar-detox'],
  });

  const { data: tasks } = useQuery<Task[]>({
    queryKey: ['/api/challenges/sugar-detox/tasks'],
  });

  const currentDay = challenge?.currentDay || 1;
  const progress = (currentDay / 14) * 100;

  return (
    <PageTransition className="pt-4 pb-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">14-Day Sugar Detox</h1>
        <p className="text-gray-400">Break free from sugar addiction with our guided program</p>
      </div>

      <div className="bg-card rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-secondary">{`Day ${currentDay} of 14`}</span>
        </div>
        <Progress value={progress} className="mb-4" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Day 1</span>
          <span>Day 14</span>
        </div>
      </div>

      <div className="space-y-4">
        {tasks?.map((task, index) => (
          <div key={task.id} className="bg-card rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-white">{`Day ${index + 1}`}</h3>
              {task.completed ? (
                <span className="px-2 py-1 bg-secondary/20 text-secondary rounded-full text-xs">
                  Completed
                </span>
              ) : index + 1 === currentDay ? (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  Current
                </span>
              ) : null}
            </div>
            <p className="text-gray-300 mb-3">{task.description}</p>
            {index + 1 === currentDay && !task.completed && (
              <Button className="w-full bg-secondary hover:bg-green-500 text-gray-900">
                Complete Day {currentDay}
              </Button>
            )}
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
