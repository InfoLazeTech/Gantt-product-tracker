// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { combineReducers } from 'redux';
import processReducer from './features/processSlice';
import recipeReducer from './features/recipeSlice';
import productReducer from './features/productSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [], // optionally, only persist specific reducers
};


const rootReducer = combineReducers({
   process: processReducer,
   recipe: recipeReducer,
   product: productReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
