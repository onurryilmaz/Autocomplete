import { createSlice } from '@reduxjs/toolkit';
import { CharacterSearch, Character } from '@/redux/slices/characterTypes';

const character: CharacterSearch = {
   info: {
      count: 0,
      pages: 0,
      next: null,
      prev: null,
   },
   results: undefined,
};

const initialState: Character = {
   status: '',
   loading: true,
   error: '',
   characterSearch: { ...character },
};

const categoriesSlice = createSlice({
   name: 'Characters',
   initialState,
   reducers: {
      CharacterSearchAction(state, action) {
         state.characterSearch = action.payload?.data;
         state.loading = false;
         state.status = action.payload?.status;
         state.error = action.payload?.error;
      },
   },
});

export const { CharacterSearchAction } = categoriesSlice.actions;
export default categoriesSlice.reducer;
