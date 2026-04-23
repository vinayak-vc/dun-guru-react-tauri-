import React from 'react';
import ReactDOMClient from 'react-dom/client';
import { StrictMode } from 'react';
import App from '@/app/App';
import './styles/index.css';

const root = ReactDOMClient.createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
