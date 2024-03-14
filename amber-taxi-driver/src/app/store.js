import { configureStore } from '@reduxjs/toolkit';
import { driverStateReducer } from '../redux';

export const store = configureStore({
  reducer: {
    driverStatus: driverStateReducer,
  },
});