import { useState } from 'react';
import { API_ENDPOINT } from '../models/constants';

type TodoProp = {
  onToggle: Function;
  isCompleted: boolean;
  todo: string;
  id: string;
}

export default function TodoComponent(props: TodoProp) {
  const [editMode, setEditMode] = useState(false);
  const [showButton, setShouldShowButton] = useState(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setShowErrorMessage] = useState('');
  const [editTodo, setEditTodo] = useState(props.todo);

  const onChange = async ($event: any) => {
    const updated = !props.isCompleted;
    const res = await fetch(`${ API_ENDPOINT }/${props.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {
        isCompleted: updated,
      } ),
    });
    if (res.status !== 200) {
      setShowErrorMessage(`Fail to update. Please try again later`);
      setShowError(true);
    } else  {
      setShowErrorMessage(``);
      setShowError(false);
    }
  };

  const onEdit = async () => {
    if (!editTodo) {
      setShowErrorMessage('Field cannot be empty');
      setShowError(true);
      return;
    }
      const res = await fetch(`${ API_ENDPOINT }/${props.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
          todo: editTodo,
        } ),
      });
      if (res.status === 200) {
        setEditMode(false);
        setShowErrorMessage('');
        setShowError(false);
      } else if (res.status === 400) {
        setShowErrorMessage(`${ editTodo } is already exists in the list`);
        setShowError(true);
      } else {
        setShowErrorMessage(`Fail to update. Please try again later`);
        setShowError(true);
      }
  }

  const onInputChange = ($event: any) => {
    if ($event.target.value === '') {
      setShowErrorMessage('Field cannot be empty');
      setShowError(true);
    } else {
      if (errorMessage !== '') {
        setShowErrorMessage('');
      }
      if (showError) {
        setShowError(false);
      }
    }
    setEditTodo($event.target.value);
  }

  const onKeyPress = (event: any) => {
    if (event.code === 'Enter') {
      onEdit();
    }
  }

  const propmpUser = async () => {
    const res = window.confirm(`Are you sure you want to delete '${props.todo}'?`);
    if (res) {
      const res = await fetch(`${API_ENDPOINT}/${props.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status !== 204) {
        setShowErrorMessage(`Fail to update. Please try again later`);
        setShowError(true);
      } else {
        setShowErrorMessage(``);
        setShowError(false);
      }
    }
  }

  return <>
    <div className='flex py-1' onMouseEnter={() => setShouldShowButton(true)} onMouseLeave={() => setShouldShowButton(false)}>
      <input type="checkbox" checked={props.isCompleted} onChange={onChange} />
      {!editMode ?
        <>
          <span className={'ml-3 ' + (props.isCompleted ? 'line-through' : '')}>{props.todo}</span>
          {showButton ? 
            <>
              <button className='ml-3' onClick={() => setEditMode(true)}>Edit </button>
              <button className='ml-2' onClick={() => propmpUser()}>Delete </button>
            </> :
            null}
        </> :
        <>
          <div className='py-1'>
            <input className='ml-3' type="text" onChange={onInputChange} value={editTodo} onKeyUp={onKeyPress} />
            <button className='ml-3' onClick={onEdit}>Create</button>
          </div>
        </>
      }
    </div>
    { showError && errorMessage ? <div className=''><p className='ml-4 text-error'>{errorMessage}</p></div> : null}
  </>
}
