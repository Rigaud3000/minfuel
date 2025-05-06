// User and Auth Types
export interface User {
  id: number;
  username: string;
  name: string;
  profilePicture?: string;
  streak: number;
  points: number;
  rank?: number;
}

// Firebase User Types
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  createdAt: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  role: 'user' | 'admin';
  streak: number;
  points: number;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  lastCheckInDate?: string;
}

// Challenge Types
export interface Challenge {
  id: number;
  title: string;
  description: string;
  duration: number;
  currentDay?: number;
  completionPercentage: number;
}

// Task Types
export interface Task {
  id: number;
  challengeId: number;
  title: string;
  description?: string;
  completed: boolean;
  date: string;
}

// Check-in Types
export type MoodType = 'great' | 'good' | 'okay' | 'rough' | null;

export interface DailyCheckin {
  id: number;
  userId: number;
  date: string;
  mood: MoodType;
  cravingIntensity: number;
}

// Progress Types
export interface DayProgress {
  date: string;
  cravingIntensity: number;
  tasksCompleted: number;
  totalTasks: number;
}

export interface WeeklyProgress {
  startDate: string;
  endDate: string;
  days: DayProgress[];
  sugarFreeDays: number;
  sugarFreeDaysDiff: number;
  cravingScore: number;
  cravingScoreDiff: number;
}

// Leaderboard Types
export interface LeaderboardUser {
  id: number;
  name: string;
  profilePicture?: string;
  streak: number;
  points: number;
  rank: number;
}

// Health Tip Types
export interface HealthTip {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  readTime: string;
  articleId: string;
}

// AI Coach Types
export interface CoachMessage {
  id: number;
  sender: 'user' | 'coach';
  message: string;
  timestamp: string;
}

export interface CoachConversation {
  id: number;
  userId: number;
  title: string;
  messages: CoachMessage[];
  createdAt: string;
  updatedAt: string;
}
