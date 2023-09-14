// src/App.js

import React from 'react';
import './App.css';
import Translation from './Translation'; // Import the Translation component
import ASR from './ASR';

function App() {
  return (
    <div className="App">
      <main>
        <ASR/>
        {/* <Translation /> Use the Translation component */}
      </main>
    </div>
  );
}

export default App;