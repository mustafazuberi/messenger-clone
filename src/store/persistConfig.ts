import userReducer from "@/store/slice/userSlice";
import allUsersReducer from "@/store/slice/allUsersSlice";
import authenticationStatusSliceReducer from "@/store/slice/authenticationStatusSlice";
import themeReducer from "@/store/slice/themeSlice";
import friendsReducer from "@/store/slice/friendsSlice";
import chatRequestsReducer from "@/store/slice/chatRequestsSlice";
import notificationsReducer from "@/store/slice/notificationsSlice";
import roomReducer from "@/store/slice/roomSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  currentUser: userReducer,
  allUsers: allUsersReducer,
  authenticationStatus: authenticationStatusSliceReducer,
  theme: themeReducer,
  friends: friendsReducer,
  chatRequests: chatRequestsReducer,
  notifications: notificationsReducer,
  room: roomReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
