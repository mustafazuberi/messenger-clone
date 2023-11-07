import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import userReducer from "@/store/slice/userSlice";
import allUsersReducer from "@/store/slice/allUsersSlice";
import authenticationStatusSliceReducer from "@/store/slice/authenticationStatusSlice";
import themeReducer from "@/store/slice/themeSlice";
import friendsReducer from "@/store/slice/friendsSlice";
import chatRequestsReducer from "@/store/slice/chatRequestsSlice";
import notificationsReducer from "@/store/slice/notificationsSlice";
import roomsReducer from "@/store/slice/roomsSlice";
import activeRoomReducer from "@/store/slice/activeRoomSlice";
import activeUsersReducer from "@/store/slice/activeUsersSlice";

const rootReducer = combineReducers({
  currentUser: userReducer,
  allUsers: allUsersReducer,
  authenticationStatus: authenticationStatusSliceReducer,
  theme: themeReducer,
  friends: friendsReducer,
  chatRequests: chatRequestsReducer,
  notifications: notificationsReducer,
  rooms: roomsReducer,
  activeRoom: activeRoomReducer,
  activeUsers: activeUsersReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "currentUser",
    "allUsers",
    "authenticationStatus",
    "theme",
    "friends",
    "chatRequests",
    "notifications",
    "rooms",
    "activeUsers",
  ],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export default persistedReducer;
