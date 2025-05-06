import { 
  User, InsertUser, 
  Challenge, InsertChallenge, 
  Task, InsertTask, 
  DailyCheckin, InsertDailyCheckin,
  CoachConversation, InsertCoachConversation, 
  CoachMessage, InsertCoachMessage,
  HealthTip, InsertHealthTip
} from "@shared/schema";
import { format, addDays, subDays, parseISO, isSameDay } from "date-fns";

// Interface for the storage operations
export interface IStorage {
  // User operations
  getCurrentUser(): Promise<User>;
  getUserStats(): Promise<{ totalDays: number; completedTasks: number; sugarFreeDays: number; averageCraving: number; }>;
  getUserAchievements(): Promise<{ id: number; title: string; description: string; icon: string; color: string; unlockedAt: string | null; }[]>;
  
  // Challenge operations
  getChallenges(): Promise<Challenge[]>;
  getCurrentChallenge(): Promise<Challenge & { currentDay: number } | null>;
  getCompletedChallenges(): Promise<Challenge[]>;
  
  // Task operations
  getTodaysTasks(): Promise<Task[]>;
  updateTaskCompletion(taskId: number, completed: boolean): Promise<Task>;
  
  // Check-in operations
  createDailyCheckin(checkin: InsertDailyCheckin): Promise<DailyCheckin>;
  
  // Progress operations
  getProgress(startDate: Date, endDate: Date): Promise<{
    startDate: string;
    endDate: string;
    days: { date: string; cravingIntensity: number; tasksCompleted: number; totalTasks: number; }[];
    sugarFreeDays: number;
    sugarFreeDaysDiff: number;
    cravingScore: number;
    cravingScoreDiff: number;
  }>;
  getDailyProgress(startDate: Date, endDate: Date): Promise<{ date: string; cravingIntensity: number; tasksCompleted: number; totalTasks: number; }[]>;
  
  // Leaderboard operations
  getTopLeaderboard(): Promise<{ id: number; name: string; profilePicture?: string; streak: number; points: number; rank: number; }[]>;
  getCurrentUserRanking(): Promise<{ id: number; name: string; profilePicture?: string; streak: number; points: number; rank: number; }>;
  
  // Health tips operations
  getFeaturedHealthTip(): Promise<HealthTip>;
  
  // AI Coach operations
  getCoachConversations(userId: number): Promise<CoachConversation[]>;
  createCoachConversation(conversation: InsertCoachConversation): Promise<CoachConversation>;
  getCoachMessages(conversationId: number): Promise<CoachMessage[]>;
  createCoachMessage(message: InsertCoachMessage): Promise<CoachMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private challenges: Map<number, Challenge>;
  private userChallenges: Map<number, { userId: number; challengeId: number; startDate: string; currentDay: number; completionPercentage: number; isCompleted: boolean }>;
  private tasks: Map<number, Task>;
  private userTasks: Map<number, { userId: number; taskId: number; date: string; completed: boolean }[]>;
  private dailyCheckins: Map<number, DailyCheckin>;
  private healthTips: Map<number, HealthTip>;
  private coachConversations: Map<number, CoachConversation>;
  private coachMessages: Map<number, CoachMessage>;
  private achievements: Map<number, { id: number; title: string; description: string; icon: string; color: string }>;
  private userAchievements: Map<number, { userId: number; achievementId: number; unlockedAt: string }[]>;

  private currentId: {
    user: number;
    challenge: number;
    userChallenge: number;
    task: number;
    userTask: number;
    dailyCheckin: number;
    healthTip: number;
    coachConversation: number;
    coachMessage: number;
    achievement: number;
    userAchievement: number;
  };

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.userChallenges = new Map();
    this.tasks = new Map();
    this.userTasks = new Map();
    this.dailyCheckins = new Map();
    this.healthTips = new Map();
    this.coachConversations = new Map();
    this.coachMessages = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();

    this.currentId = {
      user: 1,
      challenge: 1,
      userChallenge: 1,
      task: 1,
      userTask: 1,
      dailyCheckin: 1,
      healthTip: 1,
      coachConversation: 1,
      coachMessage: 1,
      achievement: 1,
      userAchievement: 1
    };

