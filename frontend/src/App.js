import { Loader, Error, Success } from "./components";

import { useState } from "react";

import { BrowserRouter } from "react-router";

import {
  AppStateContext,
  MachinesContext,
  SidebarStateContext,
} from "./contexts";

import AppRoutes from "./routes";

import "./scss/style.scss";
import "./App.css";

const DEFAULT_APP_STATE = {
  isLoading: false,
  error: null,
  success: null,
};

const DEFAULT_SIDEBAR_STATE = {
  isOpen: true,
};

const DEFAULT_MACHINES = [];

function App() {
  const [appState, setAppState] = useState(DEFAULT_APP_STATE);
  const [sidebarState, setSidebarState] = useState(DEFAULT_SIDEBAR_STATE);
  const [machines, setMachines] = useState(DEFAULT_MACHINES);

  const handleAppStateChange = (
    isLoading = false,
    error = null,
    success = null
  ) => {
    setAppState((prevAppState) => ({
      ...prevAppState,
      isLoading,
      error,
      success,
    }));
  };

  const handleSidebarStateChange = (isOpen = false) => {
    setSidebarState((prevSidebarState) => ({
      ...prevSidebarState,
      isOpen: isOpen,
    }));
  };

  return (
    <MachinesContext.Provider value={{ machines, setMachines }}>
      <AppStateContext.Provider
        value={{ appState, setAppState: handleAppStateChange }}
      >
        <SidebarStateContext.Provider
          value={{ sidebarState, setSidebarState: handleSidebarStateChange }}
        >
          <BrowserRouter>
            {appState.isLoading && <Loader />}
            {!appState.isLoading && appState.error && <Error />}
            {!appState.isLoading && appState.success && <Success />}
            <AppRoutes />
          </BrowserRouter>
        </SidebarStateContext.Provider>
      </AppStateContext.Provider>
    </MachinesContext.Provider>
  );
}

export default App;
