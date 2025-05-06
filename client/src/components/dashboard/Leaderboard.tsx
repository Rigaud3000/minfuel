import { useQuery } from '@tanstack/react-query';
import { LeaderboardUser } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';

export default function Leaderboard() {
  const { data: leaderboardUsers, isLoading } = useQuery<LeaderboardUser[]>({
    queryKey: ['/api/leaderboard/top'],
  });

  const { data: currentUser } = useQuery<LeaderboardUser>({
    queryKey: ['/api/leaderboard/current-user'],
  });

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-secondary/20 text-secondary';
    if (rank === 2) return 'bg-gray-600/40 text-gray-300';
    if (rank === 3) return 'bg-yellow-800/30 text-yellow-700';
    return 'bg-gray-600/40 text-gray-300';
  };

  if (isLoading) {
    return (
      <>
        <h3 className="text-lg font-medium text-white mb-3">Community Leaderboard</h3>
        <div className="bg-card rounded-lg p-4 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center bg-muted p-2 rounded-md">
                <Skeleton className="w-7 h-7 rounded-full mr-3" />
                <Skeleton className="w-8 h-8 rounded-full mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-12" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h3 className="text-lg font-medium text-white mb-3">Community Leaderboard</h3>
      <div className="bg-card rounded-lg p-4 mb-6 shadow-lg card-hover">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h4 className="text-base font-medium text-white">Top Performers</h4>
          </div>
          <Link href="/leaderboard">
            <div className="text-xs text-secondary cursor-pointer hover:underline">
              View All
            </div>
          </Link>
        </div>
        
        {leaderboardUsers && leaderboardUsers.length > 0 ? (
          <div className="space-y-3">
            {leaderboardUsers.map((user) => (
              <div 
                key={user.id} 
                className={`flex items-center bg-muted p-2 rounded-md ${
                  currentUser?.id === user.id ? 'bg-secondary/10 border border-secondary/30' : ''
                }`}
              >
                <div className={`w-7 h-7 flex items-center justify-center ${getRankStyle(user.rank)} rounded-full text-xs font-medium mr-3`}>
                  {user.rank}
                </div>
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    className="w-8 h-8 rounded-full object-cover mr-3" 
                    alt={user.name} 
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-300">{user.name.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-sm text-white font-medium">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.streak}-day streak</div>
                </div>
                <div className="text-sm font-semibold text-white">{user.points} pts</div>
              </div>
            ))}
            
            {/* Current User (if not in top) */}
            {currentUser && !leaderboardUsers.find(u => u.id === currentUser.id) && (
              <div className="flex items-center bg-secondary/10 border border-secondary/30 p-2 rounded-md">
                <div className={`w-7 h-7 flex items-center justify-center ${getRankStyle(currentUser.rank)} rounded-full text-xs font-medium mr-3`}>
                  {currentUser.rank}
                </div>
                {currentUser.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    className="w-8 h-8 rounded-full object-cover mr-3" 
                    alt={currentUser.name} 
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-300">{currentUser.name.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-sm text-white font-medium">{currentUser.name}</div>
                  <div className="text-xs text-gray-400">{currentUser.streak}-day streak</div>
                </div>
                <div className="text-sm font-semibold text-white">{currentUser.points} pts</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400">No leaderboard data available yet</p>
          </div>
        )}
      </div>
    </>
  );
}
