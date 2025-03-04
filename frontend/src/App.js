import { Loader, Error } from "./components";

import { useState } from "react";

import { BrowserRouter } from "react-router";

import { AppStateContext, SidebarStateContext } from "./contexts";

import AppRoutes from "./routes";

import "./scss/style.scss";
import "./App.css";

const DEFAULT_APP_STATE = {
  isLoading: false,
  error: null,
};

const DEFAULT_SIDEBAR_STATE = {
  isOpen: true,
};

function App() {
  const [appState, setAppState] = useState(DEFAULT_APP_STATE);
  const [sidebarState, setSidebarState] = useState(DEFAULT_SIDEBAR_STATE);

  const handleAppStateChange = (isLoading = false, error = null) => {
    setAppState((prevAppState) => ({
      ...prevAppState,
      isLoading,
      error,
    }));
  };

  const handleSidebarStateChange = (isOpen = false) => {
    setSidebarState((prevSidebarState) => ({
      ...prevSidebarState,
      isOpen: isOpen,
    }));
  };

  return (
    <AppStateContext.Provider
      value={{ appState, setAppState: handleAppStateChange }}
    >
      <SidebarStateContext.Provider
        value={{ sidebarState, setSidebarState: handleSidebarStateChange }}
      >
        <BrowserRouter>
          {appState.isLoading && <Loader />}
          {!appState.isLoading && appState.error && <Error />}
          <AppRoutes />
        </BrowserRouter>
      </SidebarStateContext.Provider>
    </AppStateContext.Provider>
  );
}

export default App;
