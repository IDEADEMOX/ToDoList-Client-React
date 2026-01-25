import { useState, useEffect } from 'react';
import './App.css';
import { todoAPI } from './api/todoApi';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoAPI.getAllTodos();
      setTodos(data);
    } catch (err) {
      setError('获取待办事项失败，请检查后端服务是否启动');
      console.error('获取待办事项失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const newTodo = await todoAPI.createTodo(inputText.trim());
      setTodos([...todos, newTodo]);
      setInputText('');
    } catch (err) {
      setError('添加待办事项失败');
      console.error('添加失败:', err);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const updatedTodo = await todoAPI.updateTodo(id, {
        completed: !todo.completed
      });
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      setError('更新待办事项失败');
      console.error('更新失败:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError('删除待办事项失败');
      console.error('删除失败:', err);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="app-container">
      <div className="header">
        <h1>📝 待办事项清单</h1>
        <p>高效管理你的每一天</p>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={addTodo} className="input-group">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="添加新的待办事项..."
        />
        <button type="submit">添加</button>
      </form>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              全部 ({todos.length})
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              进行中 ({activeCount})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              已完成 ({completedCount})
            </button>
          </div>

          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>
                {filter === 'all' ? '暂无待办事项，添加一个吧！' :
                 filter === 'active' ? '太棒了！所有任务都已完成' :
                 '还没有已完成的任务'}
              </p>
            </div>
          ) : (
            <ul className="todo-list">
              {filteredTodos.map((todo) => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span className="todo-text">{todo.text}</span>
                  <div className="todo-actions">
                    <button
                      className="btn-delete"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      删除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {todos.length > 0 && (
            <div className="stats">
              <span>总任务: {todos.length}</span>
              <span>已完成: {completedCount}</span>
              <span>进行中: {activeCount}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
