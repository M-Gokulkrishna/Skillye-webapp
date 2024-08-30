import './App.css';
import 'aos/dist/aos.css';
import App from './App.jsx';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { configureStore } from '@reduxjs/toolkit';
import setToastReducer from './ReduxStates/ToastState.js';
import setInputValue from './ReduxStates/searchInputState.js';
import setLoadingFlag from './ReduxStates/loadingFlagState.js';

const reduxStore = configureStore({
  reducer: {
    searchInputValue: setInputValue,
    LoaderStateFlag: setLoadingFlag,
    ToastState: setToastReducer
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={reduxStore}>
      <App />
    </Provider>
  </StrictMode>
)
