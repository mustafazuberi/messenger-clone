import { createSlice } from "@reduxjs/toolkit";
import { FRIENDS_INITIAL_STATE } from "../intialState";
import { FriendsState } from "@/types/types.state";

const friendsSlice = createSlice({
  name: "myFriends",
  initialState: FRIENDS_INITIAL_STATE,
  reducers: {
    setMyFriends: (state, action: { payload: FriendsState }) => {
      state = action.payload;
      return state;
    },
    clearFriends: (state) => FRIENDS_INITIAL_STATE,
  },
});

export const { setMyFriends ,clearFriends} = friendsSlice.actions;
export default friendsSlice.reducer;
