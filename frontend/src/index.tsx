import './index.css';
import "@fontsource/inter"
import "@fontsource/jetbrains-mono"

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import store, { Persistor } from './app/store';

import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: 'check-sso',
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    }}
  >
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={Persistor}>
          <BrowserRouter>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  </ReactKeycloakProvider>
);
