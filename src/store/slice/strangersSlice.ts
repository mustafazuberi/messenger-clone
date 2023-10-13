import { createSlice } from "@reduxjs/toolkit";
import { STRANGERS_INITIAL_STATE } from "../intialState";
import { StrangersState } from "@/types/types.state";

const strangersSlice = createSlice({
  name: "strangerUsers",
  initialState: STRANGERS_INITIAL_STATE,
  reducers: {
    setStrangerUsers: (state, action: { payload: StrangersState }) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setStrangerUsers } = strangersSlice.actions;
export default strangersSlice.reducer;
