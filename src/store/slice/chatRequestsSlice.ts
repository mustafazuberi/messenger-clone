import { createSlice } from "@reduxjs/toolkit";
import { CHATREQUESTS_INITIAL_STATE } from "../intialState";
import { Status } from "@/types/types.state";
import ChatRequest from "@/types/types.request";

type ReqsPayloadType = { status: Status; data: ChatRequest[] };

const chatRequestsSlice = createSlice({
  name: "chatRequests",
  initialState: CHATREQUESTS_INITIAL_STATE,
  reducers: {
    setRequests: (state, action: { payload: ReqsPayloadType }) => {
      state.requests = action.payload;
      return state;
    },
    setSentRequests: (state, action: { payload: ReqsPayloadType }) => {
      state.sentRequests = action.payload;
      return state;
    },
    setReceivedRequests: (state, action: { payload: ReqsPayloadType }) => {
      state.receivedRequests = action.payload;
      return state;
    },
  },
});

export const { setRequests, setSentRequests, setReceivedRequests } =
  chatRequestsSlice.actions;
export default chatRequestsSlice.reducer;
