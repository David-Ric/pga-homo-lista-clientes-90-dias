import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { PortalProvider } from './provider/PortalContext';
import App from './routes/Routes';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const forceServiceWorkerActivation = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'ACTIVATE_NEW_SW' });
      }
    } catch (error) {
      console.error('Erro ao forçar a ativação do Service Worker:', error);
    }
  }
};

forceServiceWorkerActivation();

root.render(
  // <React.StrictMode>
  <PortalProvider>
    <App />
  </PortalProvider>
  // </React.StrictMode>
);
