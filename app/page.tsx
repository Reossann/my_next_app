// 'use client' を先頭に書くことで、
// ReactのuseStateやuseEffectが使えるインタラクティブなページになります
'use client'; 

import { useState, useEffect } from 'react';

// Todoの型を定義
interface Todo {
  id: number;
  title: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');

  // 1. データの取得 (GET)
  const fetchTodos = async () => {
    try {
      // ↓ ここに { cache: 'no-store' } を追加！
      const response = await fetch('/api/todos', { cache: 'no-store' }); 
      
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    }
  };

  // ページが読み込まれた時に一度だけTodoを取得する
  // ページが読み込まれた時に一度だけTodoを取得する
useEffect(() => {
  // この関数をuseEffectの「内側」で定義する
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos'); 
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    }
  };

  // そして、ここで呼び出す
  fetchTodos();
  
}, []); // 依存配列は空のままでOK

  // 2. データの作成 (POST)
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    
    setNewTitle(''); // 入力欄をクリア
    fetchTodos(); // リストを再読み込み
  };

  // 3. データの削除 (DELETE)
  const handleDeleteTodo = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;

    await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
    
    fetchTodos(); // リストを再読み込み
  };
  
  // 4. データの更新 (PUT) - promptを使った簡易版
  const handleUpdateTodo = async (todo: Todo) => {
    const newTitle = prompt('新しいタイトルを入力', todo.title);
    if (!newTitle || newTitle.trim() === '' || newTitle === todo.title) {
      return;
    }

    await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });

    fetchTodos(); // リストを再読み込み
  };

  return (
    <div>
      <h1>My Perfect Todo App!!</h1>

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="新しいTodoを入力"
        />
        <button type="submit">追加</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <button onClick={() => handleUpdateTodo(todo)}>更新</button>
            <button onClick={() => handleDeleteTodo(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}