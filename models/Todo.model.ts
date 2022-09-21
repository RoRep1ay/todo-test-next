import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export interface Todo {
  id: string;
  todo: string;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}

export interface TodoView {
  id: string;
  todo: string;
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
}

export const firebaseToModel = (doc: QueryDocumentSnapshot<DocumentData>): TodoView => {
  return {
    createdAt: doc.get('createdAt').toDate().toISOString(),
    updatedAt: doc.get('updatedAt').toDate().toISOString(),
    todo: doc.get('todo'),
    id: doc.id,
    isCompleted: doc.get('isCompleted'),
  }
}

export const toView = (todo: Todo): TodoView => {
  return {
    id: todo.id,
    isCompleted: todo.isCompleted,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
    todo: todo.todo
  }
}
