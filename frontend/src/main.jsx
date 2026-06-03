import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store } from './Store/store.js';
import React from 'react';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="119993985760-9d0dj4enbaeumr8oc4kfnkg1f3hbu8as.apps.googleusercontent.com">
    <Provider store={store}>
      {/* <React.StrictMode> */}
        <App />
      {/* </React.StrictMode> */}
    </Provider>
  </GoogleOAuthProvider>
);
