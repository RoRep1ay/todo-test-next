// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { query } from '@firebase/firestore';
import { collection, doc, getDocs, orderBy, setDoc, Timestamp, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { firebaseToModel } from '../../models/Todo.model';
import { db, TODO_COLLECTION } from '../../utils/firebase.init';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { todo: newTodo, isCompleted: newIsCompleted } = req.body;

  if (req.method === 'GET') {
    const { todo } = req.query;
    const q = query(TODO_COLLECTION, orderBy("createdAt", "asc"));;

    const todoList = (await getDocs(q)).docs.map(firebaseToModel);

    if (typeof todo === 'string') {
      res.status(200).json({ items: todoList.filter(it => it.todo.includes(todo)) });
    } else {
      res.status(200).json({ items: todoList });
    }

  } else if (req.method === 'POST') {
    if (typeof newTodo === 'string') {
      const searchExistingTodo = query(TODO_COLLECTION, where("todo", "==", newTodo));
      const result = ( await getDocs(searchExistingTodo) ).docs.map(firebaseToModel);
      if (result.length !== 0) {
        res.status(400).json({message: 'todo is already exists'});
        return;
      }

      const newDto = {
        isCompleted: typeof newIsCompleted === 'boolean' ? newIsCompleted : false,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        todo: newTodo,
      }

      const collections = doc(collection(db, 'todos'));
      await setDoc(collections, newDto);

      const newResult = ( await getDocs(searchExistingTodo) ).docs.map(firebaseToModel);

      if (newResult.length > 0) {
        res.status(200).json(newResult[0]);
      } else {
        res.status(500).json({message: 'fail to reate'})
      }
    } else {
      res.status(400).json({ message: 'invalid request body, todo must not be an empty string' });
    }
  } else {
    res.status(400).json({ message: 'invalid request method'});
  }
}
