import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ALL_USERS_INITIAL_STATE } from "../intialState";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

const productSlice = createSlice({
  name: "users",
  initialState: {
    allUsers: ALL_USERS_INITIAL_STATE,
    status: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = STATUSES.IDLE;
        state.allUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = STATUSES.ERROR;
      });
  },
});

// export const { setProducts, setStatus } = productSlice.actions;
export default productSlice.reducer;

// Thunks
export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();
  return data;
});
