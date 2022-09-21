import { doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import Head from 'next/head';
import { useEffect, useState } from 'react';
import CreateTodoComponent from '../components/CreateTodo.component';
import TodoComponent from '../components/Todo.component';
import { firebaseToModel, TodoView, toView } from '../models/Todo.model';
import styles from '../styles/Home.module.css';
import { db, getTodos, TODO_COLLECTION } from '../utils/firebase.init';

export async function getServerSideProps() {
  const res: TodoView[] = (await getTodos());
  return {
    props: { todos: res }, // will be passed to the page component as props
  }
}

const Home = ({ todos: initTodos }: { todos: TodoView[] }) => {
  const [todoList, setTodoList] = useState<TodoView[]>(initTodos);
  const [todoListToShow, setTodoListToShow] = useState<TodoView[]>(initTodos);
  const [filter, setFilter] = useState<string>('');
  let filterTimeout: NodeJS.Timeout;

  const onToggle = async (id: string, value: boolean) => {
    const idRef = doc(db, "todos", id);
    await updateDoc(idRef, {
      isCompleted: value,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  }

  useEffect(() => {
    const q = query(TODO_COLLECTION, orderBy("createdAt", "asc"));;
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todos: TodoView[] = querySnapshot.docs.map(firebaseToModel);
      setTodoList(() => todos);
    });
    return () => {
      unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (!filter) {
      setTodoListToShow(todoList);
    } else {
      const l = todoList.filter(it => it.todo.includes(filter));
      setTodoListToShow(l);
    }
  }, [todoList, filter])

  const onChange = ($event: any) => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      setFilter($event.target.value)
    }, 500)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Simple Todo List</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='mx-auto width-80 mt-2'>
        <div className='flex ml-3'>
          <h3>Search Todo</h3>
          <input className='ml-3 width-40' type="text" onChange={onChange} />
        </div>

        <ul>
          {todoListToShow.length > 0 ? todoListToShow.map(it => <TodoComponent key={it.id} id={it.id} onToggle={onToggle} isCompleted={it.isCompleted} todo={it.todo} />) : <p className='text-warn'>There is no results matching the query</p>}

          <hr />
          <CreateTodoComponent />
        </ul>
      </main>
    </div>
  )
}

export default Home
