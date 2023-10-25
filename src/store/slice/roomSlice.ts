import { createSlice } from "@reduxjs/toolkit";
import { ROOM_INITIAL_STATE } from "../intialState";
import { Room, Rooms } from "@/types/types.state";
import Message from "@/types/types.message";
import Friend from "@/types/type.friend";

const roomReducer = createSlice({
  name: "room",
  initialState: ROOM_INITIAL_STATE,
  reducers: {
    chatWith: (state, action: { payload: Friend }) => {
      state.chatWih = action.payload;
      return state;
    },
    setAllRooms: (state, action: { payload: Rooms }) => {
      state.allRooms = action.payload;
      return state;
    },
    setActiveRoom: (state, action: { payload: Room }) => {
      state.activeRoom = action.payload;
      return state;
    },
    setActiveRoomMessages: (state, action: { payload: Message[] }) => {
      state.activeRoom.messages = action.payload;
      return state;
    },
    setActiveRoomLastMessage: (state, action: { payload: Message }) => {
      state.activeRoom.lastMessage = action.payload;
      return state;
    },
    addRoom: (state, action: { payload: Room }) => {
      state.allRooms[action.payload.id] = action.payload;
      return state;
    },
    deleteRoom: (state, action: { payload: { id: string } }) => {
      delete state.allRooms[action.payload.id];
      return state;
    },
  },
});

export const {
  chatWith,
  setAllRooms,
  setActiveRoom,
  setActiveRoomMessages,
  addRoom,
  deleteRoom,
} = roomReducer.actions;

export default roomReducer.reducer;
