import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { FirestoreUser } from "@/lib/types";

/**
 * Register a new user with email and password
 */
export const registerUser = async (email: string, password: string, name: string): Promise<void> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: name
    });
    
    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      role: 'user', // Default role
      streak: 0,
      points: 0
    });
    
    return;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

/**
 * Login with email and password
 */
export const loginUser = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    return;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (userId: string): Promise<FirestoreUser | null> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as FirestoreUser;
    } else {
      console.log("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

/**
 * Check if user has admin role
 */
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const userData = await getUserData(userId);
    return userData?.role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};