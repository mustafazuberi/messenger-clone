import { createSlice } from "@reduxjs/toolkit";
import { ACTIVE_ROOM_INITIAL_STATE } from "../intialState";
import { ActiveRoom, ActiveRoomMessages } from "@/types/chatRoom";

const activeRoomSlice = createSlice({
  name: "activeRoom",
  initialState: ACTIVE_ROOM_INITIAL_STATE,
  reducers: {
    setActiveRoom: (state, action: { payload: ActiveRoom }) => {
      state = { ...action.payload };
      return state;
    },
    setActiveRoomMessages: (state, action: { payload: ActiveRoomMessages }) => {
      state.messages = {
        status: action.payload.status,
        data: [...action.payload.data],
      };
    },
    clearActiveRoom: () => ACTIVE_ROOM_INITIAL_STATE,
  },
});

export const { setActiveRoom, clearActiveRoom, setActiveRoomMessages } =
  activeRoomSlice.actions;
export default activeRoomSlice.reducer;
