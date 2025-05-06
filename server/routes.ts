import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertDailyCheckinSchema } from "@shared/schema";
import { getAICoachResponse } from "./services/ai-coach";
import stripeService, { SubscriptionPlan } from "./services/stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // All API routes are prefixed with /api

  // ----- User Routes -----
  app.get("/api/users/current", async (req, res) => {
    // For demo, we're using a mock user
    // In production, this would check authenticated user from session
    try {
      const user = await storage.getCurrentUser();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.get("/api/users/current/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user stats" });
    }
  });

  app.get("/api/users/current/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user achievements" });
    }
  });

  // ----- Challenge Routes -----
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ error: "Failed to get challenges" });
    }
  });

  app.get("/api/challenges/current", async (req, res) => {
    try {
      const challenge = await storage.getCurrentChallenge();
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to get current challenge" });
    }
  });

  app.get("/api/challenges/completed", async (req, res) => {
    try {
      const challenges = await storage.getCompletedChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ error: "Failed to get completed challenges" });
    }
  });

  app.get("/api/challenges/current/day", async (req, res) => {
    try {
      const challenge = await storage.getCurrentChallenge();
      if (!challenge) {
        return res.status(404).json({ error: "No active challenge" });
      }
      
      res.json({
        day: challenge.currentDay,
        challenge: challenge.title
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get current challenge day" });
    }
  });

  // ----- Task Routes -----
  app.get("/api/tasks/today", async (req, res) => {
    try {
      const tasks = await storage.getTodaysTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to get today's tasks" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const { completed } = req.body;
      
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: "Invalid completed status" });
      }
      
      const updatedTask = await storage.updateTaskCompletion(taskId, completed);
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  // ----- Check-in Routes -----
  app.post("/api/checkins", async (req, res) => {
    try {
      const schema = insertDailyCheckinSchema.extend({
        mood: z.enum(['great', 'good', 'okay', 'rough']),
        cravingIntensity: z.number().min(0).max(10),
        date: z.string(), // will convert to Date
      });

      // Parse the request body first
      const parsedData = schema.parse(req.body);
      
      // Then create the final object with required userId
      const validData = {
        ...parsedData,
        userId: 1 // Set userId to current user (mock for now)
      };

      const checkin = await storage.createDailyCheckin(validData);
      res.status(201).json(checkin);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid check-in data" });
    }
  });

  // ----- Progress Routes -----
  app.get("/api/progress", async (req, res) => {
    try {
      const { startDate, endDate } = req.query as { startDate?: string, endDate?: string };
      
      // Default to last 7 days if no dates provided
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);
      
      const start = startDate ? new Date(startDate) : sevenDaysAgo;
      const end = endDate ? new Date(endDate) : today;
      
      const progress = await storage.getProgress(start, end);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to get progress" });
    }
  });

  app.get("/api/progress/week", async (req, res) => {
    try {
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);
      
      const progress = await storage.getProgress(sevenDaysAgo, today);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to get weekly progress" });
    }
  });

  app.get("/api/progress/month", async (req, res) => {
    try {
      const { month } = req.query as { month?: string };
      
      let startDate: Date, endDate: Date;
      
      if (month) {
        const [year, monthNum] = month.split('-').map(Number);
        startDate = new Date(year, monthNum - 1, 1);
        endDate = new Date(year, monthNum, 0); // Last day of month
      } else {
        const today = new Date();
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      }
      
      const progress = await storage.getDailyProgress(startDate, endDate);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to get monthly progress" });
    }
  });

  // ----- Leaderboard Routes -----
  app.get("/api/leaderboard/top", async (req, res) => {
    try {
      const leaderboard = await storage.getTopLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  app.get("/api/leaderboard/current-user", async (req, res) => {
    try {
      const user = await storage.getCurrentUserRanking();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user ranking" });
    }
  });

  // ----- Health Tips Routes -----
  app.get("/api/health-tips/featured", async (req, res) => {
    try {
      const tip = await storage.getFeaturedHealthTip();
      res.json(tip);
    } catch (error) {
      res.status(500).json({ error: "Failed to get featured health tip" });
    }
  });

  // ----- AI Coach Routes -----
  app.get("/api/coach/conversations", async (req, res) => {
    try {
      const conversations = await storage.getCoachConversations(1); // mock userId=1
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get coach conversations" });
    }
  });

  app.post("/api/coach/conversations", async (req, res) => {
    try {
      const { title } = req.body;
      const conversation = await storage.createCoachConversation({
        userId: 1, // mock userId
        title: title || "New Conversation"
      });
      res.status(201).json(conversation);
    } catch (error) {
      res.status(400).json({ error: "Failed to create conversation" });
    }
  });

  app.get("/api/coach/messages", async (_req, res) => {
    // When no conversation is selected, return an empty array
    res.json([]);
  });

  app.get("/api/coach/messages/:conversationId", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const messages = await storage.getCoachMessages(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get coach messages" });
    }
  });

  app.post("/api/coach/conversations/:conversationId/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      // Save user message
      const userMessage = await storage.createCoachMessage({
        conversationId,
        sender: 'user',
        message
      });
      
      // Get AI response
      const aiResponse = await getAICoachResponse(message);
      
      // Save AI response
      const coachMessage = await storage.createCoachMessage({
        conversationId,
        sender: 'coach',
        message: aiResponse
      });
      
      res.status(201).json([userMessage, coachMessage]);
    } catch (error) {
      res.status(400).json({ error: "Failed to send message" });
    }
  });

  // ----- Subscription/Payment Routes -----
  app.post("/api/subscription/create-customer", async (req, res) => {
    try {
      const { email, name } = req.body;
      
      if (!email || !name) {
        return res.status(400).json({ error: "Email and name are required" });
      }
      
      const customer = await stripeService.createCustomer(email, name);
      
      // In a real app, you'd update the user record with the Stripe customer ID
      res.status(201).json({ 
        success: true,
        customerId: customer.id 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/subscription/create", async (req, res) => {
    try {
      const { customerId, planType } = req.body;
      
      if (!customerId || !planType) {
        return res.status(400).json({ error: "Customer ID and plan type are required" });
      }
      
      // Validate plan type
      if (!Object.values(SubscriptionPlan).includes(planType as SubscriptionPlan)) {
        return res.status(400).json({ error: "Invalid plan type" });
      }
      
      const subscription = await stripeService.createSubscription(
        customerId, 
        planType as SubscriptionPlan
      );
      
      // In a real app, you'd update the user record with the subscription ID
      res.status(201).json(subscription);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/subscription/cancel", async (req, res) => {
    try {
      const { subscriptionId } = req.body;
      
      if (!subscriptionId) {
        return res.status(400).json({ error: "Subscription ID is required" });
      }
      
      const subscription = await stripeService.cancelSubscription(subscriptionId);
      
      // In a real app, you'd update the user record to remove subscription info
      res.json({ success: true, subscription });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/subscription/:subscriptionId", async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      
      if (!subscriptionId) {
        return res.status(400).json({ error: "Subscription ID is required" });
      }
      
      const subscription = await stripeService.getSubscription(subscriptionId);
      res.json(subscription);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/payment/create-intent", async (req, res) => {
    try {
      const { amount, customerId } = req.body;
      
      if (!amount || typeof amount !== 'number') {
        return res.status(400).json({ error: "Valid amount is required" });
      }
      
      const amountInCents = Math.round(amount * 100);
      
      const paymentIntent = await stripeService.createPaymentIntent(
        amountInCents,
        customerId
      );
      
      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/payment/create-checkout", async (req, res) => {
    try {
      const { customerId, amount, description, successUrl, cancelUrl } = req.body;
      
      if (!customerId || !amount || !successUrl || !cancelUrl) {
        return res.status(400).json({ 
          error: "Customer ID, amount, success URL and cancel URL are required" 
        });
      }
      
      const amountInCents = Math.round(amount * 100);
      
      const session = await stripeService.createCheckoutSession(
        customerId,
        amountInCents,
        description || "MindFuel Premium Access",
        successUrl,
        cancelUrl
      );
      
      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
