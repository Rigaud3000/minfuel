import { useQuery } from '@tanstack/react-query';
import { User } from '@/lib/types';
import DailyCheckin from '@/components/dashboard/DailyCheckin';
import QuickActions from '@/components/dashboard/QuickActions';
import CurrentChallenge from '@/components/dashboard/CurrentChallenge';
import ProgressTracking from '@/components/dashboard/ProgressTracking';
import Leaderboard from '@/components/dashboard/Leaderboard';
import HealthTips from '@/components/dashboard/HealthTips';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });

  const { data: challengeDay } = useQuery<{ day: number, challenge: string }>({
    queryKey: ['/api/challenges/current/day'],
  });

  return (
    <div className="pt-4 pb-4">
      {/* Welcome Section */}
      <div className="mt-4 mb-6">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-36 mb-2" />
            <Skeleton className="h-5 w-64" />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-white">
              {t.home.welcome}, {user?.name || t.general.appName}!
            </h2>
            {challengeDay && (
              <p className="text-gray-400">
                {t.home.day} {challengeDay.day} {t.challenges.title.toLowerCase()} {challengeDay.challenge}
              </p>
            )}
          </>
        )}
      </div>

      {/* Daily Check-in */}
      <DailyCheckin />

      {/* Quick Actions */}
      <QuickActions />

      {/* Current Challenge */}
      <CurrentChallenge />

      {/* Progress Tracking */}
      <ProgressTracking />

      {/* Community Leaderboard */}
      <Leaderboard />

      {/* Health Tips */}
      <HealthTips />
    </div>
  );
}
