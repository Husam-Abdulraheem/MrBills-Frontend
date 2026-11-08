import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

document.addEventListener('deviceready', () => {
  if (navigator && navigator.splashscreen) {
    navigator.splashscreen.hide();
  }

  // Only render React after Cordova is ready
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}, false);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
