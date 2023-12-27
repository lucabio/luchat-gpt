import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from '../pages/Login/Login';
import AuthCallback from '../pages/AuthCallback/AuthCallback';
import Chat from '../pages/Chat/Chat';

function App() {
  return (
    <div className="App">
      <main className="App-main">
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/intelaigen-chat" element={<Chat />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
