import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <-- This line is required for Tailwind!
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import App from './App';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="light" // or use 'dark' if your app is dark-themed
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />

    </Provider>
  </React.StrictMode>
);
