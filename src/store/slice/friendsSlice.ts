import { createSlice } from "@reduxjs/toolkit";
import { FRIENDS_INITIAL_STATE } from "../intialState";
import Friend from "@/types/type.friend";
import { FriendsState } from "@/types/types.state";

const friendsSlice = createSlice({
  name: "myFriends",
  initialState: FRIENDS_INITIAL_STATE,
  reducers: {
    setMyFriends: (state, action: { payload: FriendsState }) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setMyFriends } = friendsSlice.actions;
export default friendsSlice.reducer;
