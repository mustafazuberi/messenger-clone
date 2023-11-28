import { createSlice } from "@reduxjs/toolkit";
import { USER_INITIAL_STATE } from "../intialState";
import User from "@/types/types.user";

const userSlice = createSlice({
  name: "user",
  initialState: USER_INITIAL_STATE,
  reducers: {
    updateUserDetails: (state: User, action: { payload: User }) => {
      state = action.payload;
      return state;
    },
    clearCurrentUser: (state) => USER_INITIAL_STATE,
  },
});

export const { updateUserDetails, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
