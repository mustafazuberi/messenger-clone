import userReducer from "@/store/slice/userSlice";
import allUsersReducer from "@/store/slice/allUsersSlice";
import authenticationStatusSliceReducer from "@/store/slice/authenticationStatusSlice";
import themeReducer from "@/store/slice/themeSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  currentUser: userReducer,
  allUsers: allUsersReducer,
  authenticationStatus: authenticationStatusSliceReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
