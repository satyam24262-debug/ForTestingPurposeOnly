import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state, action) => {
      state.user = null;
    },
  },
});

export const { setUser, setLoading, setLogout } = authSlice.actions;
export default authSlice.reducer;
