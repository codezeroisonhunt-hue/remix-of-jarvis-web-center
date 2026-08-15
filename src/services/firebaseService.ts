import { toast } from 'sonner';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface CommandData {
  action: string;
  [key: string]: any;
}

// User type definition
export interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  lastSignInTime?: string;
}

// Firebase configuration (same as in admin.html)
const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyCvFSBPzE9yne0ziYqruXAL5MLIHCHY10o",
  authDomain: "corejarvis-22369.firebaseapp.com",
  projectId: "corejarvis-22369",
  storageBucket: "corejarvis-22369.appspot.com",
  messagingSenderId: "307781562443",
  appId: "1:307781562443:web:23c1c49ab1e10a48089dce"
};

// Function to initialize Firebase - will use dynamic import to prevent loading issues
let firebaseInitialized = false;
let db: any = null;
let auth: any = null;
let googleProvider: any = null;

export const initializeFirebase = async (): Promise<boolean> => {
  if (firebaseInitialized) return true;
  
  try {
    // Dynamically import Firebase
    const firebaseApp = await import('firebase/app');
    const firestoreModule = await import('firebase/firestore');
    const authModule = await import('firebase/auth');
    
    // Initialize Firebase
    const app = firebaseApp.initializeApp(firebaseConfig);
    db = firestoreModule.getFirestore(app);
    auth = authModule.getAuth(app);
    googleProvider = new authModule.GoogleAuthProvider();
    
    firebaseInitialized = true;
    
    console.log("Firebase initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    return false;
  }
};

// Authentication functions
export const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
  if (!await initializeFirebase()) {
    toast("Firebase Error", {
      description: "Could not initialize Firebase for authentication."
    });
    return null;
  }
  
  try {
    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
    const result = await signInWithPopup(auth, googleProvider);
    
    // This gives you a Google Access Token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    
    // Create user profile data
    const userData: FirebaseUser = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastSignInTime: user.metadata.lastSignInTime
    };
    
    // Store or update user data in Firestore
    await storeUserProfile(userData);
    
    toast("Sign In Successful", {
      description: `Welcome, ${user.displayName || "User"}!`
    });
    
    return userData;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    toast("Authentication Error", {
      description: error.message || "Failed to sign in with Google"
    });
    return null;
  }
};

export const signInWithFacebook = async (): Promise<FirebaseUser | null> => {
  if (!await initializeFirebase()) {
    toast("Firebase Error", {
      description: "Could not initialize Firebase for authentication."
    });
    return null;
  }
  
  try {
    const { signInWithPopup, FacebookAuthProvider } = await import('firebase/auth');
    const facebookProvider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, facebookProvider);
    
    const user = result.user;
    
    // Create user profile data
    const userData: FirebaseUser = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastSignInTime: user.metadata.lastSignInTime
    };
    
    // Store or update user data in Firestore
    await storeUserProfile(userData);
    
    toast("Sign In Successful", {
      description: `Welcome, ${user.displayName || "User"}!`
    });
    
    return userData;
  } catch (error: any) {
    console.error("Error signing in with Facebook:", error);
    toast("Authentication Error", {
      description: error.message || "Failed to sign in with Facebook"
    });
    return null;
  }
};

export const signInWithGithub = async (): Promise<FirebaseUser | null> => {
  if (!await initializeFirebase()) {
    toast("Firebase Error", {
      description: "Could not initialize Firebase for authentication."
    });
    return null;
  }
  
  try {
    const { signInWithPopup, GithubAuthProvider } = await import('firebase/auth');
    const githubProvider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, githubProvider);
    
    const user = result.user;
    
    // Create user profile data
    const userData: FirebaseUser = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastSignInTime: user.metadata.lastSignInTime
    };
    
    // Store or update user data in Firestore
    await storeUserProfile(userData);
    
    toast("Sign In Successful", {
      description: `Welcome, ${user.displayName || "User"}!`
    });
    
    return userData;
  } catch (error: any) {
    console.error("Error signing in with GitHub:", error);
    toast("Authentication Error", {
      description: error.message || "Failed to sign in with GitHub"
    });
    return null;
  }
};

export const signOut = async (): Promise<boolean> => {
  if (!await initializeFirebase()) return false;
  
  try {
    await auth.signOut();
    toast("Signed Out", {
      description: "You have been successfully signed out."
    });
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    toast("Sign Out Error", {
      description: "Failed to sign out."
    });
    return false;
  }
};

export const getCurrentUser = async (): Promise<FirebaseUser | null> => {
  if (!await initializeFirebase()) return null;
  
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      unsubscribe();
      if (user) {
        const userData: FirebaseUser = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastSignInTime: user.metadata.lastSignInTime
        };
        resolve(userData);
      } else {
        resolve(null);
      }
    });
  });
};

// Store user profile in Firestore
const storeUserProfile = async (userData: FirebaseUser): Promise<void> => {
  if (!db) return;
  
  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    await setDoc(doc(db, "users", userData.uid), {
      ...userData,
      lastUpdated: serverTimestamp()
    }, { merge: true });
    console.log("User profile stored successfully");
  } catch (error) {
    console.error("Error storing user profile:", error);
  }
};

// Listen for commands from Firebase
export const listenForCommands = async (callback: (command: CommandData) => void) => {
  if (!await initializeFirebase()) {
    toast("Firebase Error", {
      description: "Could not initialize Firebase to listen for commands."
    });
    return () => {};
  }
  
  try {
    const { collection, query, orderBy, limit, onSnapshot } = await import('firebase/firestore');
    
    // Listen to the 'commands' collection for new documents
    const commandsRef = collection(db, "commands");
    const q = query(commandsRef, orderBy("timestamp", "desc"), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      snapshot.docChanges().forEach((change: any) => {
        if (change.type === "added") {
          const data = change.doc.data();
          console.log("New command received:", data);
          callback(data);
        }
      });
    }, (error: any) => {
      console.error("Error listening to commands:", error);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up command listener:", error);
    return () => {};
  }
};

// Send a command to Firebase
export const sendCommand = async (command: CommandData): Promise<boolean> => {
  if (!await initializeFirebase()) {
    toast("Firebase Error", {
      description: "Could not initialize Firebase to send command."
    });
    return false;
  }
  
  try {
    const { collection, addDoc } = await import('firebase/firestore');
    await addDoc(collection(db, "commands"), {
      ...command,
      timestamp: new Date().toISOString()
    });
    console.log("Command sent successfully:", command);
    return true;
  } catch (error) {
    console.error("Error sending command:", error);
    toast("Command Error", {
      description: "Failed to send command to Firebase."
    });
    return false;
  }
};
