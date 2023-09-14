// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import bhashini from 'bhashini-translation'; // Import the library

// Initialize the library with your authentication details
bhashini.auth("a2c070edfa364531af47e222ab658cd9", "58c22f8ce3-9166-4b9c-b4ad-99f415a95e00", "Qcd-UpioPP2lwNoSOc0HYFecw54ga4B1pkWi0WPA00hSWByD4ncX1l2KOTbWiFBX");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
