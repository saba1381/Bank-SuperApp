import { createSlice } from '@reduxjs/toolkit';

const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

const initialState = {
  mode: systemMode, 
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.mode = action.payload; 
    },
  },
});

export const { toggleTheme , setTheme } = themeSlice.actions;
export default themeSlice.reducer;
