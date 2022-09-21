import { useState } from 'react';
import { API_ENDPOINT } from '../models/constants';

export default function CreateTodoComponent(props: any) {
  const [showError, setShowError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodo, setNewTodo] = useState('');

  const onCreate = async () => {
    if (!newTodo) {
      setShowError(true);
      return;
    }

    setIsDisabled(true);
    const result = await fetch(`${API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        todo: newTodo,
        isCompleted: false
      }),
    });
    setIsDisabled(false);
      if (result.status === 200) {
        setNewTodo('');
        setShowError(false);
        setErrorMessage('');
      } else if (result.status === 400) {
        setErrorMessage(`${ newTodo } is already exists in the list`);
        setShowError(true);
      } else {
        setErrorMessage(`Fail to update. Please try again later`);
        setShowError(true);
      }
  }

  const onKeyPress = (event: any) => {
    if (event.code === 'Enter') {
      onCreate();
    }
  }

  const onValueChange = ($event: any) => {
    const { value } = $event.target;
    if (showError) {
      setShowError(false);
    }
    if (errorMessage !== '') {
      setErrorMessage('');
    }
    setNewTodo(value);
  }


  return <div className='mt-2'>
    <div className=''>
      <input type='text' autoFocus className='width-40' value={newTodo} onChange={onValueChange} onKeyUp={onKeyPress} />

      <button onClick={onCreate} disabled={isDisabled} className='ml-3'>Create</button>

    </div>
    {
      showError && errorMessage ? 
      <p className='text-error'> { errorMessage }</p>
      : null
    }
  </div>;
}
