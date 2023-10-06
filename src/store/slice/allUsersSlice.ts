import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getAllUsers from "@/services/firebase-firestore/getAllUsers";
import User from "@/types/types.user";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

export const ALL_USERS_INITIAL_STATE = {
  allUsers: [] as User[],
  status: STATUSES.IDLE as string,
};

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (): Promise<User[]> => {
    const users: User[] = await getAllUsers();
    return users;
  }
);

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState: ALL_USERS_INITIAL_STATE,
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

export default allUsersSlice.reducer;
