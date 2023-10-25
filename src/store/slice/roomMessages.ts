import { createSlice } from "@reduxjs/toolkit";
import { ROOMS_MESSAGES_INITIAL_STATE } from "../intialState";
import { RoomsMessages } from "@/types/types.state";

const roomsMessagesSlice = createSlice({
  name: "roomsMessages",
  initialState: ROOMS_MESSAGES_INITIAL_STATE,
  reducers: {
    setRoomsMessages: (state, action: { payload: RoomsMessages }) => {
      state = action.payload;
      return state;
    },
    clearRoomsMessages: (state) => ROOMS_MESSAGES_INITIAL_STATE,
  },
});

export const { setRoomsMessages, clearRoomsMessages } =
  roomsMessagesSlice.actions;
export default roomsMessagesSlice.reducer;
