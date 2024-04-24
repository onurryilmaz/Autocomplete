import { configureStore } from '@reduxjs/toolkit';
import characterSlice from '@/redux/slices/characterSlice';

export const store = configureStore({
   reducer: {
      characterSlice: characterSlice,
   },
});

export type RootState = ReturnType<typeof store.getState>;
