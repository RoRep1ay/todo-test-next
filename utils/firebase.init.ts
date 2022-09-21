import { FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
import { firebaseToModel, TodoView } from "../models/Todo.model";

const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_F_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_F_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_F_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_F_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_F_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_F_APP_ID || ""
};

function createFirebaseApp(config: FirebaseOptions, retry = 0) {
  try {
    return getApp();
  } catch {
    try {
      return initializeApp(config);
    } catch (error) {
      console.log('error initializing ', error);
      process.exit(-1);
    }
  }
}

const firebaseApp = createFirebaseApp(config);
export const db = getFirestore(firebaseApp);
export const TODO_COLLECTION = collection(db, 'todos');

// Get a list of cities from your database
export async function getTodos() {
  const todosCol = query(collection(db, 'todos'), orderBy("createdAt", "asc"));
  const todoSnapshot = await getDocs(todosCol);
  const todoList: TodoView[] = todoSnapshot.docs.map(firebaseToModel);
  return todoList;
}

