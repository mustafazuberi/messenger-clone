import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/slice/userSlice";
import allUsersReducer from "@/store/slice/allUsersSlice";
import authenticationStatusSliceReducer from "@/store/slice/authenticationStatusSlice";
import themeReducer from "@/store/slice/themeSlice";

const store = configureStore({
  reducer: {
    currentUser: userReducer,
    allUsers: allUsersReducer,
    authenticationStatus: authenticationStatusSliceReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
