import { createSlice } from "@reduxjs/toolkit";
import { CALLS_INITIAL_STATE } from "../intialState";
import { Call } from "@/types/types.call";

const callsSlice = createSlice({
  name: "callsSlice",
  initialState: CALLS_INITIAL_STATE,
  reducers: {
    setCalls: (state, action: { payload: Call[] }) => {
      state.calls = [...action.payload];
      return state;
    },
    setActiveCall: (state, action: { payload: Call }) => {
      state.activeCall = { ...action.payload };
      return state;
    },
    clearActiveCall: (state) => {
      state.activeCall = CALLS_INITIAL_STATE.activeCall;
      return state;
    },
  },
});

export const { setCalls, setActiveCall, clearActiveCall } = callsSlice.actions;

export default callsSlice.reducer;
