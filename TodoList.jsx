import { useState } from 'react';

// Дочерний компонент
function TodoItem({ todo, onToggle }) {
  return (
    <li 
      onClick={() => onToggle(todo.id)} 
      className={todo.done ? 'done' : ''}
    >
      {todo.text}
    </li>
  );
}

// Главный компонент списка задач
export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Выучить React', done: false },
    { id: 2, text: 'Сдать лабу', done: false }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() === '') return;
    const newTodo = { id: Date.now(), text: inputValue, done: false };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const handleToggle = (id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="card">
      <h2>Список задач</h2>
      <div className="input-group">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Новая задача..."
        />
        <button onClick={handleAdd}>Добавить</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
        ))}
      </ul>
    </div>
  );
}