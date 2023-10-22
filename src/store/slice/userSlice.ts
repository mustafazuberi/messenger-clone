import { createSlice } from "@reduxjs/toolkit";
import { USER_INITIAL_STATE } from "../intialState";
import User from "@/types/types.user";

const userSlice = createSlice({
  name: "user",
  initialState: USER_INITIAL_STATE,
  reducers: {
    updateUserDetails: (state: User, action) => {
      state = action.payload;
      return state;
    }
  },
});

export const { updateUserDetails } = userSlice.actions;
export default userSlice.reducer;
