import { createSlice } from "@reduxjs/toolkit";
import { ACTIVE_USERS_INITIAL_STATE } from "../intialState";
import { OnlineInfo } from "@/types/types.miscellaneous";

const activeUsersSlice = createSlice({
  name: "activeUsers",
  initialState: ACTIVE_USERS_INITIAL_STATE,
  reducers: {
    setActiveUsers: (
      state,
      action: { payload: { [x: string]: OnlineInfo } }
    ) => {
      state = { ...action.payload };
      return state;
    },
    clearCurrentUserActiveStatus: (state, action: { payload: string }) => {
      state = { [action.payload]: { isActive: false, lastActive: Date.now() } };
      return state;
    },
  },
});

export const { setActiveUsers, clearCurrentUserActiveStatus } =
  activeUsersSlice.actions;
export default activeUsersSlice.reducer;
