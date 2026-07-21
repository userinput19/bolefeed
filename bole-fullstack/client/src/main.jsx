import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <App />
          <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1B4D2E',
              color: '#fff',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 600,
              borderRadius: '12px',
              padding: '12px 18px',
            },
            error: {
              style: { background: '#C62828' }
            },
          }}
        />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
