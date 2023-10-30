import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FRIENDS_INITIAL_STATE } from "../intialState";
import { FriendsState } from "@/types/types.state";
import Friend from "@/types/type.friend";
import { OnlineInfo } from "@/types/types.miscellaneous";

const friendsSlice = createSlice({
  name: "myFriends",
  initialState: FRIENDS_INITIAL_STATE,
  reducers: {
    setMyFriends: (state, action: { payload: FriendsState }) => {
      state = action.payload;
      return state;
    },
  
    clearFriends: () => FRIENDS_INITIAL_STATE,
  },
});

export const { setMyFriends, clearFriends } =
  friendsSlice.actions;
export default friendsSlice.reducer;
