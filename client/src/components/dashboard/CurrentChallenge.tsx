import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Challenge, Task } from '@/lib/types';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function CurrentChallenge() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const { data: challenge, isLoading: isLoadingChallenge } = useQuery<Challenge>({
    queryKey: ['/api/challenges/current'],
  });
  
  const { data: tasks, isLoading: isLoadingTasks } = useQuery<Task[]>({
    queryKey: ['/api/tasks/today'],
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: number; completed: boolean }) => {
      const response = await apiRequest('PATCH', `/api/tasks/${taskId}`, { completed });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/challenges/current'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update task',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handleToggleTask = (taskId: number, completed: boolean) => {
    toggleTaskMutation.mutate({ taskId, completed });
  };

  if (isLoadingChallenge || isLoadingTasks) {
    return (
      <div className="bg-card rounded-lg p-4 mb-6 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-6 w-56 mb-2" />
        
        <div className="flex items-center justify-center my-4">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
        
        <Skeleton className="h-6 w-32 mb-2" />
        <div className="space-y-2 mb-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center">
              <Skeleton className="w-4 h-4 mr-2" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="bg-card rounded-lg p-4 mb-6 shadow-lg text-center">
        <h3 className="text-lg font-medium text-white mb-2">{t.challenges.title}</h3>
        <p className="text-gray-400 mb-4">{t.challenges.startChallenge}</p>
        <Link href="/challenges">
          <div className="w-full py-3 bg-secondary hover:bg-green-500 text-gray-900 font-medium rounded-button cursor-pointer transition-colors text-center">
            {t.challenges.title}
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-4 mb-6 shadow-lg card-hover">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-white">{t.home.currentChallenge}</h3>
        {challenge.currentDay && challenge.duration && (
          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
            {t.home.day} {challenge.currentDay} {"/"} {challenge.duration}
          </span>
        )}
      </div>
      <h4 className="text-base font-medium text-white mb-2">{challenge.title}</h4>
      
      {/* Progress Circle */}
      <div className="flex items-center justify-center my-4">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="progress-ring" width="120" height="120">
            <circle className="progress-ring-circle-bg" cx="60" cy="60" r="54" fill="transparent"/>
            <circle 
              className="progress-ring-circle" 
              cx="60" 
              cy="60" 
              r="54" 
              fill="transparent" 
              strokeDasharray="339.292" 
              strokeDashoffset={(339.292 * (1 - challenge.completionPercentage / 100)).toString()}
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-2xl font-bold text-white">{challenge.completionPercentage}%</span>
            <p className="text-xs text-gray-400">{t.home.completed}</p>
          </div>
        </div>
      </div>
      
      {/* Today's Tasks */}
      <h4 className="text-base font-medium text-white mb-2">{t.home.todaysTasks}</h4>
      {tasks && tasks.length > 0 ? (
        <div className="space-y-2 mb-3">
          {tasks.map((task) => (
            <div className="flex items-center" key={task.id}>
              <input 
                type="checkbox" 
                id={`task-${task.id}`} 
                className="custom-checkbox mr-2"
                checked={task.completed} 
                onChange={(e) => handleToggleTask(task.id, e.target.checked)}
              />
              <label htmlFor={`task-${task.id}`} className="text-sm text-gray-300">
                {task.title}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 mb-3">{t.home.todaysTasks}</p>
      )}
      
      <Link href={`/challenges/1`}>
        <div className="w-full py-2 bg-muted hover:bg-gray-600 text-white text-sm rounded-button cursor-pointer transition-colors text-center">
          {t.challenges.title}
        </div>
      </Link>
    </div>
  );
}
