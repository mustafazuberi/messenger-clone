import { configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";
import thunk from "redux-thunk";
import persistedReducer from "./persistConfig";

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

export default store;
