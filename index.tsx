
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Inicialização segura do DOM
const container = document.getElementById('root');

if (!container) {
  throw new Error("Falha ao encontrar o elemento raiz 'root' no index.html. Verifique a estrutura do DOM.");
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
