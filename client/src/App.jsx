import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Join from './Join';
import Chat from './Chat';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' Component={Join} />
        <Route path='/Chat/:socket/:username/:room' Component={Chat} />
      </Routes>
    </Router>
  )
}

export default App
