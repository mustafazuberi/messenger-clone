"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store";
import { ThemeProvider } from "@/components/theme-provider";

type Props = {
  children?: React.ReactNode;
};

const StoreProvider = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
