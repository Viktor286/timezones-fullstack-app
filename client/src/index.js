import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { getLocalUserAuth, getLocalUserSettings } from './model/localStore';
// import reportWebVitals from './reportWebVitals';

const localUserSettings = getLocalUserSettings();
const localUserAuth = getLocalUserAuth();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <App localUserSettings={localUserSettings} localUserAuth={localUserAuth} />,
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
