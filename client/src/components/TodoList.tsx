import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Todo } from '../models/Todo';
import { API_URL } from '../constants';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch todos from server
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/todos`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTodos(response.data);
      } catch (err) {
        console.error('Error fetching todos:', err);
        setError('Failed to load todos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Function to handle deletion of a todo
  const handleDelete = async (todoId: string) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${todoId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo.');
    }
  };

  // Function to handle todo completion toggling
  const toggleComplete = async (todoId: string, completed: boolean) => {
    try {
      await axios.put(`${API_URL}/api/todos/${todoId}`, { completed: !completed }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTodos(todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !completed } : todo
      ));
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo.');
    }
  };

  // Conditionally render components based on loading state or error presence
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="todo-list">
      {todos.length === 0 ? (
        <div>No todos available</div>
      ) : (
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={handleDelete}
            onToggleComplete={toggleComplete}
          />
        ))
      )}
    </div>
  );
};

export default TodoList;

### TodoItem.tsx
import React from 'react';
import { Todo } from '../models/Todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: (todoId: string) => void;
  onToggleComplete: (todoId: string, completed: boolean) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onToggleComplete }) => {
  return (
    <div className="todo-item border p-4 mb-2 rounded-md shadow-md flex justify-between items-center">
      <div className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
        <h3 className="font-semibold text-lg">{todo.title}</h3>
        <p>{todo.description}</p>
        <p className="text-xs text-gray-400">Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
        <p className="text-xs">Priority: {todo.priority}</p>
      </div>
      <div className="ml-4 flex items-center space-x-2">
        <button onClick={() => onToggleComplete(todo.id, todo.completed)} className="px-2 py-1 bg-blue-500 text-white rounded">
          {todo.completed ? 'Undo' : 'Complete'}
        </button>
        <button onClick={() => onDelete(todo.id)} className="px-2 py-1 bg-red-500 text-white rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;

### models/Todo.ts
export interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
}

### constants/index.ts
export const API_URL = 'http://localhost:8001';

This Typescript code represents a fully functional `TodoList` component and its associated `TodoItem` for displaying and managing todos in the `todotoday` React application. It connects with a backend service to perform CRUD operations, handles errors, and displays loading states.