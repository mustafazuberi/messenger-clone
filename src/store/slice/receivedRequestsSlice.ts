import { createSlice } from "@reduxjs/toolkit";
import { RECEIVED_REQUESTS_INITIAL_STATE } from "../intialState";
import { ReceivedRequestsState } from "@/types/types.state";

const receivedRequestsSlice = createSlice({
  name: "receivedRequests",
  initialState: RECEIVED_REQUESTS_INITIAL_STATE,
  reducers: {
    setReceivedRequests: (
      state,
      action: { payload: ReceivedRequestsState }
    ) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setReceivedRequests } = receivedRequestsSlice.actions;
export default receivedRequestsSlice.reducer;
