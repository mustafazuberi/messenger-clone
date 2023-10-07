"use client";

import { Provider } from "react-redux";
import { ThemeProvider } from "@/components/theme-provider";
import store from "@/store";

type Props = {
  children?: React.ReactNode;
};

const StoreProvider = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    </Provider>
  );
};

export default StoreProvider;
