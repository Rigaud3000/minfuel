import { db } from './db';
import { eq, and, sql, desc, gte, lte, between } from 'drizzle-orm';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
import {
  users, challenges, userChallenges, tasks, userTasks,
  dailyCheckins, healthTips, coachConversations, coachMessages,
  achievements, userAchievements,
  type User, type InsertUser,
  type Challenge, type InsertChallenge,
  type UserChallenge, type InsertUserChallenge,
  type Task, type InsertTask,
  type UserTask, type InsertUserTask,
  type DailyCheckin, type InsertDailyCheckin,
  type HealthTip, type InsertHealthTip,
  type CoachConversation, type InsertCoachConversation,
  type CoachMessage, type InsertCoachMessage,
  type Achievement, type InsertAchievement,
  type UserAchievement, type InsertUserAchievement
} from '@shared/schema';
import { IStorage } from './storage';

/**
 * Database storage implementation using PostgreSQL and Drizzle ORM
 */
export class DatabaseStorage implements IStorage {
  // User operations
  async getCurrentUser(): Promise<User> {
    // In a real application, this would use auth to get the current user
    // For demonstration purposes, we'll just return the first user
    const [user] = await db.select().from(users).limit(1);
    return user;
  }
  
  async getUserStats(): Promise<{ 
    totalDays: number; 
    completedTasks: number; 
    sugarFreeDays: number; 
    averageCraving: number; 
  }> {
    const user = await this.getCurrentUser();
    
    // Get total days since first check-in
    const [firstCheckin] = await db
      .select()
      .from(dailyCheckins)
      .where(eq(dailyCheckins.userId, user.id))
      .orderBy(dailyCheckins.date)
      .limit(1);
      
    const totalDays = firstCheckin 
      ? Math.ceil((new Date().getTime() - new Date(firstCheckin.date).getTime()) / (1000 * 3600 * 24))
      : 0;
    
    // Get completed tasks
    const completedTasksResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(userTasks)
      .where(and(
        eq(userTasks.userId, user.id),
        eq(userTasks.completed, true)
      ));
    
    const completedTasks = completedTasksResult[0]?.count || 0;
    
    // Get sugar-free days (days with craving intensity <= 3)
    const sugarFreeDaysResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(dailyCheckins)
      .where(and(
        eq(dailyCheckins.userId, user.id),
        sql`${dailyCheckins.cravingIntensity} <= 3`
      ));
    
    const sugarFreeDays = sugarFreeDaysResult[0]?.count || 0;
    
    // Get average craving
    const avgCravingResult = await db
      .select({ avg: sql<number>`avg(${dailyCheckins.cravingIntensity})` })
      .from(dailyCheckins)
      .where(eq(dailyCheckins.userId, user.id));
    
    const averageCraving = Math.round((avgCravingResult[0]?.avg || 0) * 10) / 10;
    
    return {
      totalDays,
      completedTasks,
      sugarFreeDays,
      averageCraving
    };
  }
  
  async getUserAchievements(): Promise<{ 
    id: number; 
    title: string; 
    description: string; 
    icon: string; 
    color: string; 
    unlockedAt: string | null; 
  }[]> {
    const user = await this.getCurrentUser();
    
    // Get all achievements with unlock status
    const result = await db
      .select({
        id: achievements.id,
        title: achievements.title,
        description: achievements.description,
        icon: achievements.icon,
        color: achievements.color,
        unlockedAt: userAchievements.unlockedAt
      })
      .from(achievements)
      .leftJoin(
        userAchievements,
        and(
          eq(achievements.id, userAchievements.achievementId),
          eq(userAchievements.userId, user.id)
        )
      );
    
    // Convert unlockedAt to string or null
    return result.map(achievement => ({
      ...achievement,
      unlockedAt: achievement.unlockedAt ? achievement.unlockedAt.toISOString() : null
    }));
  }
  
  // Challenge operations
  async getChallenges(): Promise<Challenge[]> {
    return db.select().from(challenges);
  }
  
