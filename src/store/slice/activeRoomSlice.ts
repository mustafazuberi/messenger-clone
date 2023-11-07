import { createSlice } from "@reduxjs/toolkit";
import { ACTIVE_ROOM_INITIAL_STATE } from "../intialState";
import { ActiveRoom } from "@/types/chatRoom";

const activeRoomSlice = createSlice({
  name: "activeRoom",
  initialState: ACTIVE_ROOM_INITIAL_STATE,
  reducers: {
    setActiveRoom: (state, action: { payload: ActiveRoom }) => {
      state = { ...action.payload };
      return state;
    },
    clearActiveRoom: () => ACTIVE_ROOM_INITIAL_STATE,
  },
});

export const { setActiveRoom, clearActiveRoom } = activeRoomSlice.actions;
export default activeRoomSlice.reducer;
