import { db } from './db';
import { 
  users, challenges, userChallenges, tasks, healthTips, 
  achievements, userAchievements
} from '@shared/schema';
import { format, addDays, subDays } from 'date-fns';

/**
 * Initialize the database with seed data
 */
export async function seedDatabase() {
  console.log("Starting database seeding...");
  
  try {
    // Check if database already has data
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }
    
    // Insert users
    console.log("Seeding users...");
    const [user1] = await db.insert(users).values([
      {
        username: "emma",
        password: "password123", // In a real app, this would be hashed
        name: "Emma",
        profilePicture: null,
        streak: 7,
        points: 450
      }
    ]).returning();
    
    const [user2] = await db.insert(users).values([
      {
        username: "sarah",
        password: "password123", // In a real app, this would be hashed
        name: "Sarah J.",
        profilePicture: null,
        streak: 12,
        points: 780
      }
    ]).returning();
    
    // Insert challenges
    console.log("Seeding challenges...");
    const [challenge1] = await db.insert(challenges).values([
      {
        title: "14-Day Sugar Detox",
        description: "Break free from sugar addiction with our 14-day guided program",
        duration: 14
      }
    ]).returning();
    
    const [challenge2] = await db.insert(challenges).values([
      {
        title: "Healthy Breakfast Challenge",
        description: "Start your day right with 7 days of nutritious breakfast recipes",
        duration: 7
      }
    ]).returning();
    
    const [challenge3] = await db.insert(challenges).values([
      {
        title: "Mindful Eating Workshop",
        description: "Learn to be present and aware during meals with daily mindfulness exercises",
        duration: 10
      }
    ]).returning();
    
    // Insert user challenges
    console.log("Seeding user challenges...");
    await db.insert(userChallenges).values([
      {
        userId: user1.id,
        challengeId: challenge1.id,
        startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
        currentDay: 8,
        completionPercentage: 55,
        isCompleted: false
      }
    ]);
    
    // Insert tasks
    console.log("Seeding tasks...");
    await db.insert(tasks).values([
      {
        challengeId: challenge1.id,
        title: "Log all meals in food journal",
        description: "Record everything you eat today and note any sugar cravings"
      },
      {
        challengeId: challenge1.id,
        title: "Drink 8 glasses of water",
        description: "Stay hydrated to help manage cravings"
      },
      {
        challengeId: challenge1.id,
        title: "Read ingredient labels",
        description: "Check for hidden sugars in packaged foods"
      },
      {
        challengeId: challenge1.id,
        title: "Prepare a sugar-free snack",
        description: "Try one of our suggested recipes"
      }
    ]);
    
    await db.insert(tasks).values([
      {
        challengeId: challenge2.id,
        title: "Eat protein with breakfast",
        description: "Include eggs, Greek yogurt, or another protein source"
      },
      {
        challengeId: challenge2.id,
        title: "Include a serving of fruit",
        description: "Add fresh fruit to your breakfast"
      },
      {
        challengeId: challenge2.id,
        title: "Skip sugary breakfast drinks",
        description: "Choose water, unsweetened tea, or black coffee"
      }
    ]);
    
    await db.insert(tasks).values([
      {
        challengeId: challenge3.id,
        title: "Eat without screens",
        description: "Focus only on your food during mealtime"
      },
      {
        challengeId: challenge3.id,
        title: "Practice the 5-senses exercise",
        description: "Notice the appearance, smell, texture, sound, and taste of your food"
      },
      {
        challengeId: challenge3.id,
        title: "Rate your hunger before eating",
        description: "Use a scale of 1-10 to gauge your hunger level"
      }
    ]);
    
    // Insert health tips
    console.log("Seeding health tips...");
    await db.insert(healthTips).values([
      {
        title: "Meal Prep Essentials",
        description: "Save time and stick to your nutrition goals with these meal prep strategies.",
        imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040",
        readTime: "5 min",
        articleId: "meal-prep-101"
      },
      {
        title: "Natural Sugar Alternatives",
        description: "Discover healthier ways to satisfy your sweet tooth without refined sugar.",
        imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
        readTime: "4 min",
        articleId: "sugar-alternatives"
      },
      {
        title: "Mindfulness Meditation Guide",
        description: "Simple techniques to incorporate mindfulness into your daily routine.",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
        readTime: "7 min",
        articleId: "mindfulness-basics"
      }
    ]);
    
    // Insert achievements
    console.log("Seeding achievements...");
    const [achievement1] = await db.insert(achievements).values([
      {
        title: "Sugar-Free Week",
        description: "Complete 7 consecutive days without consuming added sugar",
        icon: "trophy",
        color: "gold"
      }
    ]).returning();
    
    const [achievement2] = await db.insert(achievements).values([
      {
        title: "Meal Prep Master",
        description: "Prepare meals in advance for 5 days in a row",
        icon: "utensils",
        color: "green"
      }
    ]).returning();
    
    const [achievement3] = await db.insert(achievements).values([
      {
        title: "Early Bird",
        description: "Log breakfast before 9am for 10 days",
        icon: "sunrise",
        color: "blue"
      }
    ]).returning();
    
    // Unlock one achievement for first user
    await db.insert(userAchievements).values([
      {
        userId: user1.id,
        achievementId: achievement1.id
      }
    ]);
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}