  async getCurrentChallenge(): Promise<Challenge & { currentDay: number } | null> {
    const user = await this.getCurrentUser();
    
    const [currentUserChallenge] = await db
      .select()
      .from(userChallenges)
      .where(and(
        eq(userChallenges.userId, user.id),
        eq(userChallenges.isCompleted, false)
      ))
      .limit(1);
    
    if (!currentUserChallenge) {
      return null;
    }
    
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, currentUserChallenge.challengeId));
    
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
    
    const completedUserChallenges = await db
      .select()
      .from(userChallenges)
      .where(and(
        eq(userChallenges.userId, user.id),
        eq(userChallenges.isCompleted, true)
      ));
    
    if (completedUserChallenges.length === 0) {
      return [];
    }
    
    const challengeIds = completedUserChallenges.map(uc => uc.challengeId);
    
    return db
      .select()
      .from(challenges)
      .where(sql`${challenges.id} IN (${challengeIds.join(', ')})`);
  }
  
  // Task operations
  async getTodaysTasks(): Promise<Task[]> {
    const user = await this.getCurrentUser();
    const currentChallenge = await this.getCurrentChallenge();
    
    if (!currentChallenge) {
      return [];
    }
    
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Get all tasks for the current challenge
    const challengeTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.challengeId, currentChallenge.id));
    
    // Get user task completion status for today
    const userTaskCompletions = await db
      .select()
      .from(userTasks)
      .where(and(
        eq(userTasks.userId, user.id),
        eq(userTasks.date, today)
      ));
    
    // Map userTask completion data to tasks
    return challengeTasks.map(task => {
      const userTask = userTaskCompletions.find(ut => ut.taskId === task.id);
      return {
        ...task,
        completed: userTask ? userTask.completed : false,
        date: today
      };
    });
  }
  
  async updateTaskCompletion(taskId: number, completed: boolean): Promise<Task> {
    const user = await this.getCurrentUser();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Get the task
    const [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId));
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    // Check if a user task record already exists for today
    const [existingUserTask] = await db
      .select()
      .from(userTasks)
      .where(and(
        eq(userTasks.userId, user.id),
        eq(userTasks.taskId, taskId),
        eq(userTasks.date, today)
      ));
    
    if (existingUserTask) {
      // Update existing record
      await db
        .update(userTasks)
        .set({ completed })
        .where(eq(userTasks.id, existingUserTask.id));
    } else {
      // Create new record
      await db
        .insert(userTasks)
        .values({
          userId: user.id,
          taskId,
          date: today,
          completed
        });
    }
    
    // Return the updated task
    return {
      ...task,
      completed,
      date: today
    };
  }
  
  // Check-in operations
  async createDailyCheckin(checkin: InsertDailyCheckin): Promise<DailyCheckin> {
    const user = await this.getCurrentUser();
    
    // Check if there's already a check-in for today
    const today = format(new Date(), 'yyyy-MM-dd');
    const [existingCheckin] = await db
      .select()
      .from(dailyCheckins)
      .where(and(
        eq(dailyCheckins.userId, user.id),
        eq(dailyCheckins.date, today)
      ));
    
    if (existingCheckin) {
      // Update existing check-in
      const [updatedCheckin] = await db
        .update(dailyCheckins)
        .set({
          mood: checkin.mood,
          cravingIntensity: checkin.cravingIntensity
        })
        .where(eq(dailyCheckins.id, existingCheckin.id))
        .returning();
      
      return updatedCheckin;
    }
    
    // Create new check-in
    const [newCheckin] = await db
      .insert(dailyCheckins)
      .values({
        userId: user.id,
        date: checkin.date,
        mood: checkin.mood,
        cravingIntensity: checkin.cravingIntensity
      })
      .returning();
    
    return newCheckin;
  }
  
  // Progress operations
  async getProgress(startDate: Date, endDate: Date): Promise<{
    startDate: string;
    endDate: string;
    days: { date: string; cravingIntensity: number; tasksCompleted: number; totalTasks: number; }[];
    sugarFreeDays: number;
    sugarFreeDaysDiff: number;
    cravingScore: number;
    cravingScoreDiff: number;
  }> {
    const dailyProgress = await this.getDailyProgress(startDate, endDate);
    
    // Get previous week data for comparison
    const prevStartDate = subDays(startDate, 7);
    const prevEndDate = subDays(endDate, 7);
    const previousDailyProgress = await this.getDailyProgress(prevStartDate, prevEndDate);
    
    // Calculate weekly metrics
    const sugarFreeDays = dailyProgress.filter(day => day.cravingIntensity <= 3).length;
    const prevSugarFreeDays = previousDailyProgress.filter(day => day.cravingIntensity <= 3).length;
    const sugarFreeDaysDiff = sugarFreeDays - prevSugarFreeDays;
    
    const cravingScore = Math.round(dailyProgress.reduce((total, day) => total + day.cravingIntensity, 0) / dailyProgress.length * 10) / 10;
    const prevCravingScore = previousDailyProgress.length > 0 
      ? Math.round(previousDailyProgress.reduce((total, day) => total + day.cravingIntensity, 0) / previousDailyProgress.length * 10) / 10
      : 0;
    const cravingScoreDiff = Math.round((cravingScore - prevCravingScore) * 10) / 10;
    
    return {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      days: dailyProgress,
      sugarFreeDays,
      sugarFreeDaysDiff,
      cravingScore,
      cravingScoreDiff
    };
  }
  
  async getDailyProgress(startDate: Date, endDate: Date): Promise<{
    date: string;
    cravingIntensity: number;
    tasksCompleted: number;
    totalTasks: number;
  }[]> {
    const user = await this.getCurrentUser();
    const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
    
    // Generate array of all dates in the range
    const dayCount = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    const dates = Array.from({ length: dayCount }, (_, i) => {
      const date = addDays(startDate, i);
      return formatDate(date);
    });
    
    // Get check-ins for the date range
    const checkins = await db
      .select()
      .from(dailyCheckins)
      .where(and(
        eq(dailyCheckins.userId, user.id),
        between(
          dailyCheckins.date,
          formatDate(startDate),
          formatDate(endDate)
        )
      ));
    
    // Get task completions for the date range
    const taskCompletions = await db
      .select({
        date: userTasks.date,
        completedCount: sql<number>`COUNT(CASE WHEN ${userTasks.completed} = true THEN 1 END)`,
        totalCount: sql<number>`COUNT(*)`
      })
      .from(userTasks)
      .where(and(
        eq(userTasks.userId, user.id),
        between(
          userTasks.date,
          formatDate(startDate),
          formatDate(endDate)
        )
      ))
      .groupBy(userTasks.date);
    
    // Map the data to the expected format for each day
    return dates.map(date => {
      const checkin = checkins.find(c => formatDate(new Date(c.date)) === date);
      const taskData = taskCompletions.find(t => formatDate(new Date(t.date)) === date);
      
      return {
        date,
        cravingIntensity: checkin?.cravingIntensity || 0,
        tasksCompleted: taskData?.completedCount || 0,
        totalTasks: taskData?.totalCount || 0
      };
    });
  }
  
  // Leaderboard operations
  async getTopLeaderboard(): Promise<{
    id: number;
    name: string;
    profilePicture?: string;
    streak: number;
    points: number;
    rank: number;
  }[]> {
    // Get top users by points
    const topUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.points))
      .limit(10);
    
    // Add rank
    return topUsers.map((user, index) => ({
      id: user.id,
      name: user.name,
      profilePicture: user.profilePicture || undefined,
      streak: user.streak,
      points: user.points,
      rank: index + 1
    }));
  }
  
  async getCurrentUserRanking(): Promise<{
    id: number;
    name: string;
    profilePicture?: string;
    streak: number;
    points: number;
    rank: number;
  }> {
    const user = await this.getCurrentUser();
    
    // Count users with more points to determine rank
    const rankResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.points} > ${user.points}`);
    
    const rank = (rankResult[0]?.count || 0) + 1;
    
    return {
      id: user.id,
      name: user.name,
      profilePicture: user.profilePicture || undefined,
      streak: user.streak,
      points: user.points,
      rank
    };
  }
  
  // Health tips operations
  async getFeaturedHealthTip(): Promise<HealthTip> {
    // Get a random health tip
    const allTips = await db.select().from(healthTips);
    
    if (allTips.length === 0) {
      throw new Error('No health tips found');
    }
    
    const randomIndex = Math.floor(Math.random() * allTips.length);
    return allTips[randomIndex];
  }
  
  // AI Coach operations
  async getCoachConversations(userId: number): Promise<CoachConversation[]> {
    return db
      .select()
      .from(coachConversations)
      .where(eq(coachConversations.userId, userId))
      .orderBy(desc(coachConversations.updatedAt));
  }
  
  async createCoachConversation(conversation: InsertCoachConversation): Promise<CoachConversation> {
    const [newConversation] = await db
      .insert(coachConversations)
      .values(conversation)
      .returning();
    
    return newConversation;
  }
  
  async getCoachMessages(conversationId: number): Promise<CoachMessage[]> {
    return db
      .select()
      .from(coachMessages)
      .where(eq(coachMessages.conversationId, conversationId))
      .orderBy(coachMessages.timestamp);
  }
  
  async createCoachMessage(message: InsertCoachMessage): Promise<CoachMessage> {
    const [newMessage] = await db
      .insert(coachMessages)
      .values(message)
      .returning();
    
    // Update the conversation's updatedAt field
    await db
      .update(coachConversations)
      .set({ updatedAt: new Date() })
      .where(eq(coachConversations.id, message.conversationId));
    
    return newMessage;
  }
}