    // Seed initial data
    this.seedData();
  }

  private seedData() {
    // Seed a user
    const user: User = {
      id: this.currentId.user++,
      username: "emma",
      password: "password",
      name: "Emma",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
      streak: 8,
      points: 68,
      createdAt: new Date()
    };
    this.users.set(user.id, user);

    // Seed challenges
    const sugarDetoxChallenge: Challenge = {
      id: this.currentId.challenge++,
      title: "14-Day Sugar Detox",
      description: "Eliminate added sugars from your diet and break the cycle of sugar cravings. This challenge will help you reset your taste buds and develop healthier eating habits.",
      duration: 14,
      createdAt: new Date()
    };
    this.challenges.set(sugarDetoxChallenge.id, sugarDetoxChallenge);

    const healthyBreakfastChallenge: Challenge = {
      id: this.currentId.challenge++,
      title: "21-Day Healthy Breakfast",
      description: "Start your day right with nutritious breakfast options. Learn to prepare quick, balanced meals that keep you energized throughout the day.",
      duration: 21,
      createdAt: new Date()
    };
    this.challenges.set(healthyBreakfastChallenge.id, healthyBreakfastChallenge);

    const mindfulEatingChallenge: Challenge = {
      id: this.currentId.challenge++,
      title: "10-Day Mindful Eating",
      description: "Practice mindfulness during meals, focusing on eating slowly and savoring each bite. Improve your relationship with food through conscious eating.",
      duration: 10,
      createdAt: new Date()
    };
    this.challenges.set(mindfulEatingChallenge.id, mindfulEatingChallenge);

    // Assign current challenge to user
    const userChallenge = {
      id: this.currentId.userChallenge++,
      userId: user.id,
      challengeId: sugarDetoxChallenge.id,
      startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
      currentDay: 8,
      completionPercentage: 57,
      isCompleted: false
    };
    this.userChallenges.set(userChallenge.id, userChallenge);

    // Seed tasks for the Sugar Detox challenge
    const tasks = [
      {
        id: this.currentId.task++,
        challengeId: sugarDetoxChallenge.id,
        title: "Log all meals",
        description: "Record everything you eat today to increase awareness of your eating habits.",
        createdAt: new Date()
      },
      {
        id: this.currentId.task++,
        challengeId: sugarDetoxChallenge.id,
        title: "Drink 2L of water",
        description: "Stay hydrated to help manage cravings and improve overall health.",
        createdAt: new Date()
      },
      {
        id: this.currentId.task++,
        challengeId: sugarDetoxChallenge.id,
        title: "Avoid processed sugar",
        description: "Check ingredient labels and avoid foods with added sugars.",
        createdAt: new Date()
      },
      {
        id: this.currentId.task++,
        challengeId: sugarDetoxChallenge.id,
        title: "10-min mindfulness",
        description: "Practice a short mindfulness or meditation session to help manage cravings.",
        createdAt: new Date()
      }
    ];

    tasks.forEach(task => {
      this.tasks.set(task.id, task);
    });

    // Seed user tasks for today
    const today = format(new Date(), 'yyyy-MM-dd');
    const userTasksForToday = [
      {
        userId: user.id,
        taskId: tasks[0].id,
        date: today,
        completed: false
      },
      {
        userId: user.id,
        taskId: tasks[1].id,
        date: today,
        completed: true
      },
      {
        userId: user.id,
        taskId: tasks[2].id,
        date: today,
        completed: false
      },
      {
        userId: user.id,
        taskId: tasks[3].id,
        date: today,
        completed: false
      }
    ];

    this.userTasks.set(user.id, userTasksForToday);

    // Seed daily check-ins
    const today7DaysAgo = subDays(new Date(), 7);
    for (let i = 0; i < 7; i++) {
      const date = addDays(today7DaysAgo, i);
      const checkin: DailyCheckin = {
        id: this.currentId.dailyCheckin++,
        userId: user.id,
        date: format(date, 'yyyy-MM-dd'),
        mood: ['great', 'good', 'okay', 'rough'][Math.floor(Math.random() * 4)] as any,
        cravingIntensity: Math.floor(Math.random() * 7) + 2, // Random between 2-8
        createdAt: date
      };
      this.dailyCheckins.set(checkin.id, checkin);
    }

    // Seed health tips
    const healthTips = [
      {
        id: this.currentId.healthTip++,
        title: "Meal Prep Essentials",
        description: "Planning your meals in advance helps avoid sugar cravings and improves overall nutrition.",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        readTime: "5 min read",
        articleId: "meal-prep",
        createdAt: new Date()
      },
      {
        id: this.currentId.healthTip++,
        title: "Natural Sugar Alternatives",
        description: "Discover healthier ways to satisfy your sweet tooth without relying on processed sugars.",
        imageUrl: "https://images.unsplash.com/photo-1514995428455-447d4443fa7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        readTime: "4 min read",
        articleId: "natural-sweeteners",
        createdAt: new Date()
      },
      {
        id: this.currentId.healthTip++,
        title: "Mindfulness Meditation",
        description: "Learn how mindfulness practices can help manage cravings and emotional eating.",
        imageUrl: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        readTime: "6 min read",
        articleId: "mindfulness",
        createdAt: new Date()
      }
    ];

    healthTips.forEach(tip => {
      this.healthTips.set(tip.id, tip);
    });

    // Seed coach conversations
    const conversation: CoachConversation = {
      id: this.currentId.coachConversation++,
      userId: user.id,
      title: "Managing Sugar Cravings",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.coachConversations.set(conversation.id, conversation);

    // Seed coach messages
    const initialMessages = [
      {
        id: this.currentId.coachMessage++,
        conversationId: conversation.id,
        sender: 'user',
        message: "I'm having intense sugar cravings today. Any tips to handle them?",
        timestamp: subDays(new Date(), 1)
      },
      {
        id: this.currentId.coachMessage++,
        conversationId: conversation.id,
        sender: 'coach',
        message: "Sugar cravings can be challenging! Try drinking a large glass of water, as dehydration can sometimes be mistaken for cravings. Also, having a small piece of fruit or a few nuts can help satisfy your craving with natural sugars and healthy fats. Would you like more specific strategies?",
        timestamp: subDays(new Date(), 1)
      }
    ];

    initialMessages.forEach(message => {
      this.coachMessages.set(message.id, message as CoachMessage);
    });

    // Seed achievements
    const achievements = [
      {
        id: this.currentId.achievement++,
        title: "One Week Streak",
        description: "Complete daily tasks for 7 consecutive days",
        icon: "ri-fire-line",
        color: "bg-yellow-500/20 text-yellow-500"
      },
      {
        id: this.currentId.achievement++,
        title: "Sugar Fighter",
        description: "Successfully complete a sugar detox challenge",
        icon: "ri-cake-3-line",
        color: "bg-red-500/20 text-red-500"
      },
      {
        id: this.currentId.achievement++,
        title: "Mindfulness Master",
        description: "Complete 10 mindfulness sessions",
        icon: "ri-mental-health-line",
        color: "bg-blue-500/20 text-blue-500"
      },
      {
        id: this.currentId.achievement++,
        title: "Healthy Habits",
        description: "Log your meals for 14 consecutive days",
        icon: "ri-calendar-check-line",
        color: "bg-green-500/20 text-green-500"
      }
    ];

    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });

    // Seed user achievements
    const userAchievements = [
      {
        userId: user.id,
        achievementId: 1, // One Week Streak
        unlockedAt: format(subDays(new Date(), 1), 'yyyy-MM-dd')
      }
    ];

    this.userAchievements.set(user.id, userAchievements);
  }

  // User methods
  async getCurrentUser(): Promise<User> {
    // For demo, returning the seeded user
    return this.users.get(1)!;
  }

  async getUserStats(): Promise<{ totalDays: number; completedTasks: number; sugarFreeDays: number; averageCraving: number; }> {
    const user = await this.getCurrentUser();
    
    // Calculate total days from user streak
    const totalDays = user.streak;
    
    // Calculate completed tasks
    let completedTasks = 0;
    this.userTasks.forEach((tasks) => {
      completedTasks += tasks.filter(task => task.completed).length;
    });
    
    // Calculate sugar-free days (days with craving intensity <= 3)
    let sugarFreeDays = 0;
    let totalCraving = 0;
    let cravingDays = 0;
    
    this.dailyCheckins.forEach((checkin) => {
      if (checkin.userId === user.id) {
        if (checkin.cravingIntensity <= 3) {
          sugarFreeDays++;
        }
        totalCraving += checkin.cravingIntensity;
        cravingDays++;
      }
    });
    
    // Calculate average craving
    const averageCraving = cravingDays > 0 ? totalCraving / cravingDays : 0;
    
    return {
      totalDays,
      completedTasks,
      sugarFreeDays,
      averageCraving
    };
  }

  async getUserAchievements(): Promise<{ id: number; title: string; description: string; icon: string; color: string; unlockedAt: string | null; }[]> {
    const user = await this.getCurrentUser();
    const userAchievements = this.userAchievements.get(user.id) || [];
    
    // Get all achievements
    const allAchievements: { id: number; title: string; description: string; icon: string; color: string; unlockedAt: string | null; }[] = [];
    
    this.achievements.forEach((achievement) => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
      
      allAchievements.push({
        ...achievement,
        unlockedAt: userAchievement ? userAchievement.unlockedAt : null
      });
    });
    
    return allAchievements;
  }

  // Challenge methods
  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getCurrentChallenge(): Promise<(Challenge & { currentDay: number }) | null> {
    const user = await this.getCurrentUser();
    
    // Find active user challenge
    let currentUserChallenge = null;
    this.userChallenges.forEach((uc) => {
      if (uc.userId === user.id && !uc.isCompleted) {
        currentUserChallenge = uc;
      }
    });
    
    if (!currentUserChallenge) {
      return null;
    }
    
    const challenge = this.challenges.get(currentUserChallenge.challengeId);
    
    if (!challenge) {
      return null;
    }
    
    return {
      ...challenge,
      currentDay: currentUserChallenge.currentDay
    };
  }

  async getCompletedChallenges(): Promise<Challenge[]> {
    const user = await this.getCurrentUser();
    
    // Find completed user challenges
    const completedChallenges: Challenge[] = [];
    
    this.userChallenges.forEach((uc) => {
      if (uc.userId === user.id && uc.isCompleted) {
        const challenge = this.challenges.get(uc.challengeId);
        if (challenge) {
          completedChallenges.push(challenge);
        }
      }
    });
    
    return completedChallenges;
  }

  // Task methods
  async getTodaysTasks(): Promise<Task[]> {
    const user = await this.getCurrentUser();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Get user tasks for today
    const userTasksForToday = this.userTasks.get(user.id) || [];
    const todayTasks = userTasksForToday.filter(ut => ut.date === today);
    
    // Get the task details and add completed status
    return todayTasks.map(ut => {
      const task = this.tasks.get(ut.taskId)!;
      return {
        ...task,
        completed: ut.completed
      };
    });
  }

  async updateTaskCompletion(taskId: number, completed: boolean): Promise<Task> {
    const user = await this.getCurrentUser();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Update user task
    const userTasksForToday = this.userTasks.get(user.id) || [];
    const userTaskIndex = userTasksForToday.findIndex(ut => ut.taskId === taskId && ut.date === today);
    
    if (userTaskIndex >= 0) {
      userTasksForToday[userTaskIndex].completed = completed;
      this.userTasks.set(user.id, userTasksForToday);
    }
    
    // Update challenge completion percentage
    const currentChallenge = await this.getCurrentChallenge();
    if (currentChallenge) {
      let userChallengeId = 0;
      let userChallenge = null;
      
      this.userChallenges.forEach((uc, id) => {
        if (uc.userId === user.id && uc.challengeId === currentChallenge.id && !uc.isCompleted) {
          userChallengeId = id;
          userChallenge = uc;
        }
      });
      
      if (userChallenge) {
        // Calculate completion percentage based on days completed and tasks completed
        const completedTasks = userTasksForToday.filter(ut => ut.completed).length;
        const totalTasks = userTasksForToday.length;
        const daysPercentage = (userChallenge.currentDay / currentChallenge.duration) * 100;
        const tasksPercentage = (completedTasks / totalTasks) * 100;
        
        // Average the two percentages
        const completionPercentage = Math.round((daysPercentage + tasksPercentage) / 2);
        
        userChallenge.completionPercentage = completionPercentage;
        this.userChallenges.set(userChallengeId, userChallenge);
      }
    }
    
    // Return updated task
    const task = this.tasks.get(taskId)!;
    return {
      ...task,
      completed
    };
  }

  // Check-in methods
  async createDailyCheckin(checkin: InsertDailyCheckin): Promise<DailyCheckin> {
    const user = await this.getCurrentUser();
    
    // Create new check-in
    const newCheckin: DailyCheckin = {
      id: this.currentId.dailyCheckin++,
      userId: user.id,
      date: checkin.date,
      mood: checkin.mood as any,
      cravingIntensity: checkin.cravingIntensity,
      createdAt: new Date()
    };
    
    this.dailyCheckins.set(newCheckin.id, newCheckin);
    
    return newCheckin;
  }

  // Progress methods
  async getProgress(startDate: Date, endDate: Date): Promise<{
    startDate: string;
    endDate: string;
    days: { date: string; cravingIntensity: number; tasksCompleted: number; totalTasks: number; }[];
    sugarFreeDays: number;
    sugarFreeDaysDiff: number;
    cravingScore: number;
    cravingScoreDiff: number;
  }> {
    const user = await this.getCurrentUser();
    
    // Format dates
    const startFormatted = format(startDate, 'yyyy-MM-dd');
    const endFormatted = format(endDate, 'yyyy-MM-dd');
    
    // Get daily progress for the date range
    const dailyProgress = await this.getDailyProgress(startDate, endDate);
    
    // Calculate stats for current week
    const sugarFreeDays = dailyProgress.filter(day => day.cravingIntensity <= 3).length;
    const totalCraving = dailyProgress.reduce((sum, day) => sum + day.cravingIntensity, 0);
    const cravingScore = dailyProgress.length > 0 ? totalCraving / dailyProgress.length : 0;
    
    // Calculate stats for previous week
    const prevStartDate = subDays(startDate, 7);
    const prevEndDate = subDays(endDate, 7);
    const prevDailyProgress = await this.getDailyProgress(prevStartDate, prevEndDate);
    
    const prevSugarFreeDays = prevDailyProgress.filter(day => day.cravingIntensity <= 3).length;
    const prevTotalCraving = prevDailyProgress.reduce((sum, day) => sum + day.cravingIntensity, 0);
    const prevCravingScore = prevDailyProgress.length > 0 ? prevTotalCraving / prevDailyProgress.length : 0;
    
    // Calculate differences
    const sugarFreeDaysDiff = sugarFreeDays - prevSugarFreeDays;
    const cravingScoreDiff = cravingScore - prevCravingScore;
    
    return {
      startDate: startFormatted,
      endDate: endFormatted,
      days: dailyProgress,
      sugarFreeDays,
      sugarFreeDaysDiff,
      cravingScore,
      cravingScoreDiff
    };
  }

  async getDailyProgress(startDate: Date, endDate: Date): Promise<{ date: string; cravingIntensity: number; tasksCompleted: number; totalTasks: number; }[]> {
    const user = await this.getCurrentUser();
    
    // Generate dates in range
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Get progress for each date
    const dailyProgress = dates.map(date => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Find check-in for this date
      let cravingIntensity = 0;
      this.dailyCheckins.forEach((checkin) => {
        if (checkin.userId === user.id && checkin.date === formattedDate) {
          cravingIntensity = checkin.cravingIntensity;
        }
      });
      
      // Find tasks for this date
      const userTasksForDay = this.userTasks.get(user.id) || [];
      const dayTasks = userTasksForDay.filter(ut => ut.date === formattedDate);
      const tasksCompleted = dayTasks.filter(task => task.completed).length;
      const totalTasks = dayTasks.length || 4; // Default to 4 tasks if none found
      
      return {
        date: formattedDate,
        cravingIntensity,
        tasksCompleted,
        totalTasks
      };
    });
    
    return dailyProgress;
  }

  // Leaderboard methods
  async getTopLeaderboard(): Promise<{ id: number; name: string; profilePicture?: string; streak: number; points: number; rank: number; }[]> {
    // For demo purposes, create some random users for the leaderboard
    const leaderboardUsers = [
      {
        id: 2,
        name: "Sarah J.",
        profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
        streak: 14,
        points: 96,
        rank: 1
      },
      {
        id: 3,
        name: "David T.",
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
        streak: 10,
        points: 82,
        rank: 2
      },
      {
        id: 4,
        name: "Nina P.",
        profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
        streak: 8,
        points: 75,
        rank: 3
      }
    ];
    
    // Add current user to the leaderboard
    const currentUser = await this.getCurrentUser();
    const currentUserRanking = {
      id: currentUser.id,
      name: currentUser.name,
      profilePicture: currentUser.profilePicture,
      streak: currentUser.streak,
      points: currentUser.points,
      rank: 5
    };
    
    // Insert at correct position based on rank
    const allUsers = [...leaderboardUsers];
    if (currentUserRanking.rank <= leaderboardUsers.length) {
      allUsers.splice(currentUserRanking.rank - 1, 0, currentUserRanking);
    }
    
    return allUsers;
  }

  async getCurrentUserRanking(): Promise<{ id: number; name: string; profilePicture?: string; streak: number; points: number; rank: number; }> {
    const currentUser = await this.getCurrentUser();
    
    return {
      id: currentUser.id,
      name: currentUser.name,
      profilePicture: currentUser.profilePicture,
      streak: currentUser.streak,
      points: currentUser.points,
      rank: 5
    };
  }

  // Health tips methods
  async getFeaturedHealthTip(): Promise<HealthTip> {
    // Return a random health tip
    const tips = Array.from(this.healthTips.values());
    return tips[Math.floor(Math.random() * tips.length)];
  }

  // AI Coach methods
  async getCoachConversations(userId: number): Promise<CoachConversation[]> {
    const conversations: CoachConversation[] = [];
    
    this.coachConversations.forEach((conversation) => {
      if (conversation.userId === userId) {
        conversations.push(conversation);
      }
    });
    
    return conversations;
  }

  async createCoachConversation(conversation: InsertCoachConversation): Promise<CoachConversation> {
    const newConversation: CoachConversation = {
      id: this.currentId.coachConversation++,
      userId: conversation.userId,
      title: conversation.title,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.coachConversations.set(newConversation.id, newConversation);
    
    return newConversation;
  }

  async getCoachMessages(conversationId: number): Promise<CoachMessage[]> {
    const messages: CoachMessage[] = [];
    
    this.coachMessages.forEach((message) => {
      if (message.conversationId === conversationId) {
        messages.push(message);
      }
    });
    
    // Sort by timestamp
    return messages.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  }

  async createCoachMessage(message: InsertCoachMessage): Promise<CoachMessage> {
    const newMessage: CoachMessage = {
      id: this.currentId.coachMessage++,
      conversationId: message.conversationId,
      sender: message.sender,
      message: message.message,
      timestamp: new Date()
    };
    
    this.coachMessages.set(newMessage.id, newMessage);
    
    // Update conversation's updatedAt
    const conversation = this.coachConversations.get(message.conversationId);
    if (conversation) {
      conversation.updatedAt = new Date();
      this.coachConversations.set(conversation.id, conversation);
    }
    
    return newMessage;
  }
}

// Import our database storage implementation
import { DatabaseStorage } from './databaseStorage';

// Switch from memory storage to database storage
export const storage = new DatabaseStorage();
