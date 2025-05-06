import { useQuery } from '@tanstack/react-query';
import { Challenge } from '@/lib/types';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Challenges() {
  const { t } = useLanguage();
  
  const { data: challenges, isLoading } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
  });

  const { data: currentChallenge } = useQuery<Challenge>({
    queryKey: ['/api/challenges/current'],
  });

  if (isLoading) {
    return (
      <div className="pt-4 pb-4">
        <h2 className="text-2xl font-semibold text-white mb-6">{t.challenges.title}</h2>
        
        <h3 className="text-lg font-medium text-white mb-3">{t.challenges.currentChallenge}</h3>
        <Skeleton className="h-40 w-full rounded-lg mb-6" />
        
        <h3 className="text-lg font-medium text-white mb-3">{t.challenges.available}</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-4">
      <h2 className="text-2xl font-semibold text-white mb-6">{t.challenges.title}</h2>
      
      {currentChallenge && (
        <>
          <h3 className="text-lg font-medium text-white mb-3">{t.challenges.currentChallenge}</h3>
          <div className="bg-card rounded-lg p-4 mb-6 shadow-lg card-hover">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-base font-medium text-white">{currentChallenge.title}</h4>
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                {t.home.day} {currentChallenge.currentDay} {t.general.of} {currentChallenge.duration}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{currentChallenge.description}</p>
            <div className="w-full bg-muted h-2 rounded-full mb-2">
              <div 
                className="h-full bg-secondary rounded-full" 
                style={{ width: `${currentChallenge.completionPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-3">
              <span>{t.home.day} {currentChallenge.currentDay}</span>
              <span>{currentChallenge.completionPercentage}% {t.general.complete}</span>
              <span>{t.home.day} {currentChallenge.duration}</span>
            </div>
            <Link href={`/challenges/${currentChallenge.id}`}>
              <div className="w-full py-2 bg-secondary hover:bg-green-500 text-gray-900 text-sm font-medium rounded-button cursor-pointer transition-colors text-center">
                {t.challenges.continueChallenge}
              </div>
            </Link>
          </div>
        </>
      )}
      
      <h3 className="text-lg font-medium text-white mb-3">{t.challenges.available}</h3>
      {challenges && challenges.length > 0 ? (
        <div className="space-y-4">
          {challenges
            .filter(challenge => !currentChallenge || challenge.id !== currentChallenge.id)
            .map((challenge) => (
            <div key={challenge.id} className="bg-card rounded-lg p-4 shadow-lg card-hover">
              <h4 className="text-base font-medium text-white mb-1">{challenge.title}</h4>
              <div className="flex items-center text-xs text-gray-400 mb-2">
                <i className="ri-calendar-line mr-1"></i>
                <span>{challenge.duration} {t.home.days}</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">{challenge.description}</p>
              <Link href={`/challenges/${challenge.id}`}>
                <div className="w-full py-2 bg-muted hover:bg-gray-600 text-white text-sm rounded-button cursor-pointer transition-colors text-center">
                  {t.general.viewDetails}
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg p-4 text-center">
          <p className="text-gray-400 mb-3">{t.challenges.noAvailable}</p>
        </div>
      )}
    </div>
  );
}
