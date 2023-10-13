import { createSlice } from "@reduxjs/toolkit";
import { STRANGERS_INITIAL_STATE } from "../intialState";
import Stranger from "@/types/types.stranger";

const strangersSlice = createSlice({
  name: "strangerUsers",
  initialState: STRANGERS_INITIAL_STATE,
  reducers: {
    setStrangerUsers: (state, action: { payload: Stranger[] }) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setStrangerUsers } = strangersSlice.actions;
export default strangersSlice.reducer;
