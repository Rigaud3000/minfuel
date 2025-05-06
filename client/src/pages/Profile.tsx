import { useQuery } from '@tanstack/react-query';
import { User, Challenge } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { format } from 'date-fns';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import { getUserProfile } from '@/lib/firebase/firestore';
import { logoutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function Profile() {
  const [firebaseUser, authLoading] = useAuthState(auth);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [firestoreUserData, setFirestoreUserData] = useState<any>(null);
  const [isLoadingFirestoreData, setIsLoadingFirestoreData] = useState(false);

  // Fetch server-side data
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });

  const { data: completedChallenges, isLoading: isLoadingChallenges } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges/completed'],
  });

  const { data: stats } = useQuery<{
    totalDays: number;
    completedTasks: number;
    sugarFreeDays: number;
    averageCraving: number;
  }>({
    queryKey: ['/api/users/current/stats'],
  });

  const { data: achievements } = useQuery<{
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
    unlockedAt: string | null;
  }[]>({
    queryKey: ['/api/users/current/achievements'],
  });
  
  // Fetch Firestore user data
  useEffect(() => {
    const fetchFirestoreData = async () => {
      if (!firebaseUser) return;
      
      try {
        setIsLoadingFirestoreData(true);
        const userData = await getUserProfile(firebaseUser.uid);
        setFirestoreUserData(userData);
      } catch (error) {
        console.error("Error fetching Firestore user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoadingFirestoreData(false);
      }
    };
    
    fetchFirestoreData();
  }, [firebaseUser, toast]);
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await logoutUser();
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
      setLocation('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoadingUser) {
    return (
      <div className="pt-4 pb-4">
        <div className="flex flex-col items-center mb-6">
          <Skeleton className="w-24 h-24 rounded-full mb-3" />
          <Skeleton className="h-7 w-32 mb-1" />
          <Skeleton className="h-5 w-48" />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-4 pb-4 text-center">
        <p className="text-gray-400 mb-4">Please log in to view your profile</p>
        <Button>Log In</Button>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        {user.profilePicture ? (
          <img 
            src={user.profilePicture} 
            alt={user.name} 
            className="w-24 h-24 rounded-full object-cover border-2 border-secondary mb-3" 
          />
        ) : (
          <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center text-3xl text-secondary mb-3">
            {user.name.charAt(0)}
          </div>
        )}
        <h2 className="text-2xl font-semibold text-white mb-1">{user.name}</h2>
        <div className="flex items-center text-gray-400">
          <i className="ri-fire-fill text-orange-400 mr-1"></i>
          <span className="mr-3">{user.streak}-day streak</span>
          <i className="ri-star-fill text-yellow-400 mr-1"></i>
          <span>{user.points} points</span>
        </div>
      </div>
      
      {/* Stats Section */}
      <h3 className="text-lg font-medium text-white mb-3">Your Stats</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card rounded-lg p-3">
          <div className="flex items-center mb-1">
            <i className="ri-calendar-check-fill text-secondary mr-2"></i>
            <span className="text-gray-300 text-sm">Clean Eating Journey</span>
          </div>
          <span className="text-xl font-semibold text-white">{stats?.totalDays || 0} days</span>
        </div>
        <div className="bg-card rounded-lg p-3">
          <div className="flex items-center mb-1">
            <i className="ri-checkbox-circle-fill text-blue-400 mr-2"></i>
            <span className="text-gray-300 text-sm">Tasks Completed</span>
          </div>
          <span className="text-xl font-semibold text-white">{stats?.completedTasks || 0}</span>
        </div>
        <div className="bg-card rounded-lg p-3">
          <div className="flex items-center mb-1">
            <i className="ri-cake-3-fill text-red-400 mr-2 line-through"></i>
            <span className="text-gray-300 text-sm">Sugar-Free Days</span>
          </div>
          <span className="text-xl font-semibold text-white">{stats?.sugarFreeDays || 0}</span>
        </div>
        <div className="bg-card rounded-lg p-3">
          <div className="flex items-center mb-1">
            <i className="ri-mental-health-fill text-purple-400 mr-2"></i>
            <span className="text-gray-300 text-sm">Avg. Craving Score</span>
          </div>
          <span className="text-xl font-semibold text-white">{stats?.averageCraving?.toFixed(1) || 0}</span>
        </div>
      </div>
      
      <Tabs defaultValue="achievements" className="mb-6">
        <TabsList className="grid grid-cols-2 w-full bg-muted">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Completed Challenges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements">
          <div className="bg-card rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3">Your Achievements</h3>
            
            {achievements && achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`flex items-center p-3 rounded-lg ${
                      achievement.unlockedAt 
                        ? 'bg-muted' 
                        : 'bg-gray-800/50 opacity-60'
                    }`}
                  >
                    <div className={`w-10 h-10 ${achievement.color} rounded-full flex items-center justify-center mr-3`}>
                      <i className={`${achievement.icon} text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-white font-medium">{achievement.title}</h4>
                        {achievement.unlockedAt && (
                          <div className="ml-2 text-xs bg-secondary/20 text-secondary px-2 rounded-full">
                            Unlocked
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{achievement.description}</p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Unlocked on {format(new Date(achievement.unlockedAt), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">
                Complete challenges to earn achievements!
              </p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="challenges">
          <div className="bg-card rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3">Completed Challenges</h3>
            
            {isLoadingChallenges ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : completedChallenges && completedChallenges.length > 0 ? (
              <div className="space-y-3">
                {completedChallenges.map((challenge) => (
                  <Link key={challenge.id} href={`/challenges/${challenge.id}`}>
                    <div className="bg-muted p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                      <h4 className="text-white font-medium">{challenge.title}</h4>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <i className="ri-calendar-line mr-1"></i>
                        <span>{challenge.duration} days</span>
                        <div className="ml-auto bg-green-500/20 text-green-400 rounded-full px-2 py-0.5">
                          Completed
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">
                You haven't completed any challenges yet
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex space-x-3">
        <Button variant="outline" className="flex-1">
          Settings
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-950/30"
          onClick={handleSignOut}
        >
          <i className="ri-logout-box-line mr-2"></i> Sign Out
        </Button>
      </div>
      
      {/* Firestore User Data Section (if available) */}
      {firestoreUserData && (
        <div className="mt-6 p-4 bg-card rounded-lg">
          <h3 className="text-lg font-medium text-white mb-3">Firestore Data</h3>
          <div className="space-y-2">
            {firebaseUser?.displayName && (
              <div className="flex">
                <span className="text-gray-400 w-32">Display Name:</span>
                <span className="text-white">{firebaseUser.displayName}</span>
              </div>
            )}
            <div className="flex">
              <span className="text-gray-400 w-32">Email:</span>
              <span className="text-white">{firebaseUser?.email}</span>
            </div>
            {firestoreUserData.createdAt && (
              <div className="flex">
                <span className="text-gray-400 w-32">Member Since:</span>
                <span className="text-white">
                  {new Date(firestoreUserData.createdAt.toDate()).toLocaleDateString()}
                </span>
              </div>
            )}
            {firestoreUserData.streak !== undefined && (
              <div className="flex">
                <span className="text-gray-400 w-32">Streak:</span>
                <span className="text-white">{firestoreUserData.streak} days</span>
              </div>
            )}
            {firestoreUserData.points !== undefined && (
              <div className="flex">
                <span className="text-gray-400 w-32">Points:</span>
                <span className="text-white">{firestoreUserData.points} points</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
