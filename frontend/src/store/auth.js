import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, isAdmin: false },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.isAdmin = action.payload.isAdmin || false; // Add admin flag
    },
    logout(state) {
      state.isLoggedIn = false;
      state.isAdmin = false;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
