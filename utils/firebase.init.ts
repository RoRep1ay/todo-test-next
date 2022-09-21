import { FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
import { firebaseToModel, TodoView } from "../models/Todo.model";

const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FAPI_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FAUTH_DOMAIN || "todo-interview-d6b98.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FPROJECT_ID || "todo-interview-d6b98",
  storageBucket: process.env.NEXT_PUBLIC_FBUCKET || "todo-interview-d6b98.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FSENDER_ID || "986656118120",
  appId: process.env.NEXT_PUBLIC_FAPP_ID || "1:986656118120:web:5e759b9d7eb7088a3cf2dd"
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

