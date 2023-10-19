import { createSlice } from "@reduxjs/toolkit";
import { NOTIFICATIONS_INITIAL_STATE } from "../intialState";
import { NotificationsState } from "@/types/types.state";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: NOTIFICATIONS_INITIAL_STATE,
  reducers: {
    setNotifications: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
