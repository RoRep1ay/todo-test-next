// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next'
import { firebaseToModel } from '../../../models/Todo.model';
import { db, TODO_COLLECTION } from '../../../utils/firebase.init';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;
  const { todoId } = req.query;
  if (method && typeof todoId === 'string') {
    const idRef = doc(db, "todos", todoId);
    const data = await getDoc(idRef);

    if (!data.exists()) {
      res.status(404).json({ message: 'not found' });
      return;
    }

    switch (method) {
      case 'GET':
        const todoView = firebaseToModel(data);
        res.status(200).json(todoView);
        return;
      case 'DELETE':
        await deleteDoc(doc(db, 'todos', todoId));
        res.status(204).end();
        return;
      case 'PATCH':
        const { todo: editTodo, isCompleted: editIsCompleted } = req.body;

        if (typeof editTodo === 'string' || typeof editIsCompleted === 'boolean') {
          const dto: any = {
            updatedAt: Timestamp.fromDate(new Date()),
          };

          if (editTodo) {
            const searchExistingTodo = query(TODO_COLLECTION, where("todo", "==", editTodo,),);

            const result = (await getDocs(searchExistingTodo)).docs.map(firebaseToModel).filter(it => it.id !== todoId);

            if (result.length === 0) {
              dto.todo = editTodo;
              if (typeof editIsCompleted !== 'undefined') {
                dto.isCompleted = editIsCompleted;
              }
            } else {
              res.status(400).json({ message: `todo with name: ${editTodo} is already exists ` })
              return;
            }
          } else {
            dto.isCompleted = editIsCompleted;
          }
          await updateDoc(idRef, dto);
          const updated = await getDoc(idRef)
          if (updated.exists()) {
            const todoView = firebaseToModel(updated);
            res.status(200).json(todoView);
          } else {
            res.status(404).json({message: 'not found'});
          }
        } else {
          res.status(400).json({ message: 'invalid request body. todo(type string) or isCompleted(type boolean) is required' });
        }
        return;
      default:
        res.status(400).json({ message: 'invalid request method' });
        return;
    }
  }
}
