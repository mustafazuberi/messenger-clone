import { createSlice } from "@reduxjs/toolkit";
import { USERS_INITIAL_STATE } from "../intialState";
import User from "@/types/types.user";

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState: USERS_INITIAL_STATE,
  reducers: {
    setAllUsers: (state, action: { payload: User[] }) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setAllUsers } = allUsersSlice.actions;
export default allUsersSlice.reducer;
