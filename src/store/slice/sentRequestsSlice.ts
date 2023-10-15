import { createSlice } from "@reduxjs/toolkit";
import { SENT_REQUESTS_INITIAL_STATE } from "../intialState";
import { SentRequestsState } from "@/types/types.state";

const sentRequestsSlice = createSlice({
  name: "sentRequests",
  initialState: SENT_REQUESTS_INITIAL_STATE,
  reducers: {
    setSentRequests: (state, action: { payload: SentRequestsState }) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setSentRequests } = sentRequestsSlice.actions;
export default sentRequestsSlice.reducer;
