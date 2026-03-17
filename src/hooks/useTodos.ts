import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

export const useTodos = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getStorageKey = () => `todos_${user?.id}`;

  // Load todos from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        try {
          setTodos(JSON.parse(stored));
        } catch (error) {
          console.error("Failed to parse todos:", error);
          setTodos([]);
        }
      }
    }
    setIsLoading(false);
  }, [user]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem(getStorageKey(), JSON.stringify(todos));
    }
  }, [todos, user, isLoading]);

  const addTodo = (title: string, description: string = "") => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    updateTodo(id, { completed: !todos.find((t) => t.id === id)?.completed });
  };

  return {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
};
