import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  where, 
  Timestamp, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/firebase";
import { FirestoreUser } from "@/lib/types";

// Collection references
const usersRef = collection(db, "users");
const checkinsRef = collection(db, "checkins");
const cravingsRef = collection(db, "cravings");
const tasksRef = collection(db, "tasks");

/**
 * Create or update user profile in Firestore
 */
export const saveUserProfile = async (userId: string, userData: Partial<FirestoreUser>): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    
    // Check if user already exists
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Update existing user
      await updateDoc(userDocRef, { 
        ...userData,
        updatedAt: serverTimestamp() 
      });
    } else {
      // Create new user
      await setDoc(userDocRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId: string): Promise<FirestoreUser | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as FirestoreUser;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * Save daily check-in data
 */
export const saveDailyCheckin = async (
  userId: string, 
  date: string, 
  mood: string, 
  cravingIntensity: number
): Promise<void> => {
  try {
    await addDoc(checkinsRef, {
      userId,
      date,
      mood,
      cravingIntensity,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving daily check-in:", error);
    throw error;
  }
};

/**
 * Get user's check-in history
 */
export const getUserCheckins = async (userId: string): Promise<any[]> => {
  try {
    const q = query(
      checkinsRef,
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user check-ins:", error);
    throw error;
  }
};

/**
 * Log a craving event
 */
export const logCraving = async (
  userId: string,
  intensity: number,
  trigger: string,
  didGiveIn: boolean
): Promise<void> => {
  try {
    await addDoc(cravingsRef, {
      userId,
      intensity,
      trigger,
      didGiveIn,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error logging craving:", error);
    throw error;
  }
};

/**
 * Complete a task
 */
export const completeTask = async (
  userId: string,
  taskId: string,
  completed: boolean
): Promise<void> => {
  try {
    // Save user-task relationship with completion status
    const userTaskRef = collection(db, "user_tasks");
    
    await addDoc(userTaskRef, {
      userId,
      taskId,
      completed,
      completedAt: completed ? serverTimestamp() : null,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error completing task:", error);
    throw error;
  }
};

/**
 * Get user's tasks with completion status
 */
export const getUserTasks = async (userId: string): Promise<any[]> => {
  try {
    // First get all tasks
    const allTasks = await getDocs(tasksRef);
    const tasks = allTasks.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Then get user's completion status
    const userTasksRef = collection(db, "user_tasks");
    const q = query(
      userTasksRef,
      where("userId", "==", userId)
    );
    
    const userTasksSnapshot = await getDocs(q);
    const userTasks = userTasksSnapshot.docs.map(doc => doc.data());
    
    // Merge tasks with completion status
    return tasks.map(task => {
      const userTask = userTasks.find(ut => ut.taskId === task.id);
      return {
        ...task,
        completed: userTask ? userTask.completed : false
      };
    });
  } catch (error) {
    console.error("Error getting user tasks:", error);
    throw error;
  }
};