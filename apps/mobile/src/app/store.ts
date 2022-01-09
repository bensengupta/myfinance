import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import accountsReducer from '../features/accounts/accountsSlice';
import categoriesSlice from '../features/categories/categoriesSlice';
import transactionsSlice from '../features/transactions/transactionsSlice';

const rootReducer = combineReducers({
  accounts: accountsReducer,
  categories: categoriesSlice,
  transactions: transactionsSlice,
});

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  whitelist: [],
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer); // Create a new reducer with our existing reducer

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
