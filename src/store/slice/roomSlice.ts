import { createSlice } from "@reduxjs/toolkit";
import { ROOMS_INITIAL_STATE } from "../intialState";
import Room from "@/types/types.room";

const roomsSlice = createSlice({
  name: "rooms",
  initialState: ROOMS_INITIAL_STATE,
  reducers: {
    setRooms: (state, action: { payload: Room[] }) => {
      state = [...action.payload];
      return state;
    },
    clearRooms: (state) => ROOMS_INITIAL_STATE,
  },
});

export const { setRooms,clearRooms } = roomsSlice.actions;
export default roomsSlice.reducer;
