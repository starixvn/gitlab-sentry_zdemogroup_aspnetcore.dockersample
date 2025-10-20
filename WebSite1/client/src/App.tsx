import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>React + TypeScript + Vite</h1>
        <p>Testing with Jest & React Testing Library</p>
      </header>
      
      <main className="app-main">
        <div className="counter-card">
          <h2>Counter Demo</h2>
          <p className="count-display">Count: {count}</p>
          <div className="button-group">
            <button 
              onClick={() => setCount(count + 1)}
              className="btn btn-primary"
            >
              Increment
            </button>
            <button 
              onClick={() => setCount(count - 1)}
              className="btn btn-secondary"
            >
              Decrement
            </button>
            <button 
              onClick={() => setCount(0)}
              className="btn btn-reset"
            >
              Reset
            </button>
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Built with ❤️ using Vite, React, TypeScript & Jest</p>
      </footer>
    </div>
  );
}

export default App;

