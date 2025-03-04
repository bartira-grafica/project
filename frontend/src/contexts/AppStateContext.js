import { createContext } from "react";

const DEFAULT_VALUE = {
  appState: {
    isLoading: false,
    error: null,
  },
  setAppState: () => {},
};

const AppStateContext = createContext(DEFAULT_VALUE);

export default AppStateContext;
