import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fontsource/inter/variable.css"
import "@fontsource/jetbrains-mono"

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import store, { Persistor } from './app/store';

import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
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
);
