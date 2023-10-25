import { createSlice } from "@reduxjs/toolkit";
import { USERS_INITIAL_STATE } from "../intialState";
import { UsersState } from "@/types/types.state";

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState: USERS_INITIAL_STATE,
  reducers: {
    setAllUsers: (state, action: { payload: UsersState }) => {
      state = action.payload;
      return state;
    },
    clearAllUsers: (state) => USERS_INITIAL_STATE,
  },
});

export const { setAllUsers, clearAllUsers } = allUsersSlice.actions;
export default allUsersSlice.reducer